// pages/stays/index.tsx

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { BadgeCheck, Coffee, Heart, Sunrise } from 'lucide-react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

interface Stay {
  id: string;
  listing_type: 'stay';
  title: string;
  description: string;
  location: string;
  address: string;
  images: string[];
  price_currency: string;
  amenities?: string[];
  slug: string;
  category: string;
  stay_price: number;
}

const StaysPage: React.FC = () => {
  const [listings, setListings] = useState<Stay[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    fetchListings();
  }, [page, searchTerm]);

  const fetchListings = async () => {
    try {
      let query = supabase
        .from('listings')
        .select('*')
        .eq('listing_type', 'stay')
        .order('created_at', { ascending: false })
        .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        setListings(prevListings => page === 1 ? data : [...prevListings, ...data]);
        setHasMore(data.length === ITEMS_PER_PAGE);
      }
    } catch (error) {
      console.error('Error fetching stays:', error);
    }
  };

  const handleShowMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchListings();
  };

  const getRandomAmenities = (amenities: string[] | undefined, count: number): string[] => {
    if (!amenities || amenities.length === 0) {
      return ['No amenities listed'];
    }
    const shuffled = [...amenities].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  };

  const renderCard = (listing: Stay) => (
    <Link href={`/stays/${listing.slug}`} key={listing.id}>
      <div className="relative rounded-2xl border border-gray-300 dark:border-gray-700 cursor-pointer" >
              <div className="p-2">
                <div className="relative">
                  <img src={listing.images[0]} alt={listing.title} className="w-full h-40 object-cover rounded-2xl" />
                  <span className="absolute flex gap-1 items-center justify-between top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    <BadgeCheck className='w-3.5 h-3.5' />
                    Verified
                  </span>
                </div>
              </div>
              <div className="py-4 px-2 flex flex-col justify-between">
                <div className=" flex justify-between items-center py-2">
                  <span className="px-3 py-1 rounded-full text-sm text-primary bg-blue-100">
                    {listing.category}
                  </span>
                  <span className='text-sm text-gray-600 dark:text-gray-300'>
                    <span className='font-bold'>{listing.price_currency} {listing.stay_price}/</span> night
                  </span>
                </div>
                <div>
                  <h2 className='text-gray-800 dark:text-white'>{listing.title.substring(0, 25)}</h2>
                  <p className='text-gray-500 dark:text-gray-500'>{listing.address}</p>
                </div>
              </div>
              <div className="p-2">
                <div className='flex justify-between space-x-4'>
                  <span className='flex items-center cursor-pointer text-gray-700 dark:text-white rounded-full p-2 bg-gray-200 dark:bg-gray-600'><Heart /></span>
                  <button className="bg-primary hover:bg-transparent border border-primary hover:text-primary text-white w-full py-2 rounded-2xl">View Details</button>
                </div>
              </div>
            </div>
          </Link>
  );

  return (
    <div className="py-28 lg:py-32 mx-auto lg:max-w-6xl py-8 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Stays</h1>

      {/* Stays Ad Banners */}
      <section className='mt-16'>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Card className="bg-blue-100 dark:bg-blue-900 overflow-hidden">
                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-2xl font-bold text-blue-800 dark:text-blue-200">Escape to Paradise</CardTitle>
                    <Sunrise className="text-yellow-500" size={32} />
                  </div>
                  <p className="text-blue-700 dark:text-blue-300 mb-4">Discover hidden gems and luxurious retreats. Book now and get 20% off on stays of 3 nights or more!</p>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                    <Link href='/stays'>
                      Explore Dreamy Stays
                    </Link>
                  </Button>
                  <img
                    src="/images/stays.jpg"
                    alt="Luxurious beach resort"
                    className="absolute -right-20 -bottom-20 w-2/3 h-2/3 object-cover rounded-full"
                  />
                </CardContent>
              </Card>

              <Card className="bg-purple-100 dark:bg-purple-900">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-2xl font-bold text-purple-800 dark:text-purple-200">Urban Adventures Await</CardTitle>
                    <Coffee className="text-purple-500" size={32} />
                  </div>
                  <p className="text-purple-700 dark:text-purple-300 mb-4">Experience the pulse of city life with our curated selection of downtown stays. Enjoy exclusive perks and local insights!</p>
                  <ul className="list-disc list-inside text-purple-600 dark:text-purple-400 mb-4">
                    <li>Complimentary welcome drinks</li>
                    <li>Access to premium city tours</li>
                    <li>24/7 concierge service</li>
                  </ul>
                  <Button className="bg-purple-500 hover:bg-purple-600 text-white">Discover City Escapes</Button>
                </CardContent>
              </Card>
            </div>
          </section>
      
      {/* <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="Search stays..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit">Search</Button>
        </div>
      </form> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {listings.map((listing) => renderCard(listing))}
      </div>

      {hasMore && (
        <div className="text-center mt-8">
          <Button onClick={handleShowMore}>Show More</Button>
        </div>
      )}
    </div>
  );
};

export default StaysPage;