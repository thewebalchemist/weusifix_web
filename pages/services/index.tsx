// pages/services/index.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge, BadgeCheck, Briefcase, Heart, MapPin, Zap } from 'lucide-react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

interface Listing {
  id: string;
  listing_type: 'service';
  title: string;
  description: string;
  location: string;
  address: string;
  images: string[];
  category: string;
  is_individual: boolean;
  price: number;
  slug: string;
}

const ServicesPage: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [providerType, setProviderType] = useState('');
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    fetchListings();
  }, [page, searchTerm, selectedCategory, providerType]);

  const fetchListings = async () => {
    try {
      let query = supabase
        .from('listings')
        .select('*')
        .eq('listing_type', 'service')
        .order('created_at', { ascending: false })
        .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }
      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }
      if (providerType) {
        query = query.eq('is_individual', providerType === 'individual');
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        setListings(prevListings => page === 1 ? data : [...prevListings, ...data]);
        setHasMore(data.length === ITEMS_PER_PAGE);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
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

  const renderCard = (listing: Listing) => (
    <Link href={`/services/${listing.slug}`} key={listing.id}>
            <div className="relative rounded-2xl bg-white dark:bg-black cursor-pointer">
              <div className="p-2">
                <div className="relative">
                  <img src={listing.images[0]} alt={listing.title} className="w-full h-48 object-cover rounded-2xl" />
                  <span className="absolute flex gap-1 items-center justify-between top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    <BadgeCheck className='w-3.5 h-3.5' />
                    Verified
                  </span>
                  <span className="absolute flex gap-1 items-center justify-between bottom-2 left-2 bg-blue-100 text-primary text-sm font-semibold px-3 py-1 rounded-full">
                    {listing.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="px-3 py-1 rounded-full text-sm text-primary bg-green-100">
                    {listing.is_individual ? 'Individual' : 'Business'}
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

  return (
    <div className="py-28 lg:py-32 mx-auto lg:max-w-6xl py-8 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Services</h1>
      
      {/* Services Ad Banners */}
      <section className='mt-16'>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Card className="bg-green-100 dark:bg-green-900">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-2xl font-bold text-green-800 dark:text-green-200">Boost Your Business</CardTitle>
                    <Briefcase className="text-green-500" size={32} />
                  </div>
                  <p className="text-green-700 dark:text-green-300 mb-4">Elevate your service offerings with our premium tools and exposure!</p>
                  <ul className="list-disc list-inside text-green-600 dark:text-green-400 mb-4">
                    <li>Featured placement in search results</li>
                    <li>Customizable service packages</li>
                    <li>Advanced analytics dashboard</li>
                  </ul>
                  <Button className="bg-green-500 hover:bg-green-600 text-white">Upgrade Your Profile</Button>
                </CardContent>
              </Card>

              <Card className="bg-orange-100 dark:bg-orange-900 overflow-hidden">
                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-2xl font-bold text-orange-800 dark:text-orange-200">Instant Connections</CardTitle>
                    <Zap className="text-yellow-500" size={32} />
                  </div>
                  <p className="text-orange-700 dark:text-orange-300 mb-4">Connect with clients instantly! Our new feature matches your skills with real-time service requests.</p>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">Start Matching Now</Button>
                  <img
                    src="/images/love.jpg"
                    alt="People connecting"
                    className="absolute -right-20 -bottom-20 w-2/3 h-2/3 object-cover rounded-full"
                  />
                </CardContent>
              </Card>
            </div>
          </section>

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

export default ServicesPage;