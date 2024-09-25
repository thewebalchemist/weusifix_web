// pages/api/users/[id].ts

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
  const { uid } = req.query;

  if (req.method === 'GET') {
    try {
      const user = await db.collection('users').findOne({ uid });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  } else if (req.method === 'PUT') {
    try {
      const updates = req.body;
      const result = await db.collection('users').updateOne(
        { uid },
        { $set: updates }
      );
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}