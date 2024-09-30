import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Search, ChevronRight, BadgeCheck, Heart, UsersRound, BedDouble, Bed, ShowerHead, MapPin } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import clientPromise from '@/lib/mongodb';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import HomepageSections from '@/components/HomepageSections';
import { supabase } from '@/lib/supabase';

interface Listing {
  id: string;
  listing_type: 'service' | 'event' | 'stay' | 'experience';
  title: string;
  description: string;
  location: string;
  listing_user_details: {
    profilePic: string;
    email: string;
  };
  category: string;
  is_individual: boolean;
  address: string;
  price: number;
  images: string[];
  amenities?: string[];
  event_date?: string;
  event_time?: string;
  capacity?: number;
  duration?: string;
  slug: string;
}

interface HomePageProps {
  listings: Listing[];
}


const categories = [
  { name: 'Services', icon: 'BadgeCheck', count: 1234 },
  { name: 'Events', icon: 'CalendarIcon', count: 567 },
  { name: 'Stays', icon: 'HomeIcon', count: 890 },
  { name: 'Experiences', icon: 'CompassIcon', count: 321 }
];

const subCategories = {
  Services: ['All', 'Movers', 'Cleaning', 'Welding', 'Tailoring', 'Electricians', 'MCs', 'Others'],
  Events: ['All', 'Conferences', 'Concerts', 'Workshops', 'Parties'],
  Stays: ['All', 'Hotels', 'Apartments', 'Resorts', 'Villas'],
  Experiences: ['All', 'City Tours', 'Adventures', 'Culinary Experiences', 'Wellness'],
};

