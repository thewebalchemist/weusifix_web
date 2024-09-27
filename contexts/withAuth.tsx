import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';
import AuthDialog from '@/components/AuthDialog';

export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function WithAuth(props: P) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        setUser(user);
        setIsLoading(false);
        if (!user) {
          setIsAuthDialogOpen(true);
        }
      });

      return () => unsubscribe();
    }, []);

    const handleAuthDialogClose = () => {
      setIsAuthDialogOpen(false);
      if (!auth.currentUser) {
        router.push('/');
      }
    };

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!user) {
      return (
        <AuthDialog
          isOpen={isAuthDialogOpen}
          onClose={handleAuthDialogClose}
        />
      );
    }

    return <WrappedComponent {...props} />;
  };
}