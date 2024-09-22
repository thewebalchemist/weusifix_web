// Mock data for listings

export const mockServiceListing = {
    id: "service1",
    title: "Professional House Cleaning",
    description: "Experienced cleaners providing top-notch house cleaning services. We use eco-friendly products and pay attention to every detail to ensure your home is spotless.",
    location: "San Francisco, CA",
    price: 50,
    images: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    ],
    providerName: "CleanPro Services",
    providerAvatar: "https://randomuser.me/api/portraits/women/65.jpg",
    providerRating: 4.8,
    reviews: [
      {
        userName: "John D.",
        userAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
        rating: 5,
        comment: "Excellent service! My house has never been cleaner."
      },
      {
        userName: "Sarah M.",
        userAvatar: "https://randomuser.me/api/portraits/women/2.jpg",
        rating: 4,
        comment: "Very thorough cleaning. Will definitely use again."
      },
      {
        userName: "Mike R.",
        userAvatar: "https://randomuser.me/api/portraits/men/3.jpg",
        rating: 5,
        comment: "Professional and efficient. Highly recommended!"
      }
    ]
  };
  
  export const mockEventListing = {
    id: "event1",
    title: "San Francisco Food Festival",
    description: "Join us for a culinary adventure at the annual San Francisco Food Festival. Taste dishes from top local restaurants, enjoy live music, and participate in cooking demonstrations.",
    location: "Golden Gate Park, San Francisco, CA",
    date: "2023-09-15",
    time: "11:00 AM - 8:00 PM",
    price: 45,
    capacity: 5000,
    images: [
      "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    ],
    organizerName: "SF Food Events",
    organizerAvatar: "https://randomuser.me/api/portraits/men/67.jpg",
    organizerDescription: "Bringing the best food events to San Francisco since 2010.",
    schedule: [
      { time: "11:00 AM", activity: "Festival Opens" },
      { time: "12:00 PM", activity: "Cooking Demonstration by Chef Alice Waters" },
      { time: "2:00 PM", activity: "Live Music Performance" },
      { time: "4:00 PM", activity: "Mixology Workshop" },
      { time: "6:00 PM", activity: "Food Awards Ceremony" },
      { time: "8:00 PM", activity: "Festival Closes" }
    ]
  };
  
  export const mockStayListing = {
    id: "stay1",
    title: "Luxury Beachfront Villa",
    description: "Experience paradise in this stunning beachfront villa. Enjoy breathtaking ocean views, a private pool, and direct beach access. Perfect for a relaxing getaway or a family vacation.",
    location: "Maui, Hawaii",
    price: 500,
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    ],
    hostName: "Elena K.",
    hostAvatar: "https://randomuser.me/api/portraits/women/68.jpg",
    hostRating: 4.9,
    amenities: [
      "Wi-Fi",
      "Pool",
      "Beach Access",
      "Air Conditioning",
      "Fully Equipped Kitchen",
      "Parking"
    ],
    reviews: [
      {
        userName: "David L.",
        userAvatar: "https://randomuser.me/api/portraits/men/4.jpg",
        rating: 5,
        comment: "Absolutely stunning villa with an unbeatable location. We had an amazing stay!"
      },
      {
        userName: "Emma S.",
        userAvatar: "https://randomuser.me/api/portraits/women/5.jpg",
        rating: 5,
        comment: "The perfect tropical getaway. The villa is beautiful and the host was very helpful."
      },
      {
        userName: "Robert T.",
        userAvatar: "https://randomuser.me/api/portraits/men/6.jpg",
        rating: 4,
        comment: "Gorgeous property with great amenities. Slightly pricey but worth it for the location."
      }
    ]
  };
  
  export const mockExperienceListing = {
    id: "experience1",
    title: "Tuscan Cooking Class and Wine Tasting",
    description: "Immerse yourself in the flavors of Tuscany with this hands-on cooking class and wine tasting experience. Learn to make traditional Italian dishes and sample local wines in a beautiful countryside setting.",
    location: "Florence, Italy",
    price: 120,
    duration: "6 hours",
    maxGroupSize: 8,
    images: [
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1543353071-10c8ba85a904?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    ],
    hostName: "Marco B.",
    hostAvatar: "https://randomuser.me/api/portraits/men/69.jpg",
    hostRating: 4.9,
    hostBio: "Professional chef with 20 years of experience in traditional Tuscan cuisine.",
    included: [
      "Cooking class materials and ingredients",
      "Wine tasting (4 local wines)",
      "Lunch featuring prepared dishes",
      "Recipes to take home"
    ],
    itinerary: [
      { time: "10:00 AM", activity: "Meet at the cooking school and introductions" },
      { time: "10:30 AM", activity: "Tour of the herb garden and ingredient selection" },
      { time: "11:00 AM", activity: "Hands-on cooking class" },
      { time: "1:00 PM", activity: "Lunch featuring prepared dishes" },
      { time: "2:00 PM", activity: "Wine tasting and pairing discussion" },
      { time: "3:30 PM", activity: "Recipe sharing and farewell" }
    ],
    reviews: [
      {
        userName: "Jennifer H.",
        userAvatar: "https://randomuser.me/api/portraits/women/7.jpg",
        rating: 5,
        comment: "An unforgettable experience! Marco is an excellent teacher and the food was delicious."
      },
      {
        userName: "Thomas B.",
        userAvatar: "https://randomuser.me/api/portraits/men/8.jpg",
        rating: 5,
        comment: "Highlight of our trip to Italy. Learned so much about Tuscan cuisine and wine."
      },
      {
        userName: "Laura M.",
        userAvatar: "https://randomuser.me/api/portraits/women/9.jpg",
        rating: 4,
        comment: "Great class in a beautiful setting. Would have liked a bit more wine tasting, but overall excellent."
      }
    ]
  };