import React, { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from '@/components/ui/textarea';
import toast, { Toaster } from 'react-hot-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useRouter } from 'next/navigation';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Checkbox } from '@/components/ui/checkbox';
import AuthDialog from '@/components/AuthDialog';
import { useDropzone } from 'react-dropzone';
import { checkUserRole, fetchUserDetails } from '@/lib/userUtils';

// Dynamically import the Map component
const DynamicMap = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

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

const AddListingForm = () => {
  const { user, loading } = useFirebaseAuth();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [listingType, setListingType] = useState('');
  const [isIndividual, setIsIndividual] = useState(true);
  const [isFirstTimeListing, setIsFirstTimeListing] = useState(true);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoLink: '',
    location: [-1.2840, 36.8170],
    address: '',
    images: [],
    featuredImageIndex: 0,
    openingHours: {
      enabled: false,
      hours: {}
    },
    availability: {
      enabled: false,
      slots: []
    },
    bookingEnabled: false,
    userDetails: {
      name: '',
      profilePic: null,
      phone: '',
      email: '',
      bio: '',
      socialMedia: {
        website: '',
        facebook: '',
        twitter: '',
        instagram: '',
        youtube: ''
      }
    },
    serviceCategory: '',
    eventDate: null,
    eventTime: null,
    capacity: '',
    eventPricing: [],
    checkInTime: null,
    checkOutTime: null,
    stayAvailability: [],
    amenities: [],
    stayPrice: '',
    priceCurrency: 'KES',
    experienceCategory: '',
    duration: '',
    included: '',
    groupSize: '',
    experiencePricing: {
      adults: '',
      children: '',
      teens: '',
      groups: '',
      families: ''
    }
  });

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);

      if (loading) return;

      if (!user) {
        console.log('User is not authenticated');
        setIsAuthDialogOpen(true);
        setIsLoading(false);
        return;
      }

      console.log('User is authenticated:', user);
      try {
        const isProvider = await checkUserRole(user);
        if (!isProvider) {
          toast.error('Only service providers can add listings.');
          router.push('/dashboard');
          return;
        }

        const userData = await fetchUserDetails(user);
        if (userData) {
          setFormData(prevData => ({
            ...prevData,
            userDetails: {
              ...prevData.userDetails,
              ...userData
            }
          }));
          setIsFirstTimeListing(!userData.hasListings);
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        toast.error('Failed to verify user permissions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [user, loading, router]);

  const handleAuthDialogClose = () => {
    setIsAuthDialogOpen(false);
    if (!user) {
      // If the user is still not authenticated after closing the dialog, redirect them
      router.push('/dashboard');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (formData.images.length + acceptedFiles.length > 6) {
      toast.error('Maximum 6 images allowed');
      return;
    }
    setFormData(prevData => ({ 
      ...prevData, 
      images: [...prevData.images, ...acceptedFiles.slice(0, 6 - prevData.images.length)] 
    }));
  }, [formData.images]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 6,
  });

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `users/${user.uid}/profile-pic`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setFormData(prevData => ({ 
      ...prevData, 
      userDetails: { ...prevData.userDetails, profilePic: url }
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await user.getIdToken();
      
      // Upload new images
      const uploadedUrls = await Promise.all(
        formData.images.map(async (image) => {
          if (typeof image === 'string') return image; // Already uploaded
          const storageRef = ref(storage, `listings/${user.uid}/${image.name}`);
          await uploadBytes(storageRef, image);
          return getDownloadURL(storageRef);
        })
      );
  
      const slugifiedTitle = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const listingId = `${listingType}/${slugifiedTitle}`;
  
      const formDataToSubmit = { 
        ...formData, 
        listingType, 
        listingId, 
        isIndividual: listingType === 'service' ? isIndividual : undefined,
        images: uploadedUrls
      };

      // Remove fields not related to the current listing type
      if (listingType !== 'service') delete formDataToSubmit.serviceCategory;
      if (listingType !== 'event') {
        delete formDataToSubmit.eventDate;
        delete formDataToSubmit.eventTime;
        delete formDataToSubmit.capacity;
        delete formDataToSubmit.eventPricing;
      }
      if (listingType !== 'stay') {
        delete formDataToSubmit.checkInTime;
        delete formDataToSubmit.checkOutTime;
        delete formDataToSubmit.stayAvailability;
        delete formDataToSubmit.amenities;
        delete formDataToSubmit.stayPrice;
      }
      if (listingType !== 'experience') {
        delete formDataToSubmit.experienceCategory;
        delete formDataToSubmit.duration;
        delete formDataToSubmit.included;
        delete formDataToSubmit.groupSize;
        delete formDataToSubmit.experiencePricing;
      }

      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formDataToSubmit),
      });

      if (response.ok) {
        toast.success('Listing added successfully!');
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        toast.error(`Failed to add listing: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding listing:', error);
      toast.error('An error occurred while adding the listing. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="py-32 text-center mx-auto animate-pulse">Loading...</div>;
  }

  const handleNextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const renderTypeSelection = () => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Select Listing Type</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {['service', 'event', 'stay', 'experience'].map((type) => (
          <Card 
            key={type} 
            className={`cursor-pointer ${listingType === type ? 'border-primary' : ''}`}
            onClick={() => { setListingType(type); setStep(type === 'service' ? 1 : 2); }}
          >
            <CardHeader>
              <CardTitle className="capitalize text-lg lg:text-3xl">{type}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </CardContent>
    </Card>
  );

  const renderServiceTypeSelection = () => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Service Provider Type</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center space-x-4">
          <Card 
            className={`cursor-pointer p-4 ${isIndividual ? 'border-primary' : ''}`}
            onClick={() => setIsIndividual(true)}
          >
            <CardTitle>Individual</CardTitle>
          </Card>
          <Card 
            className={`cursor-pointer p-4 ${!isIndividual ? 'border-primary' : ''}`}
            onClick={() => setIsIndividual(false)}
          >
            <CardTitle>Business</CardTitle>
          </Card>
        </div>
      </CardContent>
    </Card>
  );

  const renderBasicDetails = () => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Basic Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
        <Textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
        <Input
          name="videoLink"
          placeholder="Video Link"
          value={formData.videoLink}
          onChange={handleInputChange}
        />
        {listingType === 'service' && (
          <div>
            <Label>Service Category</Label>
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
              <SelectItem value="AC Repair">AC Repair</SelectItem>
              <SelectItem value="Appliance Repair">Appliance Repair</SelectItem>
              <SelectItem value="Auto Detailer">Auto Detailer</SelectItem>
              <SelectItem value="Auto Mechanic">Auto Mechanic</SelectItem>
              <SelectItem value="Barber">Barber</SelectItem>
              <SelectItem value="Barista">Barista</SelectItem>
              <SelectItem value="Builder">Builder</SelectItem>
              <SelectItem value="Car Wash">Car Wash</SelectItem>
              <SelectItem value="Carpenter">Carpenter</SelectItem>
              <SelectItem value="Computer Repair">Computer Repair</SelectItem>
              <SelectItem value="Contractors">Contractors</SelectItem>
              <SelectItem value="Cook">Cook</SelectItem>
              <SelectItem value="Dishwasher">Dishwasher</SelectItem>
              <SelectItem value="DJ">DJ</SelectItem>
              <SelectItem value="Dryer Repair">Dryer Repair</SelectItem>
              <SelectItem value="Electrician">Electrician</SelectItem>
              <SelectItem value="Furniture Repair">Furniture Repair</SelectItem>
              <SelectItem value="Gardener">Gardener</SelectItem>
              <SelectItem value="Graphic Designer">Graphic Designer</SelectItem>
              <SelectItem value="Hair Stylist">Hair Stylist</SelectItem>
              <SelectItem value="Home Cleaner">Home Cleaner</SelectItem>
              <SelectItem value="HVAC Repair">HVAC Repair</SelectItem>
              <SelectItem value="Janitor">Janitor</SelectItem>
              <SelectItem value="Landscaper">Landscaper</SelectItem>
              <SelectItem value="Locksmith">Locksmith</SelectItem>
              <SelectItem value="Makeup Artist">Makeup Artist</SelectItem>
              <SelectItem value="Masseuse">Masseuse</SelectItem>
              <SelectItem value="MC">MC</SelectItem>
              <SelectItem value="Mover">Mover</SelectItem>
              <SelectItem value="Music Producer">Music Producer</SelectItem>
              <SelectItem value="Painter">Painter</SelectItem>
              <SelectItem value="Pedicure Expert">Pedicure Expert</SelectItem>
              <SelectItem value="Manicure Expert">Manicure Expert</SelectItem>
              <SelectItem value="Personal Trainer">Personal Trainer</SelectItem>
              <SelectItem value="Pest Control">Pest Control</SelectItem>
              <SelectItem value="Phone Repair">Phone Repair</SelectItem>
              <SelectItem value="Photographer">Photographer</SelectItem>
              <SelectItem value="Plant Operator">Plant Operator</SelectItem>
              <SelectItem value="Plumber">Plumber</SelectItem>
              <SelectItem value="Pool Installation">Pool Installation</SelectItem>
              <SelectItem value="Printing">Printing</SelectItem>
              <SelectItem value="Refrigerator Repair">Refrigerator Repair</SelectItem>
              <SelectItem value="Rider">Rider</SelectItem>
              <SelectItem value="Roofing">Roofing</SelectItem>
              <SelectItem value="Septic Tank Cleaning">Septic Tank Cleaning</SelectItem>
              <SelectItem value="Solar Repair">Solar Repair</SelectItem>
              <SelectItem value="Solar Technician">Solar Technician</SelectItem>
              <SelectItem value="Tailor">Tailor</SelectItem>
              <SelectItem value="Truck/Bus Driver">Truck/Bus Driver</SelectItem>
              <SelectItem value="Tub Repair">Tub Repair</SelectItem>
              <SelectItem value="Tutor">Tutor</SelectItem>
              <SelectItem value="TV Repair">TV Repair</SelectItem>
              <SelectItem value="Warehouse Worker">Warehouse Worker</SelectItem>
              <SelectItem value="Welder">Welder</SelectItem>
              <SelectItem value="Window Tinting">Window Tinting</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        {listingType === 'stay' && (
          <div className="space-y-2">
            <Label>Price per night</Label>
            <div className="flex space-x-2">
              <Input
                name="stayPrice"
                type="number"
                placeholder="Price per night"
                value={formData.stayPrice}
                onChange={handleInputChange}
                required
              />
              <Select 
                value={formData.priceCurrency}
                onValueChange={(value) => setFormData(prevData => ({ ...prevData, priceCurrency: value }))}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="KES">KES</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        {listingType === 'experience' && (
          <div className="space-y-2">
            <Label>Experience Pricing</Label>
            {Object.keys(formData.experiencePricing).map((priceType) => (
              <div key={priceType} className="flex space-x-2">
                <Input
                  name={`experiencePricing.${priceType}`}
                  placeholder={`Price for ${priceType}`}
                  value={formData.experiencePricing[priceType]}
                  onChange={(e) => setFormData(prevData => ({
                    ...prevData,
                    experiencePricing: {
                      ...prevData.experiencePricing,
                      [priceType]: e.target.value
                    }
                  }))}
                  type="number"
                  required
                />
                <Select 
                  value={formData.priceCurrency}
                  onValueChange={(value) => setFormData(prevData => ({ ...prevData, priceCurrency: value }))}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KES">KES</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderGallery = () => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Gallery</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div {...getRootProps()} className="border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </div>
        <Button 
          type="button" 
          onClick={() => {
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) {
              fileInput.click();
            }
          }}
        >
          Choose Files
        </Button>
        {formData.images.length > 0 && (
          <div>
            <Label>Select Featured Image</Label>
            <div className="grid grid-cols-3 gap-2">
              {formData.images.map((image, index) => (
                <div 
                  key={index} 
                  className={`rounded-2xl cursor-pointer border p-2 ${index === formData.featuredImageIndex ? 'border-primary' : ''}`}
                  onClick={() => setFormData(prevData => ({ ...prevData, featuredImageIndex: index }))}
                >
                  <img 
                    src={typeof image === 'string' ? image : URL.createObjectURL(image)} 
                    alt={`Gallery item ${index + 1}`} 
                    className="w-full h-24 object-cover" 
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderLocation = () => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Location</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleInputChange}
        />
        <DynamicMap
          location={formData.location}
          setLocation={(location) => setFormData(prevData => ({ ...prevData, location }))}
        />
      </CardContent>
    </Card>
  );

  const renderOpeningHours = () => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Opening Hours</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.openingHours.enabled}
            onCheckedChange={(checked) => setFormData(prevData => ({ ...prevData, openingHours: { ...prevData.openingHours, enabled: checked } }))}
          />
          <Label>Enable Opening Hours</Label>
        </div>
        {formData.openingHours.enabled && (
          <div className="space-y-2">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
              <div key={day} className="flex items-center space-x-2">
                <Label className="w-24">{day}</Label>
                <TimePicker
                  value={formData.openingHours.hours[day]?.open || '09:00'}
                  onChange={(time) => setFormData(prevData => ({
                    ...prevData,
                    openingHours: {
                      ...prevData.openingHours,
                      hours: {
                        ...prevData.openingHours.hours,
                        [day]: { ...prevData.openingHours.hours[day], open: time }
                      }
                    }
                  }))}
                />
                <span>to</span>
                <TimePicker
                  value={formData.openingHours.hours[day]?.close || '17:00'}
                  onChange={(time) => setFormData(prevData => ({
                    ...prevData,
                    openingHours: {
                      ...prevData.openingHours,
                      hours: {
                        ...prevData.openingHours.hours,
                        [day]: { ...prevData.openingHours.hours[day], close: time }
                      }
                    }
                  }))}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderAvailability = () => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Availability</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.availability.enabled}
            onCheckedChange={(checked) => setFormData(prevData => ({ ...prevData, availability: { ...prevData.availability, enabled: checked } }))}
          />
          <Label>Enable Custom Availability</Label>
        </div>
        {formData.availability.enabled && (
          <div className="space-y-2">
            {formData.availability.slots.map((slot, index) => (
              <div key={index} className="flex items-center space-x-2">
                <TimePicker
                  value={slot.start}
                  onChange={(time) => {
                    const newSlots = [...formData.availability.slots];
                    newSlots[index].start = time;
                    setFormData(prevData => ({ ...prevData, availability: { ...prevData.availability, slots: newSlots } }));
                  }}
                />
                <span>to</span>
                <TimePicker
                  value={slot.end}
                  onChange={(time) => {
                    const newSlots = [...formData.availability.slots];
                    newSlots[index].end = time;
                    setFormData(prevData => ({ ...prevData, availability: { ...prevData.availability, slots: newSlots } }));
                  }}
                />
                <Button 
                  onClick={() => {
                    const newSlots = formData.availability.slots.filter((_, i) => i !== index);
                    setFormData(prevData => ({ ...prevData, availability: { ...prevData.availability, slots: newSlots } }));
                  }}
                  type="button"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button 
              onClick={() => {
                const newSlots = [...formData.availability.slots, { start: '09:00', end: '17:00' }];
                setFormData(prevData => ({ ...prevData, availability: { ...prevData.availability, slots: newSlots } }));
              }}
              type="button"
            >
              Add Time Slot
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderBookingOption = () => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Booking Option</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.bookingEnabled}
            onCheckedChange={(checked) => setFormData(prevData => ({ ...prevData, bookingEnabled: checked }))}
          />
          <Label>Enable Booking</Label>
        </div>
      </CardContent>
    </Card>
  );

  const renderUserDetails = () => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Your Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Label>Profile Picture/Logo</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={handleProfilePicChange}
          required={isFirstTimeListing}
        />
        <Input
          name="name"
          placeholder="Your Name/Business Name"
          value={formData.userDetails.name}
          onChange={(e) => setFormData(prevData => ({ ...prevData, userDetails: { ...prevData.userDetails, name: e.target.value } }))}
          required={isFirstTimeListing}
        />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Input
            name="phone"
            placeholder="Phone/WhatsApp Number"
            value={formData.userDetails.phone}
            onChange={(e) => setFormData(prevData => ({ ...prevData, userDetails: { ...prevData.userDetails, phone: e.target.value } }))}
            required={isFirstTimeListing}
          />
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.userDetails.email}
            onChange={(e) => setFormData(prevData => ({ ...prevData, userDetails: { ...prevData.userDetails, email: e.target.value } }))}
            required={isFirstTimeListing}
          />
        </div>
        <Textarea
          name="bio"
          placeholder="Bio (max 100 words)"
          value={formData.userDetails.bio}
          onChange={(e) => {
            const words = e.target.value.trim().split(/\s+/);
            if (words.length <= 100) {
              setFormData(prevData => ({ ...prevData, userDetails: { ...prevData.userDetails, bio: e.target.value } }));
            }
          }}
          required={isFirstTimeListing}
        />
        {Object.keys(formData.userDetails.socialMedia).map((platform) => (
          <Input
            key={platform}
            name={`socialMedia.${platform}`}
            placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} Link`}
            value={formData.userDetails.socialMedia[platform]}
            onChange={(e) => setFormData(prevData => ({
              ...prevData,
              userDetails: {
                ...prevData.userDetails,
                socialMedia: {
                  ...prevData.userDetails.socialMedia,
                  [platform]: e.target.value
                }
              }
            }))}
          />
        ))}
      </CardContent>
    </Card>
  );

  const renderEventFields = () => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Event Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
        {formData.eventPricing.map((ticket, index) => (
          <div key={index} className="flex space-x-2">
            <Input
              placeholder="Ticket Type"
              value={ticket.type}
              onChange={(e) => {
                const newPricing = [...formData.eventPricing];
                newPricing[index].type = e.target.value;
                setFormData(prevData => ({ ...prevData, eventPricing: newPricing }));
              }}
              required
            />
            <Input
              type="number"
              placeholder="Price"
              value={ticket.price}
              onChange={(e) => {
                const newPricing = [...formData.eventPricing];
                newPricing[index].price = e.target.value;
                setFormData(prevData => ({ ...prevData, eventPricing: newPricing }));
              }}
              required
            />
            <Select 
              value={formData.priceCurrency}
              onValueChange={(value) => setFormData(prevData => ({ ...prevData, priceCurrency: value }))}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="KES">KES</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
              </SelectContent>
            </Select>
            <Button 
            type="button"
            onClick={() => {
              const newPricing = formData.eventPricing.filter((_, i) => i !== index);
              setFormData(prevData => ({ ...prevData, eventPricing: newPricing }));
            }}>Remove</Button>
          </div>
        ))}
        <Button 
        type="button"
        onClick={() => {
          const newPricing = [...formData.eventPricing, { type: '', price: '' }];
          setFormData(prevData => ({ ...prevData, eventPricing: newPricing }));
        }}>Add Ticket Type</Button>
      </CardContent>
    </Card>
  );

  const renderStayFields = () => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Stay Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-4">
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
        </div>
        <div>
          <Label>Amenities</Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              'Wi-Fi', 'Kitchen', 'Parking', 'Pool', 'Air Conditioning', 'Heating',
              'TV', 'Washer', 'Dryer', 'Iron', 'Workspace', 'Hot Tub',
              'Gym', 'Breakfast', 'Indoor fireplace', 'Hangers', 'Hair dryer', 'Laptop-friendly workspace'
            ].map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity}
                  checked={formData.amenities.includes(amenity)}
                  onCheckedChange={(checked) => {
                    const newAmenities = checked
                      ? [...formData.amenities, amenity]
                      : formData.amenities.filter(a => a !== amenity);
                    setFormData(prevData => ({ ...prevData, amenities: newAmenities }));
                  }}
                />
                <Label htmlFor={amenity}>{amenity}</Label>
              </div>
            ))}
          </div>
        </div>
        {formData.stayAvailability.map((period, index) => (
          <div key={index} className="flex space-x-2">
            <Input
              type="date"
              value={period.start}
              onChange={(e) => {
                const newAvailability = [...formData.stayAvailability];
                newAvailability[index].start = e.target.value;
                setFormData(prevData => ({ ...prevData, stayAvailability: newAvailability }));
              }}
              required
            />
            <Input
              type="date"
              value={period.end}
              onChange={(e) => {
                const newAvailability = [...formData.stayAvailability];
                newAvailability[index].end = e.target.value;
                setFormData(prevData => ({ ...prevData, stayAvailability: newAvailability }));
              }}
              required
            />
            <Button onClick={() => {
              const newAvailability = formData.stayAvailability.filter((_, i) => i !== index);
              setFormData(prevData => ({ ...prevData, stayAvailability: newAvailability }));
            }}>Remove</Button>
          </div>
        ))}
        <Button 
        type="button"
        onClick={() => {
          const newAvailability = [...formData.stayAvailability, { start: '', end: '' }];
          setFormData(prevData => ({ ...prevData, stayAvailability: newAvailability }));
        }}>Add Availability Period</Button>
      </CardContent>
    </Card>
  );

  const renderExperienceFields = () => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Experience Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select 
          name="experienceCategory" 
          value={formData.experienceCategory}
          onValueChange={(value) => handleInputChange({ target: { name: 'experienceCategory', value } })}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Experience Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="outdoor">Outdoor Adventure</SelectItem>
            <SelectItem value="culinary">Culinary Experience</SelectItem>
            <SelectItem value="cultural">Cultural Experience</SelectItem>
            <SelectItem value="wellness">Wellness and Relaxation</SelectItem>
            <SelectItem value="learning">Learning and Skills</SelectItem>
            <SelectItem value="entertainment">Entertainment</SelectItem>
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
      </CardContent>
    </Card>
  );

  const renderPreview = () => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{formData.title}</h2>
          <p>{formData.description}</p>
          {formData.videoLink && (
            <div>
              <h3 className="text-xl font-semibold">Video</h3>
              <a href={formData.videoLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                Watch Video
              </a>
            </div>
          )}
          <div>
            <h3 className="text-xl font-semibold">Location</h3>
            <p>{formData.address}</p>
          </div>
          {formData.images.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold">Gallery</h3>
              <div className="grid grid-cols-3 gap-2">
                {formData.images.map((image, index) => (
                  <img 
                    key={index} 
                    src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                    alt={`Gallery item ${index + 1}`} 
                    className="w-full h-24 object-cover"
                  />
                ))}
              </div>
            </div>
          )}
          {listingType === 'service' && (
            <div>
              <h3 className="text-xl font-semibold">Service Category</h3>
              <p>{formData.serviceCategory}</p>
              <p>Provider Type: {isIndividual ? 'Individual' : 'Business'}</p>
            </div>
          )}
          {listingType === 'event' && (
            <div>
              <h3 className="text-xl font-semibold">Event Details</h3>
              <p>Date: {formData.eventDate}</p>
              <p>Time: {formData.eventTime}</p>
              <p>Capacity: {formData.capacity}</p>
              <h4 className="text-lg font-semibold">Pricing</h4>
              <ul>
                {formData.eventPricing.map((ticket, index) => (
                  <li key={index}>{ticket.type}: {formData.priceCurrency} {ticket.price}</li>
                ))}
              </ul>
            </div>
          )}
          {listingType === 'stay' && (
            <div>
              <h3 className="text-xl font-semibold">Stay Details</h3>
              <p>Check-in: {formData.checkInTime}</p>
              <p>Check-out: {formData.checkOutTime}</p>
              <p>Price per night: {formData.priceCurrency} {formData.stayPrice}</p>
              <h4 className="text-lg font-semibold">Amenities</h4>
              <ul>
                {formData.amenities.map((amenity, index) => (
                  <li key={index}>{amenity}</li>
                ))}
              </ul>
              <h4 className="text-lg font-semibold">Availability</h4>
              <ul>
                {formData.stayAvailability.map((period, index) => (
                  <li key={index}>From {period.start} to {period.end}</li>
                ))}
              </ul>
            </div>
          )}
          {listingType === 'experience' && (
            <div>
              <h3 className="text-xl font-semibold">Experience Details</h3>
              <p>Category: {formData.experienceCategory}</p>
              <p>Duration: {formData.duration}</p>
              <p>Group Size: {formData.groupSize}</p>
              <h4 className="text-lg font-semibold">What's Included</h4>
              <p>{formData.included}</p>
              <h4 className="text-lg font-semibold">Pricing</h4>
              <ul>
                {Object.entries(formData.experiencePricing).map(([type, price]) => (
                  <li key={type}>{type}: {formData.priceCurrency} {price}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const steps = [
    { title: 'Listing Type', component: renderTypeSelection },
    ...(listingType === 'service' ? [{ title: 'Service Type', component: renderServiceTypeSelection }] : []),
    { title: 'Basic Details', component: renderBasicDetails },
    { title: 'Gallery', component: renderGallery },
    { title: 'Location', component: renderLocation },
    ...(listingType !== 'stay' && listingType !== 'event' ? [{ title: 'Opening Hours', component: renderOpeningHours }] : []),
    ...(listingType !== 'stay' && listingType !== 'event' ? [{ title: 'Availability', component: renderAvailability }] : []),
    ...(listingType !== 'event' ? [{ title: 'Booking Option', component: renderBookingOption }] : []),
    { title: 'User Details', component: renderUserDetails },
    { title: 'Preview', component: renderPreview },
  ];

  if (listingType === 'event') {
    steps.splice(5, 0, { title: 'Event Details', component: renderEventFields });
  } else if (listingType === 'stay') {
    steps.splice(5, 0, { title: 'Stay Details', component: renderStayFields });
  } else if (listingType === 'experience') {
    steps.splice(5, 0, { title: 'Experience Details', component: renderExperienceFields });
  }

  return (
    <div className="min-h-screen mx-auto py-28 lg:py-32 lg:max-w-5xl bg-gray-100 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <AuthDialog 
          isOpen={isAuthDialogOpen} 
          onClose={handleAuthDialogClose}
        />
        <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-3xl">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              {steps[step].component()}
              <div className="flex justify-between">
                {step > 0 && (
                  <Button type="button" onClick={handlePreviousStep}>Previous</Button>
                )}
                {step < steps.length - 1 ? (
                  <Button type="button" onClick={handleNextStep}>Next</Button>
                ) : (
                  <Button type="button" onClick={handleSubmit}>Submit Listing</Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddListingForm;