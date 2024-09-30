import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Star, MapPin, Clock, Users, BedDouble, Wifi, Car, Waves, Snowflake, MessageCircle, PhoneCall, Facebook, Twitter, Instagram, Share, Heart, User, Mail } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Calendar } from './ui/calendar';
import { Button } from './ui/button';
import dynamic from 'next/dynamic';
import { 
  FacebookShareButton, 
  TwitterShareButton, 
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon
} from 'react-share';
import { Label } from './ui/label';
import ShareDialog from './ShareDialog';

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

const DynamicMap = dynamic(() => import('@/components/DisplayMap'), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

const renderImages = (images) => {
  if (images.length === 1) {
    return (
      <div className="w-full">
        <img src={images[0]} alt="Service" className="w-full h-96 object-cover rounded-3xl" />
      </div>
    );
  } else if (images.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {images.map((image, index) => (
          <img key={index} src={image} alt={`Service ${index + 1}`} className="w-full h-96 object-cover rounded-3xl" />
        ))}
      </div>
    );
  } else {
    return (
      <div className="grid grid-cols-2 gap-2">
        <img src={images[0]} alt="Service 1" className="w-full h-96 object-cover rounded-3xl" />
        <div className="grid grid-rows-2 gap-2">
          <img src={images[1]} alt="Service 2" className="w-full h-48 object-cover rounded-3xl" />
          <img src={images[2]} alt="Service 3" className="w-full h-48 object-cover rounded-3xl" />
        </div>
      </div>
    );
  }
};

