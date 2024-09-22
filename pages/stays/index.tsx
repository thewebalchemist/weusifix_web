// pages/stays.tsx
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { BadgeCheck, Heart, UsersRound, BedDouble, ShowerHead, Bed } from 'lucide-react';
import { Button } from "../components/ui/button";
import clientPromise from '../lib/mongodb';

interface Stay {
  _id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  images: string[];
  amenities: string[];
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
      <div key={stay._id} className="relative rounded-2xl border border-gray-300 dark:border-gray-700 cursor-pointer" onClick={handleCardClick}>
        <div className="p-2">
          <div className="relative">
            <img src={stay.images[0]} alt={stay.title} className="w-full h-40 object-cover rounded-2xl" />
            <span className="absolute flex gap-1 items-center justify-between top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
              <BadgeCheck className='w-3.5 h-3.5' />
              Verified
            </span>
          </div>
        </div>
        <div className="py-4 px-2 flex flex-col justify-between">
          <div className=" flex justify-between items-center py-2">
            <span className="px-3 py-1 rounded-full text-sm text-primary bg-blue-100">
              Stay
            </span>
            <span className='text-sm text-gray-600 dark:text-gray-300'>
              <span className='font-bold'>${stay.price}/</span> night
            </span>
          </div>
          <div>
            <h2 className='text-gray-800 dark:text-white'>{stay.title}</h2>
            <p className='text-gray-500 dark:text-gray-500'>{stay.location}</p>
          </div>
          <div className="grid grid-cols-2 items-center py-2 text-gray-800 dark:text-gray-300">
            <div className="border-r border-b border-gray-300 dark:border-gray-600 pr-2">
              <span className='p-2 text-xs flex items-center gap-1'>
                <UsersRound className='h-3.5 w-3.5 text-primary' />
                {stay.amenities.length} guests
              </span>
            </div>
            <div className="border-b border-gray-300 dark:border-gray-600 pl-2">
              <span className='p-2 text-xs flex items-center gap-1'>
                <BedDouble className='h-3.5 w-3.5 text-primary' />
                {stay.amenities.includes('Fully Equipped Kitchen') ? '1 kitchen' : 'No kitchen'}
              </span>
            </div>
            <div className="border-r border-gray-300 dark:border-gray-600 pr-2">
              <span className='p-2 text-xs flex items-center gap-1'>
                <ShowerHead className='h-3.5 w-3.5 text-primary' />
                {stay.amenities.includes('Pool') ? '1 pool' : 'No pool'}
              </span>
            </div>
            <div className="pl-2">
              <span className='p-2 text-xs flex items-center gap-1'>
                <Bed className='h-3.5 w-3.5 text-primary' />
                {stay.amenities.length} amenities
              </span>
            </div>
          </div>
        </div>
        <div className="p-2">
          <div className='flex justify-between space-x-4'>
            <span className='flex items-center cursor-pointer text-gray-700 dark:text-white rounded-full p-2 bg-gray-200 dark:bg-gray-600'><Heart /></span>
            <button className="bg-primary hover:bg-transparent border border-primary hover:text-primary text-white w-full py-2 rounded-2xl">Book Now</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-8">Stays</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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