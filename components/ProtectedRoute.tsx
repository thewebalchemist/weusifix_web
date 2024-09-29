// components/ProtectedRoute.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import AuthDialog from './AuthDialog';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setShowAuthDialog(true);
    }
  }, [user, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <>
        {showAuthDialog && (
          <AuthDialog
            isOpen={showAuthDialog}
            onClose={() => {
              setShowAuthDialog(false);
              router.push('/');
            }}
          />
        )}
      </>
    );
  }

  return children;
};

export default ProtectedRoute;