// pages/experiences.tsx
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Heart, BadgeCheck, MapPin, Clock, Users } from 'lucide-react';
import clientPromise from '@/lib/mongodb';

interface Experience {
  _id: string;
  listingType: 'experience';
  title: string;
  description: string;
  address: string;
  images: string[];
  userDetails: {
    profilePic: string;
    email: string;
  };
  experienceCategory: string;
  duration: string;
  groupSize: string;
  experiencePricing: {
    adults: string;
    children: string;
    teens: string;
    groups: string;
    families: string;
  };
  priceCurrency: string;
  slug: string;
}

interface ExperiencesPageProps {
  experiences: Experience[];
}

const ExperiencesPage: React.FC<ExperiencesPageProps> = ({ experiences }) => {
  const router = useRouter();

  const renderExperienceCard = (experience: Experience) => {
    const handleCardClick = () => {
      router.push(`/${experience.listingType}s/${experience.slug}`);
    };

    return (
      <div key={experience._id} className="relative rounded-2xl overflow-hidden h-80 w-full cursor-pointer" onClick={handleCardClick}>
        <div className="absolute inset-0">
          <img 
            src={experience.images[0]} 
            alt={experience.title} 
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" 
          />
        </div>
        <div className="absolute top-0 left-0 right-0 p-4 ">
          <div className="flex justify-between items-center">
            <span className="px-3 py-1 rounded-full text-sm text-primary bg-blue-100 flex items-center">
              <BadgeCheck className='w-3.5 h-3.5 mr-1' />
              {experience.experienceCategory}
            </span>
            <span className='flex items-center cursor-pointer text-white rounded-full p-2 bg-gray-700 bg-opacity-80'><Heart className='h-4 w-4' /></span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gray-600 bg-opacity-80 p-4 rounded-b-2xl">
          <h2 className="text-white text-lg font-semibold mb-1">{experience.title}</h2>
          <p className="mb-2 text-gray-200 text-sm flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {experience.address}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-white py-2 px-3 bg-primary bg-opacity-50 rounded-full">
              <span className="font-bold">{experience.priceCurrency} {experience.experiencePricing.adults}/</span> person
            </span>
            <span className="text-sm text-white flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {experience.duration}
            </span>
            <span className="text-sm text-white flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Max {experience.groupSize}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-8">Experiences</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {experiences.map(renderExperienceCard)}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const client = await clientPromise;
  const db = client.db();

  const experiences = await db.collection('listings').find({ listingType: 'experience' }).toArray();

  return {
    props: {
      experiences: JSON.parse(JSON.stringify(experiences)),
    },
  };
};

export default ExperiencesPage;