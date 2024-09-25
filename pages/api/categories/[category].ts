import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { category } = req.query;
  const client = await clientPromise;
  const db = client.db();

  try {
    const listings = await db.collection('listings')
      .find({ listingType: category })
      .sort({ createdAt: -1 })
      .limit(20)  // Limit to 20 listings per page
      .toArray();

    res.status(200).json(listings);
  } catch (error) {
    console.error('Error fetching category listings:', error);
    res.status(500).json({ error: 'Failed to fetch category listings' });
  }
}