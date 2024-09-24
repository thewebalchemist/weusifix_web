// pages/events.tsx
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { BadgeCheck, Heart, Calendar, Clock, MapPin } from 'lucide-react';
import clientPromise from '@/lib/mongodb';
import { useState, useEffect } from 'react';

interface Event {
  _id: string;
  type: 'event';
  title: string;
  description: string;
  location: string;
  price: number;
  images: string[];
  organizerName: string;
  organizerAvatar: string;
  date: string;
  time: string;
  capacity: number;
}

interface EventsPageProps {
  events: Event[];
}

const EventsPage: React.FC<EventsPageProps> = ({ events }) => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const nearestEvent = events[0]; // Assuming events are sorted by date
      if (nearestEvent && nearestEvent.date) {
        const eventDate = new Date(`${nearestEvent.date} ${nearestEvent.time}`);
        const difference = eventDate.getTime() - new Date().getTime();
        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((difference / 1000 / 60) % 60);
          const seconds = Math.floor((difference / 1000) % 60);
          return `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
      }
      return 'Event started';
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [events]);

  const renderEventCard = (event: Event) => {
    const handleCardClick = () => {
      router.push(`/events/${event._id}`);
    };

    return (
      <div key={event._id} className="relative rounded-2xl bg-white dark:bg-gray-800 cursor-pointer shadow-md" onClick={handleCardClick}>
        <div className="p-2">
          <div className="relative">
            <img src={event.images[0]} alt={event.title} className="w-full h-48 object-cover rounded-2xl" />
            <span className="absolute flex gap-1 items-center justify-between top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
              <BadgeCheck className='w-3.5 h-3.5' />
              Verified
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="px-3 py-1 rounded-full text-sm text-primary bg-blue-100">
              Event
            </span>
          </div>
          <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-1'>{event.title}</h2>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{event.date}</span>
            <Clock className="w-4 h-4 ml-2 mr-1" />
            <span>{event.time}</span>
          </div>
          <p className='text-lg font-bold text-gray-900 dark:text-white mb-2'>From ${event.price}</p>
          <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm rounded-full px-3 py-1 mb-4">
            {timeLeft}
          </div>
          <div className='flex justify-between items-center'>
            <div className="flex items-center">
              <img src={event.organizerAvatar} alt={event.organizerName} className="w-8 h-8 rounded-full mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-300">{event.organizerName}</span>
            </div>
            <Heart className='text-gray-400 hover:text-red-500 cursor-pointer' />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-8">Events</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map(renderEventCard)}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const client = await clientPromise;
  const db = client.db();

  const events = await db.collection('listings').find({ type: 'event' }).toArray();

  return {
    props: {
      events: JSON.parse(JSON.stringify(events)),
    },
  };
};

export default EventsPage;