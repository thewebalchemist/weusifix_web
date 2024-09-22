// pages/api/users.ts
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { uid, email, role } = req.body;
      const client = await clientPromise;
      const db = client.db();

      await db.collection('users').insertOne({
        uid,
        email,
        role,
        createdAt: new Date(),
      });

      res.status(201).json({ message: 'User role saved successfully' });
    } catch (error) {
      console.error('Error saving user role:', error);
      res.status(500).json({ error: 'Failed to save user role' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}