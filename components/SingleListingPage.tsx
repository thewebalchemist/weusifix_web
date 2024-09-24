import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Star, MapPin, Clock, Users, BedDouble, Wifi, Car, Waves, Snowflake, MessageCircle, PhoneCall, Facebook, Twitter, Instagram, Share, Heart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Calendar } from './ui/calendar';
import { Button } from './ui/button';

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
      ))}
      <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
};

const renderImages = (images) => {
  if (images.length === 1) {
    return (
      <div className="w-full">
        <img src={images[0]} alt="Item" className="w-full h-96 object-cover rounded-3xl" />
      </div>
    );
  } else if (images.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {images.map((image, index) => (
          <img key={index} src={image} alt={`Item ${index + 1}`} className="w-full h-96 object-cover rounded-3xl" />
        ))}
      </div>
    );
  } else {
    return (
      <div className="grid grid-cols-2 gap-2">
        <img src={images[0]} alt="Item 1" className="w-full h-96 object-cover rounded-3xl" />
        <div className="grid grid-rows-2 gap-2">
          <img src={images[1]} alt="Item 2" className="w-full h-48 object-cover rounded-3xl" />
          <img src={images[2]} alt="Item 3" className="w-full h-48 object-cover rounded-3xl" />
        </div>
      </div>
    );
  }
};

