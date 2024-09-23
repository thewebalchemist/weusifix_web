import { adminAuth } from '../../../lib/firebase-admin';
import clientPromise from '../../../lib/mongodb';

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
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const listing = await db.collection('listings').findOne({ listingId: id, userId: req.user.uid });
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
      const result = await db.collection('listings').updateOne(
        { listingId: id, userId: req.user.uid },
        { $set: updates }
      );
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Listing not found' });
      }
      res.status(200).json({ message: 'Listing updated successfully' });
    } catch (error) {
      console.error('Error updating listing:', error);
      res.status(500).json({ error: 'Failed to update listing' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const result = await db.collection('listings').deleteOne({ listingId: id, userId: req.user.uid });
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