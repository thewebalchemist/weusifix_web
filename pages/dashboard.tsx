import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import AuthDialog from '../components/AuthDialog';
import toast from 'react-hot-toast';
import { fetchUserDetails, fetchUserDetailsAndListings, UserData, Lsitin } from '../lib/userUtils';
import { auth } from '../lib/firebase';
import { withAuth } from '@/contexts/withAuth';

const UserDashboard = () => {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [listings, setListings] = useState<Listing[]>([]);
  const [userDetails, setUserDetails] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.log('User is not authenticated');
        setIsAuthDialogOpen(true);
        setIsLoading(false);
      } else {
        console.log('User is authenticated:', user);
        try {
          const { userDetails, listings } = await fetchUserDetailsAndListings(user);
          if (userDetails) {
            setUserDetails(userDetails);
            setListings(listings);
          } else {
            throw new Error('Failed to fetch user details');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          toast.error('Failed to load user data. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, []);

  const fetchListings = async (user) => {
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/listings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const listingsData = await response.json();
        setListings(listingsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } else {
        throw new Error('Failed to fetch listings');
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to load listings. Please try again.');
    }
  };

  const handleDeleteListing = async (listingId) => {
    const user = auth.currentUser;
    if (!user) return;

    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        const token = await user.getIdToken();
        const response = await fetch(`/api/listings/${listingId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          toast.success('Listing deleted successfully');
          fetchListings(user); // Refresh the listings
        } else {
          throw new Error('Failed to delete listing');
        }
      } catch (error) {
        console.error('Error deleting listing:', error);
        toast.error('An error occurred while deleting the listing');
      }
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || !userDetails) return;

    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/users/${user.uid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userDetails),
      });

      if (response.ok) {
        toast.success('Profile updated successfully!');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating the profile');
    }
  };

  const handlePasswordChange = async (currentPassword, newPassword) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const credential = auth.EmailAuthProvider.credential(user.email, currentPassword);
      await user.reauthenticateWithCredential(credential);
      await user.updatePassword(newPassword);
      toast.success('Password updated successfully!');
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password. Please check your current password and try again.');
    }
  };

  const handleAuthDialogClose = () => {
    setIsAuthDialogOpen(false);
    if (!auth.currentUser) {
      router.push('/');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
            value={userDetails?.email || ''}
            onChange={(e) => setUserDetails({...userDetails, email: e.target.value})}
            placeholder="Email"
          />
          <Input
            name="phone"
            value={userDetails?.phone || ''}
            onChange={(e) => setUserDetails({...userDetails, phone: e.target.value})}
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
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="password"
              placeholder="Current Password"
              id="currentPassword"
            />
            <Input
              type="password"
              placeholder="New Password"
              id="newPassword"
            />
            <Button onClick={() => {
              const currentPasswordInput = document.getElementById('currentPassword') as HTMLInputElement;
              const newPasswordInput = document.getElementById('newPassword') as HTMLInputElement;

              if (currentPasswordInput && newPasswordInput) {
                const currentPassword = currentPasswordInput.value;
                const newPassword = newPasswordInput.value;
                handlePasswordChange(currentPassword, newPassword);
              } else {
              }
            }}>
              Change Password
            </Button>
          </CardContent>
        </Card>
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
              <Card key={listing.listingId}>
                <CardContent className="flex justify-between items-center p-4">
                  <div>
                    <h3 className="text-xl font-semibold">{listing.title}</h3>
                    <p>Type: {listing.listingType}</p>
                    <p>Created: {new Date(listing.createdAt).toLocaleDateString()}</p>
                    <p>Price: {listing.priceCurrency} {listing.stayPrice || listing.eventPricing?.[0]?.price || 'N/A'}</p>
                    <p>Address: {listing.address}</p>
                  </div>
                  <div className="space-x-2">
                    <Button onClick={() => router.push(`/edit-listing/${listing.listingType}/${listing.slug}`)}>Edit</Button>
                    <Button variant="destructive" onClick={() => handleDeleteListing(listing.listingId)}>Delete</Button>
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

  return (
    <div className="flex py-20 lg:py-28 px-2 lg:px-10 mx-auto min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
      <aside className="w-64 h-fit bg-white dark:bg-black rounded-3xl">
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button
                className={`w-full rounded-full text-left px-4 py-2 ${activeTab === 'profile' ? 'bg-gray-300 dark:bg-gray-700' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
            </li>
            <li>
              <button
                className={`w-full rounded-full text-left px-4 py-2 ${activeTab === 'listings' ? 'bg-gray-300 dark:bg-gray-700' : ''}`}
                onClick={() => setActiveTab('listings')}
              >
                Listings
              </button>
            </li>
            <li>
              <button
                className={`w-full rounded-full text-left px-4 py-2 ${activeTab === 'bookings' ? 'bg-gray-300 dark:bg-gray-700' : ''}`}
                onClick={() => setActiveTab('bookings')}
              >
                Bookings
              </button>
            </li>
            <li>
              <button
                className={`w-full rounded-full text-left px-4 py-2 ${activeTab === 'messages' ? 'bg-gray-300 dark:bg-gray-700' : ''}`}
                onClick={() => setActiveTab('messages')}
              >
                Messages
              </button>
            </li>
            <li>
              <button
                className={`w-full rounded-full text-left px-4 py-2 ${activeTab === 'favorites' ? 'bg-gray-300 dark:bg-gray-700' : ''}`}
                onClick={() => setActiveTab('favorites')}
              >
                Favorites
              </button>
            </li>
            <li>
              <button
                className={`w-full rounded-full text-left px-4 py-2 ${activeTab === 'goPro' ? 'bg-gray-300 dark:bg-gray-700' : ''}`}
                onClick={() => setActiveTab('goPro')}
              >
                Go Pro
              </button>
            </li>
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
      <AuthDialog 
        isOpen={isAuthDialogOpen} 
        onClose={() => setIsAuthDialogOpen(false)} 
      />
    </div>
  );
};

export default withAuth(UserDashboard);