const ServiceListing = ({ service }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="min-h-screen py-28 lg:py-32 mx-auto lg:max-w-6xl">
      {renderImages(service.images)}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl lg:text-5xl font-bold mb-2 text-gray-800 dark:text-gray-300">{service.title}</h1>
        <div className="flex items-center mb-6 text-gray-600 dark:text-gray-500">
          <MapPin className="w-5 h-5 mr-2" />
          <span>{service.address}</span>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <Tabs defaultValue="description">
              <TabsList className="w-full mb-4 rounded-2xl py-4">
                <TabsTrigger value="description">Overview</TabsTrigger>
                <TabsTrigger value="availability">Availability</TabsTrigger>
              </TabsList>
              <TabsContent value="description">
                <p className="text-gray-800 dark:text-gray-300 mb-4">{service.description}</p>
                {service.location && (
                  <div className="mt-4">
                    <Label className="py-4 text-lg">
                      Location
                    </Label>
                    <DynamicMap location={service.location} />
                  </div>
                )}
              </TabsContent>
              <TabsContent value="availability">
                {service.opening_hours.enabled ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Opening Hours</h3>
                    {Object.entries(service.opening_hours.hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span>{day}</span>
                        <span>{hours.open} - {hours.close}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No specific opening hours provided.</p>
                )}
                {service.availability.enabled && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Custom Availability</h3>
                    {service.availability.slots.map((slot, index) => (
                      <div key={index} className="mb-2">
                        {slot.start} - {slot.end}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:w-1/3">
            <Card className="mb-6">
            <CardContent className='pt-6'>
            <div className="flex space-x-2">
            <ShareDialog url={`https://weusifix.com/services/${service.slug}`} title={service.title} />

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
                    <AvatarImage src={service.listing_user_details.profilePic} alt={service.listing_user_details.email} />
                    <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
                  <div>
                  <h3 className="text-md lg:text-lg font-semibold">{service.listing_user_details.name}</h3>
                    <h3 className="text-sm font-semibold">{service.listing_user_details.email}</h3>
                    <p className="text-sm text-gray-500">{service.isIndividual ? 'Individual' : 'Business'}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">{service.listing_user_details.bio}</p>
                <div className="flex space-x-2 mb-4"><Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => window.location.href = `tel:${service.listing_user_details.email}`}
                  >
                    <PhoneCall className="mr-2 h-4 w-4" /> Call
                  </Button>

                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => window.location.href = `mailto:${service.listing_user_details.phoneNumber}`}
                  >
                    <Mail className="mr-2 h-4 w-4" /> Message
                  </Button>
                </div>
                <div className="flex justify-center space-x-4">
                  {service.listing_user_details.socialMedia.facebook && (
                    <a href={service.listing_user_details.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                      <Facebook className="w-6 h-6 text-blue-600 cursor-pointer" />
                    </a>
                  )}
                  {service.listing_user_details.socialMedia.twitter && (
                    <a href={service.listing_user_details.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter className="w-6 h-6 text-blue-400 cursor-pointer" />
                    </a>
                  )}
                  {service.listing_user_details.socialMedia.instagram && (
                    <a href={service.listing_user_details.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                      <Instagram className="w-6 h-6 text-pink-600 cursor-pointer" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
            {service.bookingEnabled && (
              <Card>
                <CardHeader>
                  <CardTitle>Book this Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Request Booking</Button>
                </CardContent>
              </Card>
            )}
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
          <span>{event.address}</span>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <Tabs defaultValue="description">
              <TabsList className="w-full mb-4 rounded-2xl py-4">
                <TabsTrigger value="description">Overview</TabsTrigger>
                <TabsTrigger value="details">Event Details</TabsTrigger>
              </TabsList>
              <TabsContent value="description">
                <p className="text-gray-800 dark:text-gray-300">{event.description}</p>
                {event.location && (
                  <div className="mt-4">
                    <Label className="py-4 text-lg">
                      Location
                    </Label>
                    <DynamicMap location={event.location} />
                  </div>
                )}
              </TabsContent>
              <TabsContent value="details">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-gray-500" />
                    <span>{event.event_date} at {event.event_time}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-gray-500" />
                    <span>{event.capacity} attendees</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div className="lg:w-1/3">
            <Card className="mb-6">
              <CardContent className='p-6'>
                <div className="flex space-x-2">
                  <ShareDialog url={`https://weusifix.com/services/${event.slug}`} title={event.title} />
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
              <CardContent>
                <div className="flex items-center mb-4">
                  <Avatar className="w-16 h-16 mr-4">
                    <AvatarImage src={event.listing_user_details.profilePic} alt={event.listing_user_details.name} />
                    <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
                  <div>
                  <h3 className="text-lg font-semibold">{event.listing_user_details.name}</h3>
                    <h3 className="text-lg font-semibold">{event.listing_user_details.email}</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">{event.listing_user_details.bio}</p>
                <div className="flex space-x-2 mb-4"><Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => window.location.href = `tel:${event.listing_user_details.email}`}
                  >
                    <PhoneCall className="mr-2 h-4 w-4" /> Call
                  </Button>

                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => window.location.href = `mailto:${event.listing_user_details.phone}`}
                  >
                    <Mail className="mr-2 h-4 w-4" /> Message
                  </Button>
                </div>
                <div className="flex justify-center space-x-4">
                  {event.listing_user_details.socialMedia.facebook && (
                    <a href={event.listing_user_details.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                      <Facebook className="w-6 h-6 text-blue-600 cursor-pointer" />
                    </a>
                  )}
                  {event.listing_user_details.socialMedia.twitter && (
                    <a href={event.listing_user_details.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter className="w-6 h-6 text-blue-400 cursor-pointer" />
                    </a>
                  )}
                  {event.listing_user_details.socialMedia.instagram && (
                    <a href={event.listing_user_details.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                      <Instagram className="w-6 h-6 text-pink-600 cursor-pointer" />
                    </a>
                  )}
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
                    <span>{event.event_date} at {event.event_time}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-gray-500" />
                    <span>{event.capacity} attendees</span>
                  </div>
                  {event.event_pricing.map((pricing, index) => (
                    <p key={index} className="text-2xl font-bold">{event.price_currency} {pricing.price} - {pricing.type}</p>
                  ))}
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
          <span>{stay.address}</span>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <Tabs defaultValue="description">
              <TabsList className="w-full mb-4 rounded-2xl py-4">
                <TabsTrigger value="description">Overview</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="availability">Availability</TabsTrigger>
              </TabsList>
              <TabsContent value="description">
                <p className="text-gray-800 dark:text-gray-300">{stay.description}</p>
                {stay.location && (
                  <div className="mt-4">
                    <Label className="py-4 text-lg">
                      Location
                    </Label>
                    <DynamicMap location={stay.location} />
                  </div>
                )}
              </TabsContent>
              <TabsContent value="amenities">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {stay.amenities && stay.amenities.length > 0 ? (
                    stay.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center p-3 bg-white dark:bg-black text-gray-800 dark:text-gray-300 rounded-2xl">
                        <span>{amenity}</span>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 md:col-span-3 p-3 bg-white dark:bg-black text-gray-800 dark:text-gray-300 rounded-2xl">
                      No amenities listed for this stay.
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="availability">
                <div className="space-y-4">
                  {stay.stay_availability && stay.stay_availability.length > 0 ? (
                    stay.stay_availability.map((period, index) => (
                      <div key={index} className="p-3 bg-white dark:bg-black text-gray-800 dark:text-gray-300 rounded-2xl">
                        <p>From: {new Date(period.start).toLocaleDateString()}</p>
                        <p>To: {new Date(period.end).toLocaleDateString()}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 bg-white dark:bg-black text-gray-800 dark:text-gray-300 rounded-2xl">
                      No availability information provided for this stay.
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div className="lg:w-1/3">
            <Card className="mb-6">
              <CardContent className='p-6'>
                <div className="flex space-x-2">
                  <ShareDialog url={`https://weusifix.com/services/${stay.slug}`} title={stay.title} />
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
              <CardContent>
                <div className="flex items-center mb-4">
                  <Avatar className="w-16 h-16 mr-4">
                    <AvatarImage src={stay.listing_user_details.profilePic} alt={stay.listing_user_details.name} />
                    <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
                  <div>
                  <h3 className="text-lg font-semibold">{stay.listing_user_details.name}</h3>
                    <h3 className="text-lg font-semibold">{stay.listing_user_details.email}</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">{stay.listing_user_details.bio}</p>
                <div className="flex space-x-2 mb-4"><Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => window.location.href = `tel:${stay.listing_user_details.email}`}
                  >
                    <PhoneCall className="mr-2 h-4 w-4" /> Call
                  </Button>

                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => window.location.href = `mailto:${stay.listing_user_details.phone}`}
                  >
                    <Mail className="mr-2 h-4 w-4" /> Message
                  </Button>
                </div>
                <div className="flex justify-center space-x-4">
                  {stay.listing_user_details.socialMedia.facebook && (
                    <a href={stay.listing_user_details.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                      <Facebook className="w-6 h-6 text-blue-600 cursor-pointer" />
                    </a>
                  )}
                  {stay.listing_user_details.socialMedia.twitter && (
                    <a href={stay.listing_user_details.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter className="w-6 h-6 text-blue-400 cursor-pointer" />
                    </a>
                  )}
                  {stay.listing_user_details.socialMedia.instagram && (
                    <a href={stay.listing_user_details.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                      <Instagram className="w-6 h-6 text-pink-600 cursor-pointer" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Book this Stay</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-4">{stay.price_currency} {stay.stay_price} / night</p>
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
                <Button className="w-full mt-4" disabled={!stay.booking_enabled}>
                  {stay.booking_enabled ? 'Book Now' : 'Booking Unavailable'}
                </Button>
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
                {experience.location && (
                  <div className="mt-4">
                    <Label className="py-4 text-lg">
                      Location
                    </Label>
                    <DynamicMap location={experience.location} />
                  </div>
                )}
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
                  <ShareDialog url={`https://weusifix.com/services/${experience.slug}`} title={experience.title} />
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
              <CardContent>
                <div className="flex items-center mb-4">
                  <Avatar className="w-16 h-16 mr-4">
                    <AvatarImage src={experience.listing_user_details.profilePic} alt={experience.listing_user_details.name} />
                    <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{experience.listing_user_details.name}</h3>
                    <h3 className="text-lg font-semibold">{experience.listing_user_details.email}</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">{experience.listing_user_details.bio}</p>
                <div className="flex space-x-2 mb-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => window.location.href = `tel:${experience.listing_user_details.phoneNumber}`}
                  >
                    <PhoneCall className="mr-2 h-4 w-4" /> Call
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => window.location.href = `mailto:${experience.listing_user_details.email}`}
                  >
                    <Mail className="mr-2 h-4 w-4" /> Message
                  </Button>
                </div>
                <div className="flex justify-center space-x-4">
                  {experience.listing_user_details.socialMedia.facebook && (
                    <a href={experience.listing_user_details.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                      <Facebook className="w-6 h-6 text-blue-600 cursor-pointer" />
                    </a>
                  )}
                  {experience.listing_user_details.socialMedia.twitter && (
                    <a href={experience.listing_user_details.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter className="w-6 h-6 text-blue-400 cursor-pointer" />
                    </a>
                  )}
                  {experience.listing_user_details.socialMedia.instagram && (
                    <a href={experience.listing_user_details.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                      <Instagram className="w-6 h-6 text-pink-600 cursor-pointer" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Book this Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className='border border-gray-500 p-3 rounded-2xl'>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Group Size</label>
                    <select className="mt-1 p-2 block w-full rounded-xl border border-gray-500 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      {[...Array(parseInt(experience.group_size))].map((_, i) => (
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
                <Button className="w-full mt-4" disabled={!experience.booking_enabled}>
                  {experience.booking_enabled ? 'Book Now' : 'Booking Unavailable'}
                </Button>
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
                    <span>Max Group Size: {experience.group_size} people</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Pricing:</h3>
                    <ul className="list-disc list-inside">
                      {Object.entries(experience.experience_pricing).map(([type, price]) => (
                        <li key={type}>{type}: {experience.price_currency} {price}</li>
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