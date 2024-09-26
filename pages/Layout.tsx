import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import AuthDialog from '@/components/AuthDialog';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleAddListingClick = () => {
    if (!user) {
      setIsAuthDialogOpen(true);
    } else if (user.role !== 'provider') {
      toast.error('Only service providers can add listings.');
    } else {
      router.push('/add-listing');
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-gray-900">
      <Navigation 
        setIsAuthDialogOpen={setIsAuthDialogOpen} 
        onAddListingClick={handleAddListingClick}
      />
      <main>{children}</main>
      <AuthDialog 
        isOpen={isAuthDialogOpen} 
        onClose={() => setIsAuthDialogOpen(false)}
      />
    </div>
  );
};

export default Layout;