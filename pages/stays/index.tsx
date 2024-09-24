// pages/stays.tsx
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { BadgeCheck, Heart, Star, Users, BedDouble } from 'lucide-react';
import { Button } from "../../components/ui/button";
import clientPromise from '@/lib/mongodb';

interface Stay {
  _id: string;
  type: 'stay';
  title: string;
  description: string;
  location: string;
  price: number;
  images: string[];
  hostName: string;
  hostAvatar: string;
  hostRating: number;
  amenities: string[];
  capacity: number;
}

interface StaysPageProps {
  stays: Stay[];
}

const StaysPage: React.FC<StaysPageProps> = ({ stays }) => {
  const router = useRouter();

  const renderStayCard = (stay: Stay) => {
    const handleCardClick = () => {
      router.push(`/stays/${stay._id}`);
    };

    return (
      <div key={stay._id} className="relative rounded-2xl bg-white dark:bg-gray-800 cursor-pointer shadow-md" onClick={handleCardClick}>
        <div className="p-2">
          <div className="relative">
            <img src={stay.images[0]} alt={stay.title} className="w-full h-48 object-cover rounded-2xl" />
            <span className="absolute flex gap-1 items-center justify-between top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
              <BadgeCheck className='w-3.5 h-3.5' />
              Verified
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="px-3 py-1 rounded-full text-sm text-primary bg-blue-100">
              Stay
            </span>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm font-semibold">{stay.hostRating.toFixed(1)}</span>
            </div>
          </div>
          <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-1'>{stay.title}</h2>
          <p className='text-sm text-gray-500 dark:text-gray-400 mb-2'>{stay.location}</p>
          <p className='text-lg font-bold text-gray-900 dark:text-white mb-2'>${stay.price} <span className="text-sm font-normal">/ night</span></p>
          <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300 mb-4">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{stay.capacity} guests</span>
            </div>
            <div className="flex items-center">
              <BedDouble className="w-4 h-4 mr-1" />
              <span>{stay.amenities.includes('Fully Equipped Kitchen') ? 'Kitchen' : 'No kitchen'}</span>
            </div>
          </div>
          <div className='flex justify-between items-center'>
            <div className="flex items-center">
              <img src={stay.hostAvatar} alt={stay.hostName} className="w-8 h-8 rounded-full mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-300">{stay.hostName}</span>
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
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-8">Stays</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stays.map(renderStayCard)}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const client = await clientPromise;
  const db = client.db();

  const stays = await db.collection('listings').find({ type: 'stay' }).toArray();

  return {
    props: {
      stays: JSON.parse(JSON.stringify(stays)),
    },
  };
};

export default StaysPage;