const ServiceListing = ({ service }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="min-h-screen py-28 lg:py-32 mx-auto lg:max-w-6xl">
      {renderImages(service.images)}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl lg:text-5xl font-bold mb-2 text-gray-800 dark:text-gray-300">{service.title}</h1>
        <div className="flex items-center mb-6 text-gray-600 dark:text-gray-500">
          <MapPin className="w-5 h-5 mr-2" />
          <span>{service.location}</span>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <Tabs defaultValue="description">
              <TabsList className="w-full mb-4 rounded-2xl py-4">
                <TabsTrigger value="description">Overview</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="description">
                <p className="text-gray-800 dark:text-gray-300">{service.description}</p>
              </TabsContent>
              <TabsContent value="reviews">
                {service.reviews.map((review, index) => (
                  <div key={index} className="mb-4 p-5 bg-white dark:bg-black text-gray-800 dark:text-gray-300 rounded-3xl">
                    <div className="flex items-center mb-2">
                      <Avatar className="w-10 h-10 mr-3">
                        <AvatarImage src={review.userAvatar} alt={review.userName} />
                        <AvatarFallback>{review.userName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{review.userName}</p>
                        <StarRating rating={review.rating} />
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
          <div className="lg:w-1/3">
            <Card className="mb-6">
              <CardContent className='pt-6'>
                <div className="flex space-x-2 mb-4">
                  <Button variant="outline" className="flex-1">
                    <Share className="mr-2 h-4 w-4" /> Share
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Heart className="mr-2 h-4 w-4" /> Favorite
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Service Provider</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <Avatar className="w-16 h-16 mr-4">
                    <AvatarImage src={service.providerAvatar} alt={service.providerName} />
                    <AvatarFallback>{service.providerName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{service.providerName}</h3>
                    <StarRating rating={service.providerRating} />
                  </div>
                </div>
                <div className="flex space-x-2 mb-4">
                  <Button variant="outline" className="flex-1">
                    <MessageCircle className="mr-2 h-4 w-4" /> Chat
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <PhoneCall className="mr-2 h-4 w-4" /> Call
                  </Button>
                </div>
                <div className="flex justify-center space-x-4">
                  <Facebook className="w-6 h-6 text-blue-600 cursor-pointer" />
                  <Twitter className="w-6 h-6 text-blue-400 cursor-pointer" />
                  <Instagram className="w-6 h-6 text-pink-600 cursor-pointer" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const EventListing = ({ event }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="min-h-screen py-28 lg:py-32 mx-auto lg:max-w-6xl">
      {renderImages(event.images)}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl lg:text-5xl font-bold mb-2 text-gray-800 dark:text-gray-300">{event.title}</h1>
        <div className="flex items-center mb-6 text-gray-600 dark:text-gray-500">
          <MapPin className="w-5 h-5 mr-2" />
          <span>{event.location}</span>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <Tabs defaultValue="description">
              <TabsList className="w-full mb-4 rounded-2xl py-4">
                <TabsTrigger value="description">Overview</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              </TabsList>
              <TabsContent value="description">
                <p className="text-gray-800 dark:text-gray-300">{event.description}</p>
              </TabsContent>
              <TabsContent value="schedule">
                {event.schedule.map((item, index) => (
                  <div key={index} className="mb-4 p-5 bg-white dark:bg-black text-gray-800 dark:text-gray-300 rounded-3xl">
                    <h3 className="font-semibold">{item.time}</h3>
                    <p>{item.activity}</p>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
          <div className="lg:w-1/3">
            <Card className="mb-6">
              <CardContent className='p-6'>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">
                    <Share className="mr-2 h-4 w-4" /> Share
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Heart className="mr-2 h-4 w-4" /> Favorite
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Organizer</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className="flex items-center">
                  <Avatar className="w-16 h-16 mr-4">
                    <AvatarImage src={event.organizerAvatar} alt={event.organizerName} />
                    <AvatarFallback>{event.organizerName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{event.organizerName}</h3>
                    <p className="text-sm text-gray-500">{event.organizerDescription}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">
                    <MessageCircle className="mr-2 h-4 w-4" /> Chat
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <PhoneCall className="mr-2 h-4 w-4" /> Call
                  </Button>
                </div>
                <div className="flex justify-center space-x-4">
                  <Facebook className="w-6 h-6 text-blue-600 cursor-pointer" />
                  <Twitter className="w-6 h-6 text-blue-400 cursor-pointer" />
                  <Instagram className="w-6 h-6 text-pink-600 cursor-pointer" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-gray-500" />
                    <span>{event.date} at {event.time}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-gray-500" />
                    <span>{event.capacity} attendees</span>
                  </div>
                  <p className="text-2xl font-bold">${event.price}</p>
                  <Button className="w-full">Buy Tickets</Button>
                </div>
              </CardContent>
            </Card>
            
          </div>
        </div>
      </div>
    </div>
  );
};

const StayListing = ({ stay }) => {
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());

  return (
    <div className="min-h-screen py-28 lg:py-32 mx-auto lg:max-w-6xl">
      {renderImages(stay.images)}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl lg:text-5xl font-bold mb-2 text-gray-800 dark:text-gray-300">{stay.title}</h1>
        <div className="flex items-center mb-6 text-gray-600 dark:text-gray-500">
          <MapPin className="w-5 h-5 mr-2" />
          <span>{stay.location}</span>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <Tabs defaultValue="description">
              <TabsList className="w-full mb-4 rounded-2xl py-4">
                <TabsTrigger value="description">Overview</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="description">
                <p className="text-gray-800 dark:text-gray-300">{stay.description}</p>
              </TabsContent>
              <TabsContent value="amenities">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {stay.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center p-3 bg-white dark:bg-black text-gray-800 dark:text-gray-300 rounded-2xl">
                      
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="reviews">
                {stay.reviews.map((review, index) => (
                  <div key={index} className="mb-4 p-5 bg-white dark:bg-black text-gray-800 dark:text-gray-300 rounded-3xl">
                    <div className="flex items-center mb-2">
                      <Avatar className="w-10 h-10 mr-3">
                        <AvatarImage src={review.userAvatar} alt={review.userName} />
                        <AvatarFallback>{review.userName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{review.userName}</p>
                        <StarRating rating={review.rating} />
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
          <div className="lg:w-1/3">
            <Card className="mb-6">
              <CardContent className='p-6'>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">
                    <Share className="mr-2 h-4 w-4" /> Share
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Heart className="mr-2 h-4 w-4" /> Favorite
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Host</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className="flex items-center">
                  <Avatar className="w-16 h-16 mr-4">
                    <AvatarImage src={stay.hostAvatar} alt={stay.hostName} />
                    <AvatarFallback>{stay.hostName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{stay.hostName}</h3>
                    <StarRating rating={stay.hostRating} />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">
                    <MessageCircle className="mr-2 h-4 w-4" /> Chat
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <PhoneCall className="mr-2 h-4 w-4" /> Call
                  </Button>
                </div>
                <div className="flex justify-center space-x-4">
                  <Facebook className="w-6 h-6 text-blue-600 cursor-pointer" />
                  <Twitter className="w-6 h-6 text-blue-400 cursor-pointer" />
                  <Instagram className="w-6 h-6 text-pink-600 cursor-pointer" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Book this Stay</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-4">${stay.price} / night</p>
                <div className="space-y-4">
                  <div className='space-y-4'>
                    <label className="block text-lg font-medium text-gray-700 dark:text-gray-300">Check-in</label>
                    <Calendar
                      mode="single"
                      selected={checkInDate}
                      onSelect={setCheckInDate}
                      className="rounded-3xl border border-gray-300 dark:border-gray-700"
                    />
                  </div>
                  <div className='space-y-4'>
                    <label className="block text-lg font-medium text-gray-700 dark:text-gray-300">Check-out</label>
                    <Calendar
                      mode="single"
                      selected={checkOutDate}
                      onSelect={setCheckOutDate}
                      className="rounded-3xl border border-gray-300 dark:border-gray-700"
                    />
                  </div>
                </div>
                <Button className="w-full mt-4">Book Now</Button>
              </CardContent>
            </Card>
            
          </div>
        </div>
      </div>
    </div>
  );
};

const ExperienceListing = ({ experience }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="min-h-screen py-28 lg:py-32 mx-auto lg:max-w-6xl">
      {renderImages(experience.images)}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl lg:text-5xl font-bold mb-2 text-gray-800 dark:text-gray-300">{experience.title}</h1>
        <div className="flex items-center mb-6 text-gray-600 dark:text-gray-500">
          <MapPin className="w-5 h-5 mr-2" />
          <span>{experience.location}</span>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <Tabs defaultValue="description">
              <TabsList className="w-full mb-4 rounded-2xl py-4">
                <TabsTrigger value="description">Overview</TabsTrigger>
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="description">
                <p className="text-gray-800 dark:text-gray-300">{experience.description}</p>
              </TabsContent>
              <TabsContent value="itinerary">
                {experience.itinerary.map((item, index) => (
                  <div key={index} className="mb-4 p-5 bg-white dark:bg-black text-gray-800 dark:text-gray-300 rounded-3xl">
                    <h3 className="font-semibold">{item.time}</h3>
                    <p>{item.activity}</p>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="reviews">
                {experience.reviews.map((review, index) => (
                  <div key={index} className="mb-4 p-5 bg-white dark:bg-black text-gray-800 dark:text-gray-300 rounded-3xl">
                    <div className="flex items-center mb-2">
                      <Avatar className="w-10 h-10 mr-3">
                        <AvatarImage src={review.userAvatar} alt={review.userName} />
                        <AvatarFallback>{review.userName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{review.userName}</p>
                        <StarRating rating={review.rating} />
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
          <div className="lg:w-1/3">
            <Card className="mb-6">
              <CardContent className='p-6'>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">
                    <Share className="mr-2 h-4 w-4" /> Share
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Heart className="mr-2 h-4 w-4" /> Favorite
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Host</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className="flex items-center">
                  <Avatar className="w-16 h-16 mr-4">
                    <AvatarImage src={experience.hostAvatar} alt={experience.hostName} />
                    <AvatarFallback>{experience.hostName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{experience.hostName}</h3>
                    <StarRating rating={experience.hostRating} />
                    <p className="text-sm text-gray-500 mt-1">{experience.hostBio}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">
                    <MessageCircle className="mr-2 h-4 w-4" /> Chat
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <PhoneCall className="mr-2 h-4 w-4" /> Call
                  </Button>
                </div>
                <div className="flex justify-center space-x-4">
                  <Facebook className="w-6 h-6 text-blue-600 cursor-pointer" />
                  <Twitter className="w-6 h-6 text-blue-400 cursor-pointer" />
                  <Instagram className="w-6 h-6 text-pink-600 cursor-pointer" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Book this Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-4">${experience.price} / person</p>
                <div className="space-y-4">
                <div className='border border-gray-500 p-3 rounded-2xl'>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Group Size</label>
                    <select className="mt-1 p-2 block w-full rounded-xl border border-gray-500 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      {[...Array(experience.maxGroupSize)].map((_, i) => (
                        <option key={i} value={i + 1}>{i + 1} {i === 0 ? 'person' : 'people'}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-md font-medium text-gray-700 dark:text-gray-300">Select Date</label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-3xl border border-gray-300 dark:border-gray-700"
                    />
                  </div>
                  
                </div>
                <Button className="w-full mt-4">Book Now</Button>
              </CardContent>
            </Card>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Experience Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-gray-500" />
                    <span>Duration: {experience.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-gray-500" />
                    <span>Max Group Size: {experience.maxGroupSize} people</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">What's Included:</h3>
                    <ul className="list-disc list-inside">
                      {experience.included.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export { ServiceListing, EventListing, StayListing, ExperienceListing };