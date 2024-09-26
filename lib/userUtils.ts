import { User } from 'firebase/auth';
import { toast } from 'react-hot-toast';

export interface UserData {
  uid: string;
  phoneNumber?: string;
  name?: string;
  hasListings: boolean;
  profilePic: string | null;
  phone: string;
  email: string;
  bio: string;
  socialMedia: {
    website: string;
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
  };
}

export const fetchUserDetails = async (user: User): Promise<UserData | null> => {
  try {
    const token = await user.getIdToken();
    const response = await fetch(`/api/users/${user.uid}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.log('User not found in database');
        return null;
      }
      throw new Error(`Failed to fetch user details: ${response.statusText}`);
    }

    const userData: UserData = await response.json();
    return userData;
  } catch (error) {
    console.error('Error fetching user details:', error);
    toast.error('Failed to fetch user details. Please try again.');
    return null;
  }
};