const HomePage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Services');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [activeSubcategory, setActiveSubcategory] = useState(subCategories[activeTab as keyof typeof subCategories][0]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [timeLeft, setTimeLeft] = useState('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [popularServices, setPopularServices] = useState<Listing[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    fetchListings();
    fetchPopularServices();
  }, [activeTab]);

  const fetchListings = async () => {
    try {
      let { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('listing_type', activeTab.toLowerCase().slice(0, -1))
        .limit(10);

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  const fetchPopularServices = async () => {
    try {
      let { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('listing_type', 'service')
        .limit(10);

      if (error) throw error;
      setPopularServices(data || []);
    } catch (error) {
      console.error('Error fetching popular services:', error);
    }
  };

  const handleShowMore = () => {
    setPage(prevPage => prevPage + 1);
  };


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
    switch (activeTab) {
      case 'Services':
        return (
          <>
            <Input
              type="text"
              placeholder="What Type of Service Are You Looking For?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow rounded-full"
            />
            <Input
              type="text"
              placeholder="Location"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="flex-grow rounded-full"
            />
          </>
        );
      case 'Stays':
        return (
          <>
            <Input
              type="text"
              placeholder="Location"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="flex-grow rounded-full"
            />
            <Input
              type="date"
              placeholder="Check In"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="flex-grow rounded-full"
            />
            <Input
              type="date"
              placeholder="Check Out"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="flex-grow rounded-full"
            />
            <Input
              type="number"
              placeholder="No of Guests"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="flex-grow rounded-full"
            />
          </>
        );
      case 'Events':
      case 'Experiences':
        return (
          <>
            <Input
              type="text"
              placeholder="Location"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="flex-grow rounded-full"
            />
            <Input
              type="date"
              placeholder="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="flex-grow rounded-full"
            />
            <Input
              type="date"
              placeholder="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="flex-grow rounded-full"
            />
            <Input
              type="number"
              placeholder="No of Guests"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="flex-grow rounded-full"
            />
          </>
        );
      default:
        return null;
    }
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
                    {listing.category}
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
                    {listing.category}
                  </span>
                </div>
                <div>
                  <h2 className='text-gray-800 dark:text-white'>{listing.title}</h2>
                  <p className='text-gray-400 dark:text-gray-600 text-sm'>{listing.address}</p>
                  <span className='text-sm text-gray-800 dark:text-gray-100'>
                    From
                    <span className='font-bold'> ${listing.price}/</span> ticket
                  </span>
                </div>
              </div>
              <div className="mx-2 px-3 py-2 text-center text-md text-white rounded-xl bg-red-400">
                {listing.event_date && new Date(listing.event_date) > new Date() ? 'Coming Soon' : 'Event Passed'}
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
                    {listing.category}
                  </span>
                  <span className='flex items-center cursor-pointer text-white rounded-full p-2 bg-gray-700 bg-opacity-80'><Heart className='h-4 w-4' /></span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gray-600 bg-opacity-80 p-4 rounded-b-2xl">
                <h2 className="text-white text-lg font-semibold mb-1">{listing.title}</h2>
                <p className="mb-2 text-gray-200 text-sm">{listing.address}</p>
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
    <div className="bg-gray-100 dark:bg-gray-900">
      <main>
        <div className="max-w-6xl mx-auto py-20 lg:py-36 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-center text-5xl lg:text-8xl font-semibold text-gray-900 dark:text-white">
              Whatever you <span className='text-primary italic underline'>need</span> is here!
            </h1>
            {/* Tabs Section */}
            <div className="flex justify-center pt-10">
              <div className="flex px-2 lg:px-4 py-4 justify-center space-x-2 lg:space-x-4 backdrop-blur-md bg-gray-200 dark:bg-gray-700 rounded-full">
                {['Services', 'Events', 'Stays', 'Experiences'].map((tab) => (
                  <button
                    key={tab}
                    className={`px-2 lg:px-3 py-2 font-medium text-xs lg:text-lg rounded-full ${activeTab === tab
                      ? 'bg-primary text-white'
                      : ' text-gray-800 dark:text-gray-100'
                      }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Form Section */}
            <div className="py-4 lg:py-10">
              <div className="rounded-3xl lg:rounded-full backdrop-blur-md bg-white dark:bg-gray-800 shadow-xl overflow-hidden">
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
          </div>

          <div className="justify-center pt-5">

            <div className='flex justify-center py-2 lg:py-5 px-1'>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-5">
              {categories.map((category) => {
                const ListingIcon = category.icon;
                return (
                  <button
                    key={category.name}
                    onClick={() => setActiveTab(category.name)}
                    className={`flex flex-col items-center justify-center cursor-pointer px-2 lg:px-6 py-3 rounded-2xl transition-all ${
                      activeTab === category.name
                        ? 'bg-primary cursor-pointer text-white shadow-lg transform scale-105'
                        : ' bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className='flex flex-row items-between gap-3 lg:gap-5'>
                    <div  className='flex flex-col items-start'>
                    <span className="font-medium text-md md:text-lg">{category.name}</span>
                    <span className="text-sm opacity-75">{category.count} listings</span>
                    </div>
                    <div className=''>
                    <ChevronRight />
                    </div>
                    </div>
                    
                  </button>
                );
              })}
            </div>
            </div>
          </div>

          <div className="py-10 px-1">
            <div className='flex flex-wrap justify-between px-3 mx-auto'>
            <Carousel className='overflow-hidden'>
              <CarouselContent>
                {subCategories[activeTab as keyof typeof subCategories].map((subcat) => (
                  <CarouselItem key={subcat} className="basis-auto ">
                    <Button
                      onClick={() => setActiveSubcategory(subcat)}
                      variant={activeSubcategory === subcat ? "default" : "outline"}
                      className="whitespace-nowrap"
                    >
                      {subcat}
                    </Button>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            <div className="text-right mt-2">
              <Link href={`/${activeTab.toLowerCase()}`} className="text-primary hover:underline flex items-center">
                See More <ChevronRight className='ml-2 h-5 w-5' />
              </Link>
            </div>
            </div>

            <Carousel
            opts={{
              align: "start",
              loop: true,
              slidesToScroll: 1,
              containScroll: "trimSnaps",
            }}

            plugins={[
              Autoplay({
                delay: 2000,
              }),
            ]}
            
            className='mt-6 overflow-hidden relative'>
              <CarouselContent className="-ml-2 md:-ml-4">
                {listings.map((listing) => (
                  <CarouselItem key={listing._id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                    {renderCard(listing)}
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 shadow-md" />
            <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 shadow-md" />
            </Carousel>
          </div>

          {/* Popular Services Section */}
          <section className="mt-16">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-8">Popular Services</h2>
            <Carousel 
            opts={{
              align: "start",
              loop: true,
              slidesToScroll: 1,
              containScroll: "trimSnaps",
            }}

            plugins={[
              Autoplay({
                delay: 5000,
              }),
            ]}
            
            className='overflow-hidden'>
              <CarouselContent>
                {popularServices.map((service) => (
                  <CarouselItem key={service._id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                    {renderCard(service)}
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 shadow-md" />
            <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 shadow-md" />
            </Carousel>
          </section>


          {/* Benefits Section */}
          <section className="p-2 lg:p-10 mt-10">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-8">Why List With Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Reach More Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Get exposed to a wide audience actively looking for services, events, stays, and experiences.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Easy Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Manage your listings, bookings, and customer interactions all in one place.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Grow Your Business</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Increase your visibility and revenue with our powerful platform and marketing tools.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Partners Section */}
          <section className="flex-grow">
            <HomepageSections />
          </section>
        </div>
      </main>
    </div>
  );
};


export default HomePage;