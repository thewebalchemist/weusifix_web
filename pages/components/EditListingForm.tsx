import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { auth, storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import toast from 'react-hot-toast';
import { Input, Textarea, Select, Button, Card, CardContent, CardHeader, CardTitle } from './ui/components';

const EditListingForm = () => {
  const { user, loading } = useFirebaseAuth();
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user && id) {
      fetchListing();
    }
  }, [user, loading, id, router]);

  const fetchListing = async () => {
    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/listings/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const listingData = await response.json();
        setFormData(listingData);
      } else {
        toast.error('Failed to fetch listing');
      }
    } catch (error) {
      console.error('Error fetching listing:', error);
      toast.error('An error occurred while fetching the listing');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = async (e) => {
    // ... (similar to AddListingForm)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/listings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Listing updated successfully!');
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        toast.error(`Failed to update listing: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating listing:', error);
      toast.error('An error occurred while updating the listing. Please try again.');
    }
  };

  if (!formData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Edit Listing</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Title"
              required
            />
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
              required
            />
            {/* Add more fields based on the listing type */}
          </CardContent>
        </Card>
        <Button type="submit" className="mt-4">Update Listing</Button>
      </form>
    </div>
  );
};

export default EditListingForm;