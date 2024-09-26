import { User } from 'firebase/auth';
import { toast } from 'react-hot-toast';

export interface UserData {
  uid: string;
  role: string;
  email: string;
  phoneNumber?: string;
  name?: string;
  hasListings: boolean;
  // Add other fields as necessary
}

export const checkUserRole = async (user: User): Promise<boolean> => {
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
        return false;
      }
      console.error('Failed to fetch user role:', response.statusText);
      throw new Error('Failed to fetch user role');
    }

    const userData: UserData = await response.json();
    console.log('User data:', userData);

    if (userData.role !== 'provider') {
      console.log('User is not a provider');
      return false;
    }

    console.log('User is a provider');
    return true;
  } catch (error) {
    console.error('Error checking user role:', error);
    throw error;
  }
};

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