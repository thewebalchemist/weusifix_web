import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import AuthDialog from './components/AuthDialog';
import toast from 'react-hot-toast';

const ProviderDashboard = () => {
  const { data: session, status } = useSession();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);

      if (status === 'loading') return;

      if (status === 'unauthenticated') {
        console.log('User is not authenticated');
        setIsAuthDialogOpen(true);
        setIsLoading(false);
        return;
      }

      if (status === 'authenticated' && session?.user) {
        console.log('User is authenticated:', session.user);
        try {
          await checkUserRole();
          await fetchUserDetails();
          await fetchListings();
          setIsLoading(false);
        } catch (error) {
          console.error('Error checking user role:', error);
          toast.error('Failed to verify user permissions. Please try again.');
          setIsLoading(false);
        }
      }
    };

    checkAuth();
  }, [status, session]);

  const checkUserRole = async () => {
    if (!session?.user?.uid) {
      console.error('User ID is missing');
      throw new Error('User ID is missing');
    }

    const response = await fetch(`/api/users?uid=${session.user.uid}`);
    if (!response.ok) {
      console.error('Failed to fetch user role:', response.statusText);
      throw new Error('Failed to fetch user role');
    }

    const userData = await response.json();
    console.log('User data:', userData);

    if (userData.role !== 'provider') {
      console.log('User is not a provider');
      toast.error('You are not authorized to access this dashboard');
      router.push('/');
      throw new Error('User is not authorized to access this dashboard');
    }

    console.log('User is a provider');
  };

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`/api/users?uid=${session.user.uid}`);
      if (response.ok) {
        const userData = await response.json();
        setUserDetails(userData.userDetails);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const fetchListings = async () => {
    try {
      const response = await fetch('/api/listings');
      if (response.ok) {
        const listingsData = await response.json();
        setListings(listingsData);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen mx-auto py-28 lg:py-32 lg:max-w-5xl bg-gray-100 dark:bg-gray-900">
      <AuthDialog 
        isOpen={isAuthDialogOpen} 
        onClose={() => setIsAuthDialogOpen(false)} 
      />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-3xl p-6">
          <h1 className="text-3xl font-bold mb-6">Provider Dashboard</h1>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>User Details</CardTitle>
            </CardHeader>
            <CardContent>
              {userDetails ? (
                <div>
                  <p><strong>Name:</strong> {session.user.name}</p>
                  <p><strong>Email:</strong> {userDetails.email}</p>
                  <p><strong>Phone:</strong> {userDetails.phone}</p>
                  <p><strong>Bio:</strong> {userDetails.bio}</p>
                  <div>
                    <strong>Social Media:</strong>
                    <ul>
                      {Object.entries(userDetails.socialMedia).map(([platform, link]) => (
                        <li key={platform}>{platform}: {link}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p>No user details found.</p>
              )}
              <Button onClick={() => router.push('/edit-profile')} className="mt-4">Edit Profile</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Listings</CardTitle>
            </CardHeader>
            <CardContent>
              {listings.length > 0 ? (
                <div className="space-y-4">
                  {listings.map((listing) => (
                    <Card key={listing._id}>
                      <CardContent className="flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-semibold">{listing.title}</h3>
                          <p>Type: {listing.listingType}</p>
                        </div>
                        <div>
                          <Button onClick={() => router.push(`/edit-listing/${listing._id}`)}>Edit</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>You haven't created any listings yet.</p>
              )}
              <Button onClick={() => router.push('/add-listing')} className="mt-4">Add New Listing</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProviderDashboard;