import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

const categories = ['All', 'Services', 'Stays', 'Events', 'Experiences'];

const mockListings = [
  { id: 1, title: 'Beachfront Villa', type: 'Stay', location: 'Malibu, CA', image: 'https://images.pexels.com/photos/20284614/pexels-photo-20284614/free-photo-of-balconies-on-residential-building-wall.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 2, title: 'City Tour', type: 'Experience', location: 'New York, NY', image: 'https://images.pexels.com/photos/20284614/pexels-photo-20284614/free-photo-of-balconies-on-residential-building-wall.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 3, title: 'Yoga Retreat', type: 'Event', location: 'Bali, Indonesia', image: 'https://images.pexels.com/photos/20284614/pexels-photo-20284614/free-photo-of-balconies-on-residential-building-wall.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 4, title: 'Personal Chef', type: 'Service', location: 'Paris, France', image: 'https://images.pexels.com/photos/20284614/pexels-photo-20284614/free-photo-of-balconies-on-residential-building-wall.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  // Add more mock listings as needed
];

const CategoriesPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredListings = activeCategory === 'All'
    ? mockListings
    : mockListings.filter(listing => listing.type === activeCategory.slice(0, -1));

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Browse Listings</h1>
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-6">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <Card key={listing.id}>
                    <CardHeader>
                      <img src={listing.image} alt={listing.title} className="w-full h-48 object-cover rounded-t-lg" />
                    </CardHeader>
                    <CardContent>
                      <CardTitle>{listing.title}</CardTitle>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{listing.type}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{listing.location}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">View Details</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default CategoriesPage;