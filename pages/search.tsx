import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Search, BadgeCheck, Heart, Calendar, Clock, MapPin } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import clientPromise from '@/lib/mongodb';

interface Listing {
  _id: string;
  type: 'service' | 'event' | 'stay' | 'experience';
  title: string;
  description: string;
  location: string;
  price: number;
  images: string[];
  eventDate?: string;
  eventTime?: string;
  checkInTime?: string;
  checkOutTime?: string;
  duration?: string;
  slug: string;
}

interface SearchPageProps {
  listings: Listing[];
  initialQuery: string;
  initialLocation: string;
  initialCategory: string;
  initialStartDate: string;
  initialEndDate: string;
  initialGuests: number;
}

const SearchPage: React.FC<SearchPageProps> = ({ 
  listings, 
  initialQuery, 
  initialLocation, 
  initialCategory,
  initialStartDate,
  initialEndDate,
  initialGuests
}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchLocation, setSearchLocation] = useState(initialLocation);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [guests, setGuests] = useState(initialGuests);

  const filteredListings = listings.filter(listing => {
    const matchesCategory = listing.type === activeCategory.toLowerCase().slice(0, -1) || activeCategory === 'All';
    const matchesQuery = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = listing.location.toLowerCase().includes(searchLocation.toLowerCase());
    
    let matchesDates = true;
    if (activeCategory === 'Stays' || activeCategory === 'Events' || activeCategory === 'Experiences') {
      const listingDate = new Date(listing.eventDate || listing.checkInTime || '');
      const searchStart = new Date(startDate);
      const searchEnd = new Date(endDate);
      matchesDates = (!startDate || listingDate >= searchStart) && (!endDate || listingDate <= searchEnd);
    }

    return matchesCategory && matchesQuery && matchesLocation && matchesDates;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push({
      pathname: '/search',
      query: {
        query: searchQuery,
        location: searchLocation,
        category: activeCategory,
        startDate,
        endDate,
        guests
      }
    });
  };

  const renderCard = (listing: Listing) => {
    return (
      <Link href={`/${listing.type}s/${listing.slug}`} key={listing._id}>
        <div className="relative rounded-2xl border border-gray-300 dark:border-gray-700 cursor-pointer">
          <div className="p-2">
            <img src={listing.images[0]} alt={listing.title} className="w-full h-40 object-cover rounded-2xl" />
            <span className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
              <BadgeCheck className='inline-block w-3.5 h-3.5 mr-1' />
              Verified
            </span>
          </div>
          <div className="p-4">
            <span className="px-3 py-1 rounded-full text-sm text-primary bg-blue-100">
              {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}
            </span>
            <h2 className='mt-2 text-lg font-semibold text-gray-800 dark:text-white'>{listing.title}</h2>
            <p className='text-sm text-gray-500 dark:text-gray-400'>{listing.location}</p>
            <p className='mt-2 text-lg font-bold text-gray-900 dark:text-white'>${listing.price}</p>
            {listing.type === 'event' && (
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{listing.eventDate}</span>
                <Clock className="ml-4 mr-2 h-4 w-4" />
                <span>{listing.eventTime}</span>
              </div>
            )}
            {listing.type === 'stay' && (
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <Clock className="mr-2 h-4 w-4" />
                <span>Check-in: {listing.checkInTime}</span>
              </div>
            )}
            {listing.type === 'experience' && (
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <Clock className="mr-2 h-4 w-4" />
                <span>{listing.duration}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Search Results
        </h1>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-wrap gap-4">
            <Input
              type="text"
              placeholder="What are you looking for?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow"
            />
            <Input
              type="text"
              placeholder="Location"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="flex-grow"
            />
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="All">All Categories</option>
              <option value="Services">Services</option>
              <option value="Stays">Stays</option>
              <option value="Events">Events</option>
              <option value="Experiences">Experiences</option>
            </select>
            {(activeCategory === 'Stays' || activeCategory === 'Events' || activeCategory === 'Experiences') && (
              <>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="flex-grow"
                />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="flex-grow"
                />
                <Input
                  type="number"
                  placeholder="Guests"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="flex-grow"
                  min="1"
                />
              </>
            )}
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </div>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => renderCard(listing))}
        </div>

        {filteredListings.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
            No results found. Try adjusting your search criteria.
          </p>
        )}
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query, location, category, startDate, endDate, guests } = context.query;
  const client = await clientPromise;
  const db = client.db();

  const listings = await db.collection('listings').find({}).toArray();

  return {
    props: {
      listings: JSON.parse(JSON.stringify(listings)),
      initialQuery: query || '',
      initialLocation: location || '',
      initialCategory: category || 'All',
      initialStartDate: startDate || '',
      initialEndDate: endDate || '',
      initialGuests: Number(guests) || 1,
    },
  };
};

export default SearchPage;