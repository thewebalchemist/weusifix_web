import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { 
  User as FirebaseUser,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';

interface CustomUser extends Omit<FirebaseUser, 'phoneNumber'> {
  role?: string;
  phoneNumber?: string;
}

interface AuthContextType {
  user: CustomUser | null;
  loading: boolean;
  signup: (email: string, password: string, role: string, phoneNumber: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          const response = await fetch(`/api/users/${firebaseUser.uid}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const userData = await response.json();
            setUser({ ...firebaseUser, role: userData.role, phoneNumber: userData.phoneNumber } as CustomUser);
          } else {
            setUser(firebaseUser as CustomUser);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(firebaseUser as CustomUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function signup(email: string, password: string, role: string, phoneNumber: string, name: string) {
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(newUser, { displayName: name });
    const token = await newUser.getIdToken();
    const response = await fetch(`/api/users/${newUser.uid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        email, 
        role,
        phoneNumber,
        name
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to create user in database');
    }
    const userData = await response.json();
    setUser({ ...newUser, ...userData } as CustomUser);
  }

  async function login(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  const value = {
    user,
    loading,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}