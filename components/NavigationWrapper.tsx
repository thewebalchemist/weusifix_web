import React, { useState } from 'react';
import Navigation from './Navigation';
import AuthDialog from './AuthDialog';

const NavigationWrapper: React.FC = () => {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  return (
    <>
      <Navigation setIsAuthDialogOpen={setIsAuthDialogOpen} />
      <AuthDialog 
        isOpen={isAuthDialogOpen} 
        onClose={() => setIsAuthDialogOpen(false)} 
      />
    </>
  );
};

export default NavigationWrapper;