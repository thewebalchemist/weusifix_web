// pages/services.tsx
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { BadgeCheck, Heart, MapPin } from 'lucide-react';
import clientPromise from '@/lib/mongodb';

interface Service {
  _id: string;
  listingType: 'service';
  title: string;
  description: string;
  address: string;
  images: string[];
  userDetails: {
    profilePic: string;
    email: string;
  };
  serviceCategory: string;
  isIndividual: boolean;
  slug: string;
}

interface ServicesPageProps {
  services: Service[];
}

const ServicesPage: React.FC<ServicesPageProps> = ({ services }) => {
  const router = useRouter();

  const renderServiceCard = (service: Service) => {
    const handleCardClick = () => {
      router.push(`/${service.listingType}s/${service.slug}`);
    };

    return (
      <div key={service._id} className="relative rounded-2xl bg-white dark:bg-gray-800 cursor-pointer shadow-md" onClick={handleCardClick}>
        <div className="p-2">
          <div className="relative">
            <img src={service.images[0]} alt={service.title} className="w-full h-48 object-cover rounded-2xl" />
            <span className="absolute flex gap-1 items-center justify-between top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
              <BadgeCheck className='w-3.5 h-3.5' />
              Verified
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="px-3 py-1 rounded-full text-sm text-primary bg-blue-100">
              {service.serviceCategory}
            </span>
            <span className="px-3 py-1 rounded-full text-sm text-primary bg-green-100">
              {service.isIndividual ? 'Individual' : 'Business'}
            </span>
          </div>
          <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-1'>{service.title}</h2>
          <div className="flex items-center mb-2 text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{service.address}</span>
          </div>
          <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>{service.description.substring(0, 100)}...</p>
          <div className='flex justify-between items-center'>
            <div className="flex items-center">
              <img src={service.userDetails.profilePic} alt={service.userDetails.email} className="w-8 h-8 rounded-full mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-300">{service.userDetails.email}</span>
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
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-8">Services</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map(renderServiceCard)}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const client = await clientPromise;
  const db = client.db();

  const services = await db.collection('listings').find({ listingType: 'service' }).toArray();

  return {
    props: {
      services: JSON.parse(JSON.stringify(services)),
    },
  };
};

export default ServicesPage;