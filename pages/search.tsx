import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Search, BadgeCheck, Calendar, Clock, MapPin, Users, Heart } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

interface Listing {
  id: string;
  listing_type: 'service' | 'event' | 'stay' | 'experience';
  title: string;
  description: string;
  location: string;
  price: number;
  images: string[];
  event_date?: string;
  event_time?: string;
  check_in_time?: string;
  check_out_time?: string;
  duration?: string;
  slug: string;
  service_category?: string;
  stay_type?: string;
  event_type?: string;
  experience_type?: string;
  address: string;
  amenities?: string[];
  isIndividual?: boolean;
}

const SearchPage: React.FC = () => {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { query, location, category, startDate, endDate, guests } = router.query;
    if (query) setSearchQuery(query as string);
    if (location) setSearchLocation(location as string);
    if (category) setCategory(category as string);
    if (startDate) setStartDate(startDate as string);
    if (endDate) setEndDate(endDate as string);
    if (guests) setGuests(Number(guests));

    fetchListings();
  }, [router.query]);

  useEffect(() => {
    filterListings();
  }, [listings, searchQuery, searchLocation, category, startDate, endDate, guests]);

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      let query = supabase.from('listings').select('*');
      
      if (category) {
        query = query.eq('listing_type', category.toLowerCase().slice(0, -1));
      }

      const { data, error } = await query;
      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterListings = () => {
    let filtered = listings;

    if (searchQuery) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (searchLocation) {
      filtered = filtered.filter(listing =>
        listing.location.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    if (startDate) {
      filtered = filtered.filter(listing =>
        listing.listing_type !== 'stay' || 
        (listing.check_in_time && new Date(listing.check_in_time) >= new Date(startDate))
      );
    }

    if (endDate) {
      filtered = filtered.filter(listing =>
        listing.listing_type !== 'stay' || 
        (listing.check_out_time && new Date(listing.check_out_time) <= new Date(endDate))
      );
    }

    if (guests) {
      filtered = filtered.filter(listing => 
        listing.max_guests === undefined || listing.max_guests >= guests
      );
    }

    setFilteredListings(filtered);
  };


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push({
      pathname: '/search',
      query: {
        query: searchQuery,
        location: searchLocation,
        category,
        startDate,
        endDate,
        guests
      }
    }, undefined, { shallow: true });
  };

  const renderCard = (listing: Listing) => {
    const listingTypeToPlural: Record<string, string> = {
      service: 'services',
      stay: 'stays',
      event: 'events',
      experience: 'experiences'
    };

    const listingUrl = `/${listingTypeToPlural[listing.listing_type]}/${listing.slug}`;

    switch (listing.listing_type) {
      case 'service':
        return (
          <Link href={listingUrl} key={listing.id}>
            <div className="relative rounded-2xl bg-white dark:bg-gray-800 cursor-pointer">
              <div className="p-2">
                <div className="relative">
                  <img src={listing.images[0]} alt={listing.title} className="w-full h-48 object-cover rounded-2xl" />
                  <span className="absolute flex gap-1 items-center justify-between top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    <BadgeCheck className='w-3.5 h-3.5' />
                    Verified
                  </span>
                  <span className="absolute flex gap-1 items-center justify-between bottom-2 left-2 bg-blue-100 text-primary text-sm font-semibold px-3 py-1 rounded-full">
                    {listing.service_category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="px-3 py-1 rounded-full text-sm text-primary bg-green-100">
                    {listing.isIndividual ? 'Individual' : 'Business'}
                  </span>
                </div>
                <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-1'>{listing.title.substring(0, 25)}</h2>
                <div className="flex items-center mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{listing.address.substring(0, 20)}</span>
                </div>
                <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>{listing.description.substring(0, 50)}...</p>
                <div className="">
                  <div className='flex justify-between space-x-4'>
                    <span className='flex items-center cursor-pointer text-gray-700 dark:text-white rounded-full p-2 bg-gray-200 dark:bg-gray-600'><Heart /></span>
                    <button className="bg-primary hover:bg-transparent border border-primary hover:text-primary text-white w-full py-2 rounded-2xl">View Details</button>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      case 'stay':
        return (
          <Link href={listingUrl} key={listing.id}>
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
                    Stay
                  </span>
                  <span className='text-sm text-gray-600 dark:text-gray-300'>
                    <span className='font-bold'>${listing.price}/</span> night
                  </span>
                </div>
                <div>
                  <h2 className='text-gray-800 dark:text-white'>{listing.title}</h2>
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
      case 'event':
        return (
          <Link href={listingUrl} key={listing.id}>
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
                    Event
                  </span>
                </div>
                <div>
                  <h2 className='text-gray-800 dark:text-white'>{listing.title}</h2>
                  <p className='text-gray-400 dark:text-gray-600 text-sm'>{listing.location}</p>
                  <span className='text-sm text-gray-800 dark:text-gray-100'>
                    From
                    <span className='font-bold'> ${listing.price}/</span> ticket
                  </span>
                </div>
              </div>
              <div className="mx-2 px-3 py-2 text-center text-md text-white rounded-xl bg-red-400">
                {/* Add countdown logic here */}
                Coming Soon
              </div>
              <div className="p-2">
                <div className='flex justify-between space-x-4'>
                  <span className='flex items-center cursor-pointer text-white rounded-full p-2 bg-gray-300'><Heart /></span>
                  <button className="hover:bg-transparent border border-white hover:border-primary bg-primary hover:text-primary w-full py-2 rounded-2xl">Book Now</button>
                </div>
              </div>
            </div>
          </Link>
        );
      case 'experience':
        return (
          <Link href={listingUrl} key={listing.id}>
            <div className="relative rounded-2xl overflow-hidden h-80 w-64 cursor-pointer" >
              <div className="absolute inset-0">
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="absolute top-0 left-0 right-0 p-4 ">
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 rounded-full text-sm text-primary bg-blue-100 bg-opacity-80">
                    Experience
                  </span>
                  <span className='flex items-center cursor-pointer text-white rounded-full p-2 bg-gray-700 bg-opacity-80'><Heart className='h-4 w-4' /></span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gray-600 bg-opacity-80 p-4 rounded-b-2xl">
                <h2 className="text-white text-lg font-semibold mb-1">{listing.title}</h2>
                <p className="mb-2 text-gray-200 text-sm">{listing.location}</p>
                <span className="text-sm text-white py-2 px-3 bg-primary bg-opacity-50 rounded-full">
                  <span className="font-bold">${listing.price}/</span> person
                </span>
              </div>
            </div>
          </Link>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen lg:max-w-5xl mx-auto py-5 px-4 sm:px-6 lg:px-8">
      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Search Results
        </h1>

        <form onSubmit={handleSearch} className="mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              type="text"
              placeholder="What are you looking for?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Location"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Services">Services</SelectItem>
                <SelectItem value="Events">Events</SelectItem>
                <SelectItem value="Stays">Stays</SelectItem>
                <SelectItem value="Experiences">Experiences</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Guests"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              min={1}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
        </form>

        {isLoading ? (
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">Loading...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => renderCard(listing))}
            </div>

            {filteredListings.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
                No results found. Try adjusting your search criteria.
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default SearchPage;