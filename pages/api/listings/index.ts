// pages/api/listings/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split('Bearer ')[1];
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (req.method === 'POST') {
    try {
      const listing = req.body;
      const { data, error } = await supabase.from('listings').insert({
        ...listing,
        user_id: user.id,
      }).select();

      if (error) throw error;

      await supabase.from('profiles').update({ has_listings: true }).eq('user_id', user.id);

      res.status(201).json({ 
        message: 'Listing created successfully', 
        id: data[0].id,
        slug: data[0].slug
      });
    } catch (error) {
      console.error('Error creating listing:', error);
      res.status(500).json({ error: 'Failed to create listing' });
    }
  } else if (req.method === 'GET') {
    try {
      const { data, error } = await supabase.from('listings').select('*').eq('user_id', user.id);
      if (error) throw error;
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching listings:', error);
      res.status(500).json({ error: 'Failed to fetch listings' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}