// File: /lib/userUtils.ts

import { User as FirebaseUser } from 'firebase/auth';

export interface UserData {
  uid: string;
  email: string;
  name: string;
  phoneNumber: string;
  profilePic: string | null;
  bio: string;
  hasListings: boolean;
  socialMedia: {
    website: string;
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
  };
  // Add any other fields that your user data includes
}

export interface Listing {
  listingId: string;
  title: string;
  description: string;
  listingType: 'service' | 'event' | 'stay' | 'experience';
  createdAt: string;
  priceCurrency: string;
  stayPrice?: string;
  eventPricing?: { type: string; price: string }[];
  address: string;
  slug: string;
  // Add other listing fields as needed
}

export const fetchUserDetails = async (user: FirebaseUser): Promise<UserData | null> => {
  try {
    const token = await user.getIdToken();
    const response = await fetch(`/api/users/${user.uid}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      console.log(`User fetch failed with status: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data as UserData;
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
};

export const fetchUserListings = async (user: FirebaseUser): Promise<Listing[]> => {
  try {
    const token = await user.getIdToken();
    const response = await fetch('/api/listings', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      console.log(`Listings fetch failed with status: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return data.sort((a: Listing, b: Listing) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error fetching user listings:', error);
    return [];
  }
};

export const fetchUserDetailsAndListings = async (user: FirebaseUser): Promise<{ userDetails: UserData | null, listings: Listing[] }> => {
  const [userDetails, listings] = await Promise.all([
    fetchUserDetails(user),
    fetchUserListings(user)
  ]);

  return { userDetails, listings };
};

// You can add other user-related utility functions here as well