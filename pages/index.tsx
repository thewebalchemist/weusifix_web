import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Search, ChevronRight, BadgeCheck, Heart, UsersRound, BedDouble, Bed, ShowerHead, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import clientPromise from '@/lib/mongodb';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import toast from 'react-hot-toast';

interface Listing {
  _id: string;
  type: 'service' | 'event' | 'stay' | 'experience';
  title: string;
  description: string;
  location: string;
  price: number;
  images: string[];
  serviceCategory?: string;
  stayType?: string;
  eventType?: string;
  experienceType?: string;
  slug: string;
}

interface HomePageProps {
  listings: Listing[];
}

const categories = ['Services', 'Stays', 'Events', 'Experiences'];

const subCategories = {
  Services: ['Movers', 'Cleaning', 'Welding', 'Tailoring', 'Electricians', 'MCs', 'Others'],
  Stays: ['Hotels', 'Apartments', 'Resorts', 'Villas'],
  Events: ['Conferences', 'Concerts', 'Workshops', 'Parties'],
  Experiences: ['City Tours', 'Adventures', 'Culinary Experiences', 'Wellness'],
};

const HomePage: React.FC<HomePageProps> = () => {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [activeTab, setActiveTab] = useState('Services');
  const [activeSubcategory, setActiveSubcategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [filteredListings, setFilteredListings] = useState(listings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/listings');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Validate listings
        const validListings = data.filter(listing => 
          listing && typeof listing.type === 'string' && listing.type.length > 0
        );

        if (validListings.length < data.length) {
          console.warn(`Filtered out ${data.length - validListings.length} invalid listings`);
        }

        setListings(validListings);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setError('Failed to fetch listings. Please try again later.');
        toast.error('Failed to load listings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push({
      pathname: '/search',
      query: {
        query: searchQuery,
        location: searchLocation,
        category: activeTab,
        startDate,
        endDate,
        guests
      }
    });
  };

  const renderSearchForm = () => {
    return (
      <>
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
        {activeTab !== 'Services' && (
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
      </>
    );
  };

  const renderCard = (listing: Listing) => {
    const capitalizeFirstLetter = (string) => {
      if (typeof string !== 'string' || string.length === 0) {
        return 'Unknown';
      }
      return string.charAt(0).toUpperCase() + string.slice(1);
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
            {capitalizeFirstLetter(listing.type)}
            </span>
            <h2 className='mt-2 text-lg font-semibold text-gray-800 dark:text-white'>{listing.title}</h2>
            <p className='text-sm text-gray-500 dark:text-gray-400'>{listing.location}</p>
            <p className='mt-2 text-lg font-bold text-gray-900 dark:text-white'>${listing.price}</p>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl sm:text-5xl lg:text-7xl font-semibold text-gray-900 dark:text-white mb-8">
          Whatever you <span className='text-primary italic underline'>need</span> is here!
        </h1>

        {/* Tabs Section */}
        <div className="flex justify-center mb-8 overflow-x-auto">
          <div className="flex py-2 px-4 space-x-4 backdrop-blur-md bg-gray-200 dark:bg-gray-700 rounded-full">
            {categories.map((tab) => (
              <button
                key={tab}
                className={`px-3 py-2 font-medium text-sm rounded-full whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-primary text-white'
                    : 'text-gray-800 dark:text-gray-100'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Search Form Section */}
        <div className="mb-8">
          <div className="rounded-xl lg:rounded-full backdrop-blur-md bg-white dark:bg-gray-800 shadow-xl overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                {renderSearchForm()}
                <Button type="submit" className="w-full sm:w-auto">
                  <Search className="mr-2 h-4 w-4" /> Search
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Subcategories Carousel */}
        <div className="mb-8">
          <Swiper
            spaceBetween={10}
            slidesPerView="auto"
            freeMode={true}
            className="mySwiper"
          >
            <SwiperSlide className="w-auto">
              <button
                onClick={() => setActiveSubcategory('All')}
                className={`px-4 py-2 rounded-full text-sm ${
                  activeSubcategory === 'All'
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                All
              </button>
            </SwiperSlide>
            {subCategories[activeTab as keyof typeof subCategories].map((subcat) => (
              <SwiperSlide key={subcat} className="w-auto">
                <button
                  onClick={() => setActiveSubcategory(subcat)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    activeSubcategory === subcat
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {subcat}
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.length > 0 ? (
            filteredListings.map((listing) => renderCard(listing))
          ) : (
            <p className="col-span-full text-center text-gray-500 dark:text-gray-400">No listings found for this category.</p>
          )}
        </div>

        {/* ... (keep your existing Benefits and Partners sections) */}
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const client = await clientPromise;
  const db = client.db();

  const listings = await db.collection('listings').find({}).toArray();

  return {
    props: {
      listings: JSON.parse(JSON.stringify(listings)),
    },
  };
};

export default HomePage;