import { getSession } from 'next-auth/react';
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const client = await clientPromise;
  const db = client.db();

  if (req.method === 'POST') {
    try {
      const listing = req.body;
      listing.createdAt = new Date();
      listing.userId = session.user.uid;
      
      // Validate required fields based on listing type
      const requiredFields = {
        all: ['title', 'description', 'location', 'address'],
        service: ['serviceCategory'],
        event: ['eventDate', 'eventTime', 'capacity', 'eventPricing'],
        stay: ['checkInTime', 'checkOutTime', 'stayPrice', 'stayAvailability'],
        experience: ['experienceCategory', 'duration', 'included', 'groupSize', 'experiencePricing']
      };

      const missingFields = [
        ...requiredFields.all,
        ...requiredFields[listing.listingType]
      ].filter(field => !listing[field]);

      if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
      }

      const result = await db.collection('listings').insertOne(listing);
      
      res.status(201).json({ message: 'Listing created successfully', id: result.insertedId });
    } catch (error) {
      console.error('Error creating listing:', error);
      res.status(500).json({ error: 'Failed to create listing' });
    }
  } else if (req.method === 'GET') {
    try {
      const listings = await db.collection('listings').find({ userId: session.user.uid }).toArray();
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