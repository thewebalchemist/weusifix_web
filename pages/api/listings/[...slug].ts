// pages/api/[...slug].ts

import { adminAuth } from '@/lib/firebase-admin';
import clientPromise from '@/lib/mongodb';
import slugify from 'slugify';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify Firebase ID token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    (req as any).user = decodedToken;
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }

  const client = await clientPromise;
  const db = client.db();
  const { slug } = req.query;

  if (!Array.isArray(slug) || slug.length < 2) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  const [listingType, listingSlug] = slug;
  const singularType = listingType.slice(0, -1);

  if (req.method === 'GET') {
    try {
      const listing = await db.collection('listings').findOne({ listingType: singularType, slug: listingSlug });
      if (!listing) {
        return res.status(404).json({ error: 'Listing not found' });
      }
      res.status(200).json(listing);
    } catch (error) {
      console.error('Error fetching listing:', error);
      res.status(500).json({ error: 'Failed to fetch listing' });
    }
  } else if (req.method === 'PUT') {
    try {
      const updates = req.body;
      if (updates.title) {
        updates.slug = await createUniqueSlug(db, updates.title, singularType);
      }
      const result = await db.collection('listings').updateOne(
        { listingType: singularType, slug: listingSlug, userId: (req as any).user.uid },
        { $set: updates }
      );
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Listing not found' });
      }
      res.status(200).json({ 
        message: 'Listing updated successfully', 
        newSlug: updates.slug || listingSlug 
      });
    } catch (error) {
      console.error('Error updating listing:', error);
      res.status(500).json({ error: 'Failed to update listing' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const result = await db.collection('listings').deleteOne({ 
        listingType: singularType, 
        slug: listingSlug, 
        userId: (req as any).user.uid 
      });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Listing not found' });
      }
      res.status(200).json({ message: 'Listing deleted successfully' });
    } catch (error) {
      console.error('Error deleting listing:', error);
      res.status(500).json({ error: 'Failed to delete listing' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function createUniqueSlug(db, title: string, listingType: string) {
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