// pages/api/users/[uid].ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getCollection } from '@/lib/mongodb';
import { adminAuth } from '@/lib/firebase-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { uid } = req.query;

  if (typeof uid !== 'string') {
    return res.status(400).json({ error: 'Invalid UID' });
  }

  try {
    // Verify the Firebase token
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    if (decodedToken.uid !== uid) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const usersCollection = await getCollection('users');

    if (req.method === 'POST') {
      // Create or update user
      const { email, phoneNumber, name } = req.body;
      const now = new Date();
      const userData = {
        uid,
        email,
        phoneNumber,
        name,
        updatedAt: now,
        hasListings: false,
        profilePic: null,
        bio: '',
        socialMedia: {
          website: '',
          facebook: '',
          twitter: '',
          instagram: '',
          youtube: ''
        }
      };

      const result = await usersCollection.findOneAndUpdate(
        { uid },
        { 
          $set: userData,
          $setOnInsert: { createdAt: now }
        },
        { upsert: true, returnDocument: 'after' }
      );

      if (result.value) {
        res.status(200).json(result.value);
      } else {
        res.status(500).json({ error: 'Failed to create or update user' });
      }
    } else if (req.method === 'GET') {
      // Fetch user data
      const user = await usersCollection.findOne({ uid });
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } else {
      res.setHeader('Allow', ['POST', 'GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in user API route:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}