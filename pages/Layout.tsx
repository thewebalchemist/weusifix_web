import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import AuthDialog from '@/components/AuthDialog';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import Footer from '@/components/FooterComponent';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleCreateClick = () => {
    if (user) {
      router.push('/add-listing');
    } else {
      setIsAuthDialogOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthDialogOpen(false);
    router.push('/add-listing');
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 dark:bg-gray-900">
      <Navigation 
        setIsAuthDialogOpen={setIsAuthDialogOpen}
        onCreateClick={handleCreateClick}
      />
      <main className="flex-grow">{children}</main>
      <Footer />
      <AuthDialog 
        isOpen={isAuthDialogOpen} 
        onClose={() => setIsAuthDialogOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Layout;