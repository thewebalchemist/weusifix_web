import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun, Menu, X, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import Image from 'next/image';


interface NavigationProps {
  setIsAuthDialogOpen: (isOpen: boolean) => void;
  onAddListingClick: () => void;
}


const Navigation: React.FC<NavigationProps> = ({ setIsAuthDialogOpen, onAddListingClick }) => {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const linkClasses = (path: string) =>
    `flex items-center py-2 px-2 lg:px-3 rounded-full text-sm font-medium transition-colors ${router.pathname === path
      ? 'bg-primary text-white'
      : 'bg-transparent text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
    }`;

  const renderLogo = () => {
    if (theme === 'dark') {
      return <img src="/images/weusi-dark.png" alt="Weusifix Dark Logo" className="h-3.5 lg:h-6 w-auto" />;
    } else {
      return <img src="/images/weusi-light.png" alt="Weusifix Light Logo" className="h-3.5 lg:h-6 w-auto" />;
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

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const renderProfileMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full overflow-hidden">
          {user?.photoURL ? (
            <Image
              src={user.photoURL}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <User className="w-10 h-10 p-2 bg-gray-300 border-2 border-blue-300 rounded-full dark:bg-gray-700 text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => router.push('/dashboard')}>
          Profile
        </DropdownMenuItem>
        {user?.role === 'provider' && (
          <DropdownMenuItem onSelect={() => router.push('/dashboard')}>
            Your Listings
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onSelect={() => router.push('/dashboard')}>
          Favorites
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleLogout}>
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <nav className="lg:my-5 lg:mx-5 mx-2 my-2 py-2 bg-gray-200 dark:bg-gray-700 rounded-full fixed inset-x-0 z-10">
      <div className="max-w-7xl mx-auto px-3 lg:px-8">
        <div className="flex justify-between  lg:h-16 items-center">
          {/* Left: Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            {renderLogo()}
          </Link>

          {/* Center: Categories (hidden on mobile) */}
          <div className="hidden md:flex my-2 space-x-4 bg-gray-400/50 backdrop-blur-md px-5 py-2 rounded-xl lg:rounded-full">
            {renderLinks()}
          </div>

          {/* Right: Add Listing Button, Theme Toggle, and Profile */}
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
            {user ? (
              renderProfileMenu()
            ) : (
              <Button
                onClick={() => setIsAuthDialogOpen(true)}
                variant="ghost"
                className="text-gray-800 dark:text-gray-300"
              >
                Log In
              </Button>
            )}
            {/* Mobile menu button */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/services" className={linkClasses('/services')}>
                      Services
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/events" className={linkClasses('/events')}>
                      Events
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/stays" className={linkClasses('/stays')}>
                      Stays
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/experiences" className={linkClasses('/experiences')}>
                      Experiences
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={onAddListingClick}>
                    Add Listing
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;