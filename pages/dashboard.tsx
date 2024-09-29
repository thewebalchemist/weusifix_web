import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import ProtectedRoute from '@/components/ProtectedRoute';

const UserDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [listings, setListings] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
        const { data: userDetails, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (userError) throw userError;

        const { data: listings, error: listingsError } = await supabase
          .from('listings')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (listingsError) throw listingsError;

        setUserDetails(userDetails);
        setListings(listings);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load user data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(userDetails)
        .eq('user_id', userDetails.user_id);

      if (error) throw error;
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating the profile');
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        const { error } = await supabase
          .from('listings')
          .delete()
          .eq('id', listingId);

        if (error) throw error;
        toast.success('Listing deleted successfully');
        fetchUserData(); // Refresh the listings
      } catch (error) {
        console.error('Error deleting listing:', error);
        toast.error('An error occurred while deleting the listing');
      }
    }
  };

  const renderProfile = () => (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <Input
            name="name"
            value={userDetails?.name || ''}
            onChange={(e) => setUserDetails({...userDetails, name: e.target.value})}
            placeholder="Name"
          />
          <Input
            name="email"
            value={userEmail}
            placeholder="Email"
            disabled
          />
          <Input
            name="phone"
            value={userDetails?.phone_number || ''}
            onChange={(e) => setUserDetails({...userDetails, phone_number: e.target.value})}
            placeholder="Phone"
          />
          <Textarea
            name="bio"
            value={userDetails?.bio || ''}
            onChange={(e) => setUserDetails({...userDetails, bio: e.target.value})}
            placeholder="Bio"
          />
          <Button type="submit">Update Profile</Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderListings = () => (
    <Card>
      <CardHeader>
        <CardTitle>Your Listings</CardTitle>
      </CardHeader>
      <CardContent>
        {listings.length > 0 ? (
          <div className="space-y-4">
            {listings.map((listing) => (
              <Card key={listing.id}>
                <CardContent className="flex justify-between items-center p-4">
                  <div>
                    <h3 className="text-xl font-semibold">{listing.title}</h3>
                    <p>Type: {listing.listing_type}</p>
                    <p>Created: {new Date(listing.created_at).toLocaleDateString()}</p>
                    <p>Price: {listing.price_currency} {listing.price || 'N/A'}</p>
                    <p>Address: {listing.address}</p>
                  </div>
                  <div className="space-x-2">
                    <Button onClick={() => router.push(`/edit-listing/${listing.listing_type}/${listing.slug}`)}>Edit</Button>
                    <Button variant="destructive" onClick={() => handleDeleteListing(listing.id)}>Delete</Button>
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
  );

  const renderBookings = () => (
    <Card>
      <CardHeader>
        <CardTitle>Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Your bookings will be displayed here.</p>
      </CardContent>
    </Card>
  );

  const renderMessages = () => (
    <Card>
      <CardHeader>
        <CardTitle>Messages</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Your messages will be displayed here.</p>
      </CardContent>
    </Card>
  );

  const renderFavorites = () => (
    <Card>
      <CardHeader>
        <CardTitle>Favorites</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Your favorite listings will be displayed here.</p>
      </CardContent>
    </Card>
  );

  const renderGoPro = () => (
    <Card>
      <CardHeader>
        <CardTitle>Go Pro</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Upgrade to Pro for more features!</p>
        <Button>Upgrade Now</Button>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ProtectedRoute>
    <div className="flex flex-col md:flex-row py-20 lg:py-28 px-2 lg:px-10 mx-auto min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
      <Button className="md:hidden mb-4" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
      </Button>
      <aside className={`w-full md:w-64 h-fit bg-white dark:bg-black rounded-3xl ${isMobileMenuOpen ? '' : 'hidden md:block'}`}>
        <nav className="p-4">
          <ul className="space-y-2">
            {['profile', 'listings', 'bookings', 'messages', 'favorites', 'goPro'].map((tab) => (
              <li key={tab}>
                <button
                  className={`w-full rounded-full text-left px-4 py-2 ${activeTab === tab ? 'bg-gray-300 dark:bg-gray-700' : ''}`}
                  onClick={() => {
                    setActiveTab(tab);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'listings' && renderListings()}
        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'messages' && renderMessages()}
        {activeTab === 'favorites' && renderFavorites()}
        {activeTab === 'goPro' && renderGoPro()}
      </main>
    </div>
    </ProtectedRoute>
  );
};

export default UserDashboard;