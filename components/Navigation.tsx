import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun, Menu, X } from 'lucide-react';

const Navigation = () => {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const linkClasses = (path: string) =>
    `flex items-center py-2 px-3 rounded-full text-sm font-medium transition-colors ${
      router.pathname === path
        ? 'bg-primary text-white'
        : 'bg-transparent text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
    }`;

  const renderLogo = () => {
    if (theme === 'dark') {
      return <img src="/images/weusi-dark.png" alt="Weusifix Dark Logo" className="h-6 w-auto" />;
    } else {
      return <img src="/images/weusi-light.png" alt="Weusifix Light Logo" className="h-6 w-auto" />;
    }
  };

  const renderLinks = () => (
    <>
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
    </>
  );

  return (
    <nav className="my-5 mx-5 py-2 bg-gray-200 dark:bg-gray-700 rounded-full fixed inset-x-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left: Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            {renderLogo()}
          </Link>

          {/* Center: Categories (hidden on mobile) */}
          <div className="hidden md:flex my-2 space-x-4 bg-gray-400/50 backdrop-blur-md px-5 py-2 rounded-full">
            {renderLinks()}
          </div>

          {/* Right: Add Listing Button and Theme Toggle */}
          <div className="flex items-center space-x-4">
            <Button 
              className="hidden md:inline-flex text-white bg-primary hover:text-gray-200 border-primary hover:bg-primary/70 px-5 py-3" 
              onClick={() => router.push('/add-listing')} 
              variant="outline"
            >
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
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {renderLinks()}
            <Button 
              className="w-full mt-3 bg-primary hover:text-white border-primary hover:bg-primary/70 px-5 py-3" 
              onClick={() => {
                router.push('/add-listing');
                setMobileMenuOpen(false);
              }} 
              variant="outline"
            >
              Add Listing
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;