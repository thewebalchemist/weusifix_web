import React from 'react';
import Navigation from '@/components/Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-stone-100 dark:bg-gray-900">
      <Navigation />
      <main>{children}</main>
    </div>
  );
};

export default Layout;