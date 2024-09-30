import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Stays</h3>
            <ul className="space-y-2">
              <li><Link href="/stays" className="text-gray-600 dark:text-gray-400 hover:text-primary">All Stays</Link></li>
              <li><Link href="/stays?category=hotels" className="text-gray-600 dark:text-gray-400 hover:text-primary">Hotels</Link></li>
              <li><Link href="/stays?category=apartments" className="text-gray-600 dark:text-gray-400 hover:text-primary">Apartments</Link></li>
              <li><Link href="/stays?category=villas" className="text-gray-600 dark:text-gray-400 hover:text-primary">Villas</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Events</h3>
            <ul className="space-y-2">
              <li><Link href="/events" className="text-gray-600 dark:text-gray-400 hover:text-primary">All Events</Link></li>
              <li><Link href="/events?category=concerts" className="text-gray-600 dark:text-gray-400 hover:text-primary">Concerts</Link></li>
              <li><Link href="/events?category=conferences" className="text-gray-600 dark:text-gray-400 hover:text-primary">Conferences</Link></li>
              <li><Link href="/events?category=workshops" className="text-gray-600 dark:text-gray-400 hover:text-primary">Workshops</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Experiences</h3>
            <ul className="space-y-2">
              <li><Link href="/experiences" className="text-gray-600 dark:text-gray-400 hover:text-primary">All Experiences</Link></li>
              <li><Link href="/experiences?category=adventure" className="text-gray-600 dark:text-gray-400 hover:text-primary">Adventure</Link></li>
              <li><Link href="/experiences?category=culinary" className="text-gray-600 dark:text-gray-400 hover:text-primary">Culinary</Link></li>
              <li><Link href="/experiences?category=cultural" className="text-gray-600 dark:text-gray-400 hover:text-primary">Cultural</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Services</h3>
            <ul className="space-y-2">
              <li><Link href="/services" className="text-gray-600 dark:text-gray-400 hover:text-primary">All Services</Link></li>
              <li><Link href="/services?category=cleaning" className="text-gray-600 dark:text-gray-400 hover:text-primary">Cleaning</Link></li>
              <li><Link href="/services?category=plumbing" className="text-gray-600 dark:text-gray-400 hover:text-primary">Plumbing</Link></li>
              <li><Link href="/services?category=electrician" className="text-gray-600 dark:text-gray-400 hover:text-primary">Electrician</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="flex justify-between items-center">
            <div className="flex space-x-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
            <p className="text-base text-gray-400">&copy; {currentYear} Weusifix. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;