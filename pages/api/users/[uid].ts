// pages/api/users/[uid].ts

import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/lib/firebase-admin';
import { getCollection } from '@/lib/mongodb';

async function verifyToken(req: NextApiRequest): Promise<string | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

async function getUser(uid: string) {
  const usersCollection = await getCollection('users');
  return usersCollection.findOne({ uid });
}

async function createUser(uid: string, email: string, role: string) {
  const usersCollection = await getCollection('users');
  const newUser = { 
    uid, 
    email, 
    role,
    createdAt: new Date()
  };
  await usersCollection.insertOne(newUser);
  return newUser;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authenticatedUid = await verifyToken(req);
  if (!authenticatedUid) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { uid } = req.query;
  if (typeof uid !== 'string') {
    return res.status(400).json({ error: 'Invalid UID' });
  }

  // Ensure the authenticated user is only accessing their own data
  if (authenticatedUid !== uid) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const user = await getUser(uid);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
      } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
      }
      break;

    case 'POST':
      try {
        const { email, role } = req.body;
        if (!email || !role) {
          return res.status(400).json({ error: 'Email and role are required' });
        }
        const newUser = await createUser(uid, email, role);
        res.status(201).json(newUser);
      } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}