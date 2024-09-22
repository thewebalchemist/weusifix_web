import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { Search } from 'lucide-react';
import { mockExperienceListing } from '../data/mockData';

const ITEMS_PER_PAGE = 12;

const ExperiencesPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchLocation, setSearchLocation] = useState('');
    const [date, setDate] = useState('');
    const [guests, setGuests] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredListings, setFilteredListings] = useState([]);
    const [filters, setFilters] = useState({
        outdoor: false,
        culinary: false,
        cultural: false,
        wellness: false,
    });

    useEffect(() => {
        if (Array.isArray(mockExperienceListing)) {
            const filtered = mockExperienceListing.filter(experience => 
            (searchQuery === '' || experience.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (searchLocation === '' || experience.location.toLowerCase().includes(searchLocation.toLowerCase())) &&
            (date === '' || new Date(experience.availableDates).some(d => d.toDateString() === new Date(date).toDateString())) &&
            (guests <= experience.maxGroupSize) &&
            ((!filters.outdoor && !filters.culinary && !filters.cultural && !filters.wellness) ||
            (filters.outdoor && experience.category === 'Outdoor Adventure') ||
            (filters.culinary && experience.category === 'Culinary Experience') ||
            (filters.cultural && experience.category === 'Cultural Experience') ||
            (filters.wellness && experience.category === 'Wellness'))
        );
        setFilteredListings(filtered);
        setCurrentPage(1);
    }
    else {
        console.error('mockEventListing is not an array:', mockExperienceListing);
        setFilteredListings([]);
    }
    }, [searchQuery, searchLocation, date, guests, filters]);

    const handleSearch = (e) => {
        e.preventDefault();
        // Search is handled by the useEffect hook
    };

    const handleFilterChange = (filterName) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: !prevFilters[filterName]
        }));
    };

    const pageCount = Math.ceil(filteredListings.length / ITEMS_PER_PAGE);
    const currentListings = filteredListings.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Search Form Section */}
                <div className="px-4 py-8 sm:px-0">
                    <div className="rounded-lg bg-white dark:bg-gray-800 shadow-xl overflow-hidden">
                        <div className="px-4 py-5 sm:p-6">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Find Experiences</h2>
                            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                                <Input
                                    type="text"
                                    placeholder="Experience Name"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-grow"
                                />
                                <Input
                                    type="text"
                                    placeholder="Location"
                                    value={searchLocation}
                                    onChange={(e) => setSearchLocation(e.target.value)}
                                    className="flex-grow"
                                />
                                <Input
                                    type="date"
                                    placeholder="Date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="flex-grow"
                                />
                                <Input
                                    type="number"
                                    placeholder="Guests"
                                    value={guests}
                                    onChange={(e) => setGuests(e.target.valueAsNumber)}
                                    className="flex-grow"
                                />
                                <Button type="submit" className="w-full sm:w-auto">
                                    <Search className="mr-2 h-4 w-4" /> Search
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Filters */}
                    <div className="md:w-1/4">
                        <h2 className="text-xl font-semibold mb-4">Filters</h2>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <Checkbox 
                                    id="outdoor" 
                                    checked={filters.outdoor}
                                    onCheckedChange={() => handleFilterChange('outdoor')}
                                />
                                <label htmlFor="outdoor" className="ml-2">Outdoor Adventure</label>
                            </div>
                            <div className="flex items-center">
                                <Checkbox 
                                    id="culinary" 
                                    checked={filters.culinary}
                                    onCheckedChange={() => handleFilterChange('culinary')}
                                />
                                <label htmlFor="culinary" className="ml-2">Culinary Experience</label>
                            </div>
                            <div className="flex items-center">
                                <Checkbox 
                                    id="cultural" 
                                    checked={filters.cultural}
                                    onCheckedChange={() => handleFilterChange('cultural')}
                                />
                                <label htmlFor="cultural" className="ml-2">Cultural Experience</label>
                            </div>
                            <div className="flex items-center">
                                <Checkbox 
                                    id="wellness" 
                                    checked={filters.wellness}
                                    onCheckedChange={() => handleFilterChange('wellness')}
                                />
                                <label htmlFor="wellness" className="ml-2">Wellness</label>
                            </div>
                        </div>
                    </div>

                    {/* Listings */}
                    <div className="md:w-3/4">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Browse Experiences</h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentListings.map((listing) => (
                                <Card key={listing.id}>
                                    <CardHeader>
                                        <img src={listing.images[0]} alt={listing.title} className="w-full h-48 object-cover rounded-t-lg" />
                                    </CardHeader>
                                    <CardContent>
                                        <CardTitle>{listing.title}</CardTitle>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{listing.category}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{listing.location}</p>
                                        <p className="text-sm font-bold">${listing.price} / person</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Duration: {listing.duration}</p>
                                    </CardContent>
                                    <CardFooter>
                                        <Button variant="outline" className="w-full">View Details</Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-8 flex justify-center">
                            <div className="join">
                                {[...Array(pageCount)].map((_, index) => (
                                    <Button
                                        key={index}
                                        className={`join-item ${currentPage === index + 1 ? 'btn-active' : ''}`}
                                        onClick={() => setCurrentPage(index + 1)}
                                    >
                                        {index + 1}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ExperiencesPage;