// pages/events.tsx
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { BadgeCheck, Heart } from 'lucide-react';
import { Button } from "../components/ui/button";
import clientPromise from '../lib/mongodb';
import { useState, useEffect } from 'react';

interface Event {
  _id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  images: string[];
  date: string;
  time: string;
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
        const difference = new Date(nearestEvent.date).getTime() - new Date().getTime();
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
      <div key={event._id} className="relative rounded-2xl border border-gray-300 dark:border-gray-700 cursor-pointer" onClick={handleCardClick}>
        <div className="p-2">
          <div className="relative">
            <img src={event.images[0]} alt={event.title} className="w-full h-40 object-cover rounded-2xl" />
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
            <h2 className='text-gray-800 dark:text-white'>{event.title}</h2>
            <p className='text-gray-400 dark:text-gray-600 text-sm'>{event.location}</p>
            <span className='text-sm text-gray-800 dark:text-gray-100'>
              From
              <span className='font-bold'> ${event.price}/</span> ticket
            </span>
          </div>
        </div>
        <div className="mx-2 px-3 py-2 text-center text-md text-white rounded-xl bg-red-400">
          {timeLeft}
        </div>
        <div className="p-2">
          <div className='flex justify-between space-x-4'>
            <span className='flex items-center cursor-pointer text-white rounded-full p-2 bg-gray-300'><Heart /></span>
            <button className="hover:bg-transparent border border-white hover:border-primary bg-primary hover:text-primary w-full py-2 rounded-2xl">Book Now</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-8">Events</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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