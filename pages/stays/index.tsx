import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { mockStayListing } from '../data/mockData';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';

const ITEMS_PER_PAGE = 12;

const StaysPage = () => {
    const [searchLocation, setSearchLocation] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [guests, setGuests] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredListings, setFilteredListings] = useState([]);
    const [filters, setFilters] = useState({
        hotels: false,
        apartments: false,
        resorts: false,
        villas: false,
    });

    useEffect(() => {
        if (Array.isArray(mockStayListing)) {
            const filtered = mockStayListing.filter(stay => 
            (searchLocation === '' || stay.location.toLowerCase().includes(searchLocation.toLowerCase())) &&
            (checkInDate === '' || new Date(stay.availableFrom) <= new Date(checkInDate)) &&
            (checkOutDate === '' || new Date(stay.availableTo) >= new Date(checkOutDate)) &&
            (guests <= stay.maxGuests) &&
            ((!filters.hotels && !filters.apartments && !filters.resorts && !filters.villas) ||
            (filters.hotels && stay.type === 'Hotel') ||
            (filters.apartments && stay.type === 'Apartment') ||
            (filters.resorts && stay.type === 'Resort') ||
            (filters.villas && stay.type === 'Villa'))
        );
        setFilteredListings(filtered);
        setCurrentPage(1);
    }
    else {
        setFilteredListings([]);
    }
    }, [searchLocation, checkInDate, checkOutDate, guests, filters]);

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
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Find Your Perfect Stay</h2>
                            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                                <Input
                                    type="text"
                                    placeholder="Location"
                                    value={searchLocation}
                                    onChange={(e) => setSearchLocation(e.target.value)}
                                    className="flex-grow"
                                />
                                <Input
                                    type="date"
                                    placeholder="Check In"
                                    value={checkInDate}
                                    onChange={(e) => setCheckInDate(e.target.value)}
                                    className="flex-grow"
                                />
                                <Input
                                    type="date"
                                    placeholder="Check Out"
                                    value={checkOutDate}
                                    onChange={(e) => setCheckOutDate(e.target.value)}
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
                                    id="hotels" 
                                    checked={filters.hotels}
                                    onCheckedChange={() => handleFilterChange('hotels')}
                                />
                                <label htmlFor="hotels" className="ml-2">Hotels</label>
                            </div>
                            <div className="flex items-center">
                                <Checkbox 
                                    id="apartments" 
                                    checked={filters.apartments}
                                    onCheckedChange={() => handleFilterChange('apartments')}
                                />
                                <label htmlFor="apartments" className="ml-2">Apartments</label>
                            </div>
                            <div className="flex items-center">
                                <Checkbox 
                                    id="resorts" 
                                    checked={filters.resorts}
                                    onCheckedChange={() => handleFilterChange('resorts')}
                                />
                                <label htmlFor="resorts" className="ml-2">Resorts</label>
                            </div>
                            <div className="flex items-center">
                                <Checkbox 
                                    id="villas" 
                                    checked={filters.villas}
                                    onCheckedChange={() => handleFilterChange('villas')}
                                />
                                <label htmlFor="villas" className="ml-2">Villas</label>
                            </div>
                        </div>
                    </div>

                    {/* Listings */}
                    <div className="md:w-3/4">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Browse Stays</h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentListings.map((listing) => (
                                <Card key={listing.id}>
                                    <CardHeader>
                                        <img src={listing.images[0]} alt={listing.title} className="w-full h-48 object-cover rounded-t-lg" />
                                    </CardHeader>
                                    <CardContent>
                                        <CardTitle>{listing.title}</CardTitle>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{listing.type}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{listing.location}</p>
                                        <p className="text-sm font-bold">${listing.price} / night</p>
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

export default StaysPage;