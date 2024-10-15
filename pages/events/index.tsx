// pages/events/index.tsx

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { BadgeCheck, Clock, Heart } from 'lucide-react';

interface Event {
  id: string;
  listing_type: 'event';
  title: string;
  description: string;
  location: string;
  address: string;
  images: string[];
  price: number;
  slug: string;
  event_date: string;
  category: string;
  event_pricing: Array<{ type: string; price: number }>;
  price_currency: string;
}

const EventsPage: React.FC = () => {
  const [listings, setListings] = useState<Event[]>([]);
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
        .eq('listing_type', 'event')
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
      console.error('Error fetching events:', error);
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

  const calculateTimeLeft = (eventDate: string) => {
    const difference = +new Date(eventDate) - +new Date();
    let timeLeft = '';

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);

      if (days > 0) {
        timeLeft = `${days} days left`;
      } else if (hours > 0) {
        timeLeft = `${hours} hours left`;
      } else if (minutes > 0) {
        timeLeft = `${minutes} minutes left`;
      } else {
        timeLeft = 'Starting soon';
      }
    } else {
      timeLeft = 'Event ended';
    }

    return timeLeft;
  };

  const renderCard = (listing: Event) => (
    <Link href={`/events/${listing.slug}`} key={listing.id}>
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
                <div className="flex justify-between items-center py-2">
                  <span className="px-3 py-1 rounded-full text-sm text-primary bg-blue-100">
                    {listing.category}
                  </span>
                </div>
                <div>
                <h2 className='text-gray-800 dark:text-white'>{listing.title.substring(0, 25)}</h2>
                <p className='text-gray-400 dark:text-gray-600 text-sm'>{listing.address}</p>
                <span className='text-sm text-gray-800 dark:text-gray-100'>
                  From
                  <span className='font-bold'> {listing.price_currency} {Math.min(...listing.event_pricing.map(ticket => Number(ticket.price)))}/</span> ticket
                </span>
              </div>
              </div>
              <div className="flex justify-center items-center gap-2 mx-2 px-3 py-2 text-center text-md text-white rounded-xl bg-red-500">
                <Clock />
              {calculateTimeLeft(listing.event_date)}
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
      <h1 className="text-4xl font-bold mb-8 text-center">Events</h1>
      
      {/* <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="Search events..."
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

export default EventsPage;