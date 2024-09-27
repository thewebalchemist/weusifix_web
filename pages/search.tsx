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
  location: string | { city?: string; country?: string } | undefined;
  price: number;
  images: string[];
  eventDate?: string;
  eventTime?: string;
  checkInTime?: string;
  checkOutTime?: string;
  duration?: string;
  slug: string;
  serviceCategory?: string;
  stayType?: string;
  eventType?: string;
  experienceType?: string;
}

interface SearchPageProps {
  listings: Listing[];
  initialQuery: string;
}

const SearchPage: React.FC<SearchPageProps> = ({ listings, initialQuery }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);

  useEffect(() => {
    filterListings();
  }, [searchQuery]);

  const filterListings = () => {
    let filtered: Listing[];
    if (searchQuery.trim() === '') {
      // If no query, show a mix of different listing types, up to 10 total
      const typeMap = new Map<string, Listing[]>();
      listings.forEach(listing => {
        if (!typeMap.has(listing.type)) {
          typeMap.set(listing.type, []);
        }
        typeMap.get(listing.type)!.push(listing);
      });

      filtered = Array.from(typeMap.values())
        .flatMap(typeListing => typeListing.slice(0, 3))
        .slice(0, 10);
    } else {
      // Filter based on search query
      filtered = listings.filter(listing =>
        (typeof listing.title === 'string' && listing.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof listing.description === 'string' && listing.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof listing.location === 'string' && listing.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof listing.location === 'object' && listing.location && 
          ((listing.location.city && listing.location.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (listing.location.country && listing.location.country.toLowerCase().includes(searchQuery.toLowerCase()))))
      ).slice(0, 10);
    }
    setFilteredListings(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push({
      pathname: '/search',
      query: { query: searchQuery }
    }, undefined, { shallow: true });
  };

  const renderCard = (listing: Listing) => {
    const getLocationString = (location: Listing['location']): string => {
      if (typeof location === 'string') return location;
      if (typeof location === 'object' && location) {
        return [location.city, location.country].filter(Boolean).join(', ');
      }
      return 'Location not specified';
    };

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
            {listing.type 
              ? listing.type.charAt(0).toUpperCase() + listing.type.slice(1)
              : 'Unknown Type'}
            </span>
            <h2 className='mt-2 text-lg font-semibold text-gray-800 dark:text-white'>{listing.title}</h2>
            <p className='text-sm text-gray-500 dark:text-gray-400'>{getLocationString(listing.location)}</p>
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
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="What are you looking for?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow"
            />
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
  const { query } = context.query;
  const client = await clientPromise;
  const db = client.db();

  const listings = await db.collection('listings').find({}).toArray();

  return {
    props: {
      listings: JSON.parse(JSON.stringify(listings)),
      initialQuery: query || '',
    },
  };
};

export default SearchPage;