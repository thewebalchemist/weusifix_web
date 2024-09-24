import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext'; // Import the useTheme hook for toggling the theme
import { Moon, Sun } from 'lucide-react';

const Navigation = () => {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const linkClasses = (path: string) =>
    `flex items-center py-2 px-3 rounded-full text-sm font-medium transition-colors ${
      router.pathname === path
        ? 'bg-primary text-white'
        : 'bg-transparent text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
    }`;

  const iconClasses = (path: string) =>
    `w-5 h-5 mr-2 ${
      router.pathname === path ? 'text-white' : 'text-indigo-500 dark:text-indigo-400'
    }`;

  return (
    <nav className="  my-5 mx-5 py-2 bg-gray-200 dark:bg-gray-700 rounded-full fixed inset-x-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left: Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold italic text-primary">Weusifix</span>
          </Link>

          {/* Center: Categories */}
          <div className="my-2 flex space-x-4 bg-gray-400/50 backdrop-blur-md px-5 py-2 rounded-full">
            <Link href="/services" className={linkClasses('/services')}>
              Services
            </Link>
            <Link href="/events" className={linkClasses('/events')}>
              Events
            </Link>
            <Link href="/stays" className={linkClasses('/stays')}>
              Stays
            </Link>
            <Link href="/experiences" className={linkClasses('/experiences')}>
              Experiences
            </Link>
          </div>

          {/* Right: Add Listing Button and Theme Toggle */}
          <div className="flex items-center space-x-4">
            <Button className="bg-primary hover:text-white border-primary  hover:bg-primary/70 px-5 py-3 " onClick={() => router.push('/add-listing')} variant="outline">
              Add Listing
            </Button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {theme === 'dark' ? (
                <Sun className="w-6 h-6" />
              ) : (
                <Moon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
