import { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth } from '@/lib/firebase-admin';
import { getCollection } from '@/lib/mongodb';

async function verifyToken(req: NextApiRequest): Promise<string | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
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

async function createOrUpdateUser(uid: string, userData: any) {
  const usersCollection = await getCollection('users');
  const { email, phoneNumber, name } = userData;
  
  const updateData = {
    uid,
    email,
    phoneNumber,
    name,
    updatedAt: new Date()
  };

  const result = await usersCollection.findOneAndUpdate(
    { uid },
    { 
      $set: updateData,
      $setOnInsert: { createdAt: new Date(), hasListings: false }
    },
    { upsert: true, returnDocument: 'after' }
  );

  return result.value;
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
        const { email, phoneNumber, name } = req.body;
        if (!email) {
          return res.status(400).json({ error: 'Email is required' });
        }
        const updatedUser = await createOrUpdateUser(uid, { email, phoneNumber, name });
        res.status(200).json(updatedUser);
      } catch (error) {
        console.error('Error creating/updating user:', error);
        res.status(500).json({ error: 'Failed to create/update user' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}