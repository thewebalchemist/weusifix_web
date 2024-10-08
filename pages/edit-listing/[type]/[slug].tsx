import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent  } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabase';




// Custom Time Picker component
const TimePicker = ({ value, onChange }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const [selectedHour, selectedMinute] = value ? value.split(':') : ['00', '00'];

  return (
    <div className="flex space-x-2">
      <Select value={selectedHour} onValueChange={(hour) => onChange(`${hour}:${selectedMinute}`)}>
        <SelectTrigger className="w-20">
          <SelectValue placeholder="HH" />
        </SelectTrigger>
        <SelectContent>
          {hours.map((hour) => (
            <SelectItem key={hour} value={hour}>{hour}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={selectedMinute} onValueChange={(minute) => onChange(`${selectedHour}:${minute}`)}>
        <SelectTrigger className="w-20">
          <SelectValue placeholder="MM" />
        </SelectTrigger>
        <SelectContent>
          {minutes.map((minute) => (
            <SelectItem key={minute} value={minute}>{minute}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const EditListingForm = () => {
  const router = useRouter();
  const { type, slug } = router.query;
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (type && slug) {
      fetchListing();
    }
  }, [type, slug]);

  const fetchListing = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('listing_type', type)
        .eq('slug', slug)
        .single();

      if (error) throw error;
      setFormData(data);
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
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('listings')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('listings')
        .getPublicUrl(filePath);

      setFormData(prevData => ({ 
        ...prevData, 
        images: [...prevData.images, publicUrl]
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('listings')
        .update(formData)
        .eq('id', formData.id);

      if (error) throw error;
      toast.success('Listing updated successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating listing:', error);
      toast.error('An error occurred while updating the listing. Please try again.');
    }
  };

  if (!formData) {
    return <div>Loading...</div>;
  }


  return (
    <div className="py-28 lg:py-32 mx-auto lg:max-w-5xl p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Edit Listing: {formData.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
            <Input
              name="videoLink"
              value={formData.videoLink}
              onChange={handleInputChange}
              placeholder="Video Link"
            />
            <Input
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Address"
              required
            />
            <div>
              <Label>Images</Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />
              {formData.images && formData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {formData.images.map((image, index) => (
                    <img key={index} src={image} alt={`Listing image ${index + 1}`} className="w-full h-24 object-cover" />
                  ))}
                </div>
              )}
            </div>

            {formData.listingType === 'service' && (
              <>
                <Select 
                  name="serviceCategory" 
                  value={formData.serviceCategory}
                  onValueChange={(value) => handleInputChange({ target: { name: 'serviceCategory', value } })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Home Services">Home Services</SelectItem>
                    <SelectItem value="Professional Services">Professional Services</SelectItem>
                    <SelectItem value="Personal Care">Personal Care</SelectItem>
                  </SelectContent>
                </Select>
                <div>
                  <Label>Are you an individual or a business?</Label>
                  <Switch
                    checked={formData.isIndividual}
                    onCheckedChange={(checked) => setFormData(prevData => ({ ...prevData, isIndividual: checked }))}
                  />
                  <span>{formData.isIndividual ? 'Individual' : 'Business'}</span>
                </div>
              </>
            )}

            {formData.listingType === 'event' && (
              <>
                <Input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  required
                />
                <TimePicker
                  value={formData.eventTime}
                  onChange={(time) => setFormData(prevData => ({ ...prevData, eventTime: time }))}
                />
                <Input
                  name="capacity"
                  type="number"
                  placeholder="Capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  required
                />
                {/* Add event pricing fields here */}
              </>
            )}

            {formData.listingType === 'stay' && (
              <>
                <Input
                  name="stayPrice"
                  type="number"
                  placeholder="Price per night"
                  value={formData.stayPrice}
                  onChange={handleInputChange}
                  required
                />
                <div>
                  <Label>Check-in Time</Label>
                  <TimePicker
                    value={formData.checkInTime}
                    onChange={(time) => setFormData(prevData => ({ ...prevData, checkInTime: time }))}
                  />
                </div>
                <div>
                  <Label>Check-out Time</Label>
                  <TimePicker
                    value={formData.checkOutTime}
                    onChange={(time) => setFormData(prevData => ({ ...prevData, checkOutTime: time }))}
                  />
                </div>
                {/* Add amenities and availability fields here */}
              </>
            )}

            {formData.listingType === 'experience' && (
              <>
                <Select 
                  name="experienceCategory" 
                  value={formData.experienceCategory}
                  onValueChange={(value) => handleInputChange({ target: { name: 'experienceCategory', value } })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Experience Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="outdoor">Outdoor Adventure</SelectItem>
                    <SelectItem value="culinary">Culinary Experience</SelectItem>
                    <SelectItem value="cultural">Cultural Experience</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  name="duration"
                  placeholder="Duration (e.g., 2 hours)"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                />
                <Textarea
                  name="included"
                  placeholder="What's included in the experience?"
                  value={formData.included}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  name="groupSize"
                  type="number"
                  placeholder="Maximum Group Size"
                  value={formData.groupSize}
                  onChange={handleInputChange}
                  required
                />
                {/* Add experience pricing fields here */}
              </>
            )}
          </CardContent>
        </Card>
        <Button type="submit" className="w-full">Update Listing</Button>
      </form>
    </div>
  );
};

export default EditListingForm;