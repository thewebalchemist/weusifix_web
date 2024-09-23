import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Search, ChevronRight, BadgeCheck, Heart, UsersRound, BedDouble, Bed, ShowerHead, Calendar, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import clientPromise from '../lib/mongodb';

interface Listing {
  _id: string;
  type: 'service' | 'event' | 'stay' | 'experience';
  title: string;
  description: string;
  location: string;
  price: number;
  images: string[];
  amenities?: string[];
  date?: string;
  time?: string;
  capacity?: number;
  duration?: string;
  popularity: number;
}

interface HomePageProps {
  listings: Listing[];
}

const subCategories = {
  Services: ['Movers', 'Cleaning', 'Welding', 'Tailoring', 'Electricians', 'MCs', 'Others'],
  Stays: ['Hotels', 'Apartments', 'Resorts', 'Villas'],
  Events: ['Conferences', 'Concerts', 'Workshops', 'Parties'],
  Experiences: ['City Tours', 'Adventures', 'Culinary Experiences', 'Wellness'],
};

const HomePage: React.FC<HomePageProps> = ({ listings }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Services');
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const nearestEvent = listings.find(listing => listing.type === 'event' && listing.date);
      if (nearestEvent && nearestEvent.date) {
        const difference = new Date(nearestEvent.date).getTime() - new Date().getTime();
        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((difference / 1000 / 60) % 60);
          const seconds = Math.floor((difference / 1000) % 60);
          return `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
      }
      return 'No upcoming events';
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [listings]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const searchParams = new URLSearchParams(formData as any);
    router.push(`/search?${searchParams.toString()}&type=${activeTab.toLowerCase()}`);
  };

  const renderSearchForm = () => {
    switch (activeTab) {
      case 'Services':
        return (
          <form onSubmit={handleSearch} className="space-y-4">
            <Input name="query" placeholder="What service are you looking for?" />
            <Input name="location" placeholder="Location" />
            <Button type="submit" className="w-full">Search Services</Button>
          </form>
        );
      case 'Stays':
        return (
          <form onSubmit={handleSearch} className="space-y-4">
            <Input name="location" placeholder="Where are you going?" />
            <div className="flex space-x-2">
              <Input name="checkIn" type="date" className="w-1/2" />
              <Input name="checkOut" type="date" className="w-1/2" />
            </div>
            <Select name="guests">
              <SelectTrigger>
                <SelectValue placeholder="Number of guests" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, '6+'].map(num => (
                  <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? 'guest' : 'guests'}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" className="w-full">Search Stays</Button>
          </form>
        );
      case 'Events':
        return (
          <form onSubmit={handleSearch} className="space-y-4">
            <Input name="query" placeholder="Search for events" />
            <Input name="location" placeholder="Location" />
            <Input name="date" type="date" />
            <Button type="submit" className="w-full">Find Events</Button>
          </form>
        );
      case 'Experiences':
        return (
          <form onSubmit={handleSearch} className="space-y-4">
            <Input name="query" placeholder="What do you want to experience?" />
            <Input name="location" placeholder="Location" />
            <Input name="date" type="date" />
            <Button type="submit" className="w-full">Discover Experiences</Button>
          </form>
        );
      default:
        return null;
    }
  };

  const renderCard = (listing: Listing) => {
    const handleCardClick = () => {
      router.push(`/${listing.type}s/${listing._id}`);
    };

    switch (listing.type) {
      case 'service':
        return (
          <Card key={listing._id} className="cursor-pointer" onClick={handleCardClick}>
            <CardHeader className="p-0">
              <img src={listing.images[0]} alt={listing.title} className="w-full h-48 object-cover" />
              <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                <BadgeCheck className="inline-block w-3.5 h-3.5 mr-1" />
                Verified
              </span>
            </CardHeader>
            <CardContent className="p-4">
              <span className="px-2 py-1 rounded-full text-xs text-primary bg-blue-100">Service</span>
              <h3 className="mt-2 font-semibold">{listing.title}</h3>
              <p className="text-sm text-gray-500">{listing.location}</p>
            </CardContent>
            <CardFooter className="p-4 border-t flex justify-between items-center">
              <Heart className="text-gray-400 hover:text-red-500 cursor-pointer" />
              <Button>View Details</Button>
            </CardFooter>
          </Card>
        );
      case 'stay':
        return (
          <Card key={listing._id} className="cursor-pointer" onClick={handleCardClick}>
            <CardHeader className="p-0">
              <img src={listing.images[0]} alt={listing.title} className="w-full h-48 object-cover" />
              <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                <BadgeCheck className="inline-block w-3.5 h-3.5 mr-1" />
                Verified
              </span>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <span className="px-2 py-1 rounded-full text-xs text-primary bg-blue-100">Stay</span>
                <span className="text-sm font-semibold">${listing.price}/night</span>
              </div>
              <h3 className="mt-2 font-semibold">{listing.title}</h3>
              <p className="text-sm text-gray-500">{listing.location}</p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500">
                <span className="flex items-center"><UsersRound className="w-4 h-4 mr-1" />{listing.capacity} guests</span>
                <span className="flex items-center"><BedDouble className="w-4 h-4 mr-1" />{listing.amenities?.includes('Fully Equipped Kitchen') ? '1 kitchen' : 'No kitchen'}</span>
                <span className="flex items-center"><ShowerHead className="w-4 h-4 mr-1" />{listing.amenities?.includes('Pool') ? '1 pool' : 'No pool'}</span>
                <span className="flex items-center"><Bed className="w-4 h-4 mr-1" />{listing.amenities?.length} amenities</span>
              </div>
            </CardContent>
            <CardFooter className="p-4 border-t flex justify-between items-center">
              <Heart className="text-gray-400 hover:text-red-500 cursor-pointer" />
              <Button>Book Now</Button>
            </CardFooter>
          </Card>
        );
      case 'event':
        return (
          <Card key={listing._id} className="cursor-pointer" onClick={handleCardClick}>
            <CardHeader className="p-0">
              <img src={listing.images[0]} alt={listing.title} className="w-full h-48 object-cover" />
              <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                <BadgeCheck className="inline-block w-3.5 h-3.5 mr-1" />
                Verified
              </span>
            </CardHeader>
            <CardContent className="p-4">
              <span className="px-2 py-1 rounded-full text-xs text-primary bg-blue-100">Event</span>
              <h3 className="mt-2 font-semibold">{listing.title}</h3>
              <p className="text-sm text-gray-500">{listing.location}</p>
              <p className="mt-2 text-sm font-semibold">From ${listing.price}/ticket</p>
              <div className="mt-2 text-xs text-red-500">{timeLeft}</div>
            </CardContent>
            <CardFooter className="p-4 border-t flex justify-between items-center">
              <Heart className="text-gray-400 hover:text-red-500 cursor-pointer" />
              <Button>Book Now</Button>
            </CardFooter>
          </Card>
        );
      case 'experience':
        return (
          <Card key={listing._id} className="cursor-pointer relative overflow-hidden" onClick={handleCardClick}>
            <img src={listing.images[0]} alt={listing.title} className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 rounded-full text-xs text-primary bg-white">Experience</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="font-semibold">{listing.title}</h3>
              <p className="text-sm">{listing.location}</p>
              <p className="mt-2 text-sm font-semibold">${listing.price}/person</p>
            </div>
            <Heart className="absolute top-2 right-2 text-white hover:text-red-500 cursor-pointer" />
          </Card>
        );
    }
  };

  const popularListings = listings.sort((a, b) => b.popularity - a.popularity).slice(0, 12);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-6xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Whatever you <span className="text-primary italic underline">need</span> is here!
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab as any} className="mb-12">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="Services">Services</TabsTrigger>
            <TabsTrigger value="Stays">Stays</TabsTrigger>
            <TabsTrigger value="Events">Events</TabsTrigger>
            <TabsTrigger value="Experiences">Experiences</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab}>
            <Card>
              <CardHeader>
                <CardTitle>Find {activeTab}</CardTitle>
              </CardHeader>
              <CardContent>
                {renderSearchForm()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-8">Popular {activeTab}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {popularListings.filter(listing => listing.type === activeTab.toLowerCase().slice(0, -1)).map(renderCard)}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-8">Why List With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="mr-2" /> Reach More Customers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Get exposed to a wide audience actively looking for services, events, stays, and experiences.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2" /> Easy Booking Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Manage your bookings effortlessly with our user-friendly platform.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2" /> Increase Your Visibility
                </CardTitle>
              </CardHeader>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-8">Our Partners</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {/* Replace these with actual partner logos */}
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg flex items-center justify-center">
                <img src={`/partner-logo-${index + 1}.png`} alt={`Partner ${index + 1}`} className="max-h-12" />
              </div>
            ))}
          </div>
        </section>
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