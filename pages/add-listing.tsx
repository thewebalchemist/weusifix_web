import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Textarea } from './components/ui/textarea';
import { Checkbox } from './components/ui/checkbox';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Label } from './components/ui/label';
import { Switch } from './components/ui/switch';


// Dynamically import the Map component
const DynamicMap = dynamic(() => import('./components/MapComponent'), {
  ssr: false, // This will disable server-side rendering for this component
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
  const [step, setStep] = useState(0);
  const [listingType, setListingType] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoLink: '',
    location: [51.505, -0.09], // Default to London
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
      profilePic: null,
      phone: '',
      email: '',
      bio: '',
      socialMedia: {
        facebook: '',
        twitter: '',
        tiktok: '',
        instagram: '',
        youtube: ''
      }
    },
    // Service specific
    serviceCategory: '',
    // Event specific
    eventDate: null,
    eventTime: null,
    capacity: '',
    eventPricing: [],
    // Stay specific
    checkInTime: null,
    checkOutTime: null,
    stayAvailability: [],
    amenities: [],
    stayPrice: '',
    // Experience specific
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prevData => ({ ...prevData, images: Array.from(e.target.files) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Handle form submission (e.g., send data to backend)
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
            onClick={() => { setListingType(type); setStep(1); }}
          >
            <CardHeader>
              <CardTitle className="capitalize">{type}</CardTitle>
            </CardHeader>
          </Card>
        ))}
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
        />
        <Textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
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
            <div className="grid grid-cols-3 gap-2">
              {['Home Services', 'Professional Services', 'Personal Care'].map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={formData.serviceCategory === category}
                    onCheckedChange={() => setFormData(prevData => ({ ...prevData, serviceCategory: category }))}
                  />
                  <Label htmlFor={category}>{category}</Label>
                </div>
              ))}
            </div>
          </div>
        )}
        {listingType === 'stay' && (
          <Input
            name="stayPrice"
            type="number"
            placeholder="Price per night"
            value={formData.stayPrice}
            onChange={handleInputChange}
          />
        )}
        {listingType === 'experience' && (
          <div className="space-y-2">
            <Label>Experience Pricing</Label>
            {Object.keys(formData.experiencePricing).map((priceType) => (
              <Input
                key={priceType}
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
              />
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
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
        {formData.images.length > 0 && (
          <div>
            <Label>Select Featured Image</Label>
            <div className="grid grid-cols-4 gap-2">
              {formData.images.map((image, index) => (
                <div 
                  key={index} 
                  className={`rounded-2xl cursor-pointer border p-2 ${index === formData.featuredImageIndex ? 'border-primary' : ''}`}
                  onClick={() => setFormData(prevData => ({ ...prevData, featuredImageIndex: index }))}
                >
                  <img src={URL.createObjectURL(image)} alt={`Gallery item ${index + 1}`} className="w-full h-24 object-cover" />
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
                <Button onClick={() => {
                  const newSlots = formData.availability.slots.filter((_, i) => i !== index);
                  setFormData(prevData => ({ ...prevData, availability: { ...prevData.availability, slots: newSlots } }));
                }}>Remove</Button>
              </div>
            ))}
            <Button onClick={() => {
              const newSlots = [...formData.availability.slots, { start: '09:00', end: '17:00' }];
              setFormData(prevData => ({ ...prevData, availability: { ...prevData.availability, slots: newSlots } }));
            }}>Add Time Slot</Button>
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
          onChange={(e) => setFormData(prevData => ({ ...prevData, userDetails: { ...prevData.userDetails, profilePic: e.target.files[0] } }))}
        />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Input
          name="phone"
          placeholder="Phone/WhatsApp Number"
          value={formData.userDetails.phone}
          onChange={(e) => setFormData(prevData => ({ ...prevData, userDetails: { ...prevData.userDetails, phone: e.target.value } }))}
        />
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.userDetails.email}
          onChange={(e) => setFormData(prevData => ({ ...prevData, userDetails: { ...prevData.userDetails, email: e.target.value } }))}
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
    <>
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
          />
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Event Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
              />
              <Button onClick={() => {
                const newPricing = formData.eventPricing.filter((_, i) => i !== index);
                setFormData(prevData => ({ ...prevData, eventPricing: newPricing }));
              }}>Remove</Button>
            </div>
          ))}
          <Button onClick={() => {
            const newPricing = [...formData.eventPricing, { type: '', price: '' }];
            setFormData(prevData => ({ ...prevData, eventPricing: newPricing }));
          }}>Add Ticket Type</Button>
        </CardContent>
      </Card>
    </>
  );

  const renderStayFields = () => (
    <>
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
              {['Wi-Fi', 'Kitchen', 'Parking', 'Pool', 'Air Conditioning'].map((amenity) => (
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
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Stay Availability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
              />
              <Input
                type="date"
                value={period.end}
                onChange={(e) => {
                  const newAvailability = [...formData.stayAvailability];
                  newAvailability[index].end = e.target.value;
                  setFormData(prevData => ({ ...prevData, stayAvailability: newAvailability }));
                }}
              />
              <Button onClick={() => {
                const newAvailability = formData.stayAvailability.filter((_, i) => i !== index);
                setFormData(prevData => ({ ...prevData, stayAvailability: newAvailability }));
              }}>Remove</Button>
            </div>
          ))}
          <Button onClick={() => {
            const newAvailability = [...formData.stayAvailability, { start: '', end: '' }];
            setFormData(prevData => ({ ...prevData, stayAvailability: newAvailability }));
          }}>Add Availability Period</Button>
        </CardContent>
      </Card>
    </>
  );

  const renderExperienceFields = () => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Experience Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select name="experienceCategory" onValueChange={(value) => handleInputChange({ target: { name: 'experienceCategory', value } })}>
          <SelectTrigger className="w-full">
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
        />
        <Textarea
          name="included"
          placeholder="What's included in the experience?"
          value={formData.included}
          onChange={handleInputChange}
        />
        <Input
          name="groupSize"
          type="number"
          placeholder="Maximum Group Size"
          value={formData.groupSize}
          onChange={handleInputChange}
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
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </CardContent>
    </Card>
  );

  const steps = [
    { title: 'Listing Type', component: renderTypeSelection },
    { title: 'Basic Details', component: renderBasicDetails },
    { title: 'Gallery', component: renderGallery },
    { title: 'Location', component: renderLocation },
    { title: 'Opening Hours', component: renderOpeningHours },
    { title: 'Availability', component: renderAvailability },
    { title: 'Booking Option', component: renderBookingOption },
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
        <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-3xl">
          
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {steps[step].component()}
              <div className="flex justify-between">
                {step > 0 && (
                  <Button type="button" onClick={() => setStep(step - 1)}>Previous</Button>
                )}
                {step < steps.length - 1 ? (
                  <Button type="button" onClick={() => setStep(step + 1)}>Next</Button>
                ) : (
                  <Button type="submit">Submit Listing</Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddListingForm;