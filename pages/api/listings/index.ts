// pages/api/listings/index.ts
import { adminAuth } from '@/lib/firebase-admin';
import clientPromise from '@/lib/mongodb';
import slugify from 'slugify';

export default async function handler(req, res) {
  // Verify Firebase ID token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }

  const client = await clientPromise;
  const db = client.db();

  if (req.method === 'POST') {
    try {
      const listing = req.body;
      listing.userId = req.user.uid;
      listing.createdAt = new Date();
      
      // Generate a unique slug for the listing
      listing.slug = await createUniqueSlug(db, listing.title, listing.listingType);
      
      const result = await db.collection('listings').insertOne(listing);
      
      // Update user's hasListings flag
      await db.collection('users').updateOne(
        { uid: req.user.uid },
        { $set: { hasListings: true } }
      );
      
      res.status(201).json({ 
        message: 'Listing created successfully', 
        id: result.insertedId,
        slug: listing.slug
      });
    } catch (error) {
      console.error('Error creating listing:', error);
      res.status(500).json({ error: 'Failed to create listing' });
    }
  } else if (req.method === 'GET') {
    try {
      const listings = await db.collection('listings').find({ userId: req.user.uid }).toArray();
      res.status(200).json(listings);
    } catch (error) {
      console.error('Error fetching listings:', error);
      res.status(500).json({ error: 'Failed to fetch listings' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function createUniqueSlug(db, title, listingType) {
  let slug = slugify(title, { lower: true, strict: true });
  let uniqueSlug = slug;
  let count = 0;

  while (true) {
    const existingListing = await db.collection('listings').findOne({ 
      listingType, 
      slug: uniqueSlug 
    });

    if (!existingListing) {
      return uniqueSlug;
    }

    count++;
    uniqueSlug = `${slug}-${count}`;
  }
}