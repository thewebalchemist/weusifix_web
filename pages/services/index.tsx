import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { mockServiceListing } from '../data/mockData';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';

const ITEMS_PER_PAGE = 12;

const ServicesPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchLocation, setSearchLocation] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredListings, setFilteredListings] = useState([]);
    const [filters, setFilters] = useState({
        homeServices: false,
        professionalServices: false,
        personalCare: false,
    });

    useEffect(() => {
        if (Array.isArray(mockServiceListing)) {
            const filtered = mockServiceListing.filter(service => 
            (searchQuery === '' || service.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (searchLocation === '' || service.location.toLowerCase().includes(searchLocation.toLowerCase())) &&
            ((!filters.homeServices && !filters.professionalServices && !filters.personalCare) ||
            (filters.homeServices && service.category === 'Home Services') ||
            (filters.professionalServices && service.category === 'Professional Services') ||
            (filters.personalCare && service.category === 'Personal Care'))
        );
        setFilteredListings(filtered);
        setCurrentPage(1);
    }
    else {
        setFilteredListings([]);
    }
    }, [searchQuery, searchLocation, filters]);

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
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Find Services</h2>
                            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                                <Input
                                    type="text"
                                    placeholder="What Type of Service Are You Looking For?"
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
                                    id="homeServices" 
                                    checked={filters.homeServices}
                                    onCheckedChange={() => handleFilterChange('homeServices')}
                                />
                                <label htmlFor="homeServices" className="ml-2">Home Services</label>
                            </div>
                            <div className="flex items-center">
                                <Checkbox 
                                    id="professionalServices" 
                                    checked={filters.professionalServices}
                                    onCheckedChange={() => handleFilterChange('professionalServices')}
                                />
                                <label htmlFor="professionalServices" className="ml-2">Professional Services</label>
                            </div>
                            <div className="flex items-center">
                                <Checkbox 
                                    id="personalCare" 
                                    checked={filters.personalCare}
                                    onCheckedChange={() => handleFilterChange('personalCare')}
                                />
                                <label htmlFor="personalCare" className="ml-2">Personal Care</label>
                            </div>
                        </div>
                    </div>

                    {/* Listings */}
                    <div className="md:w-3/4">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Browse Services</h1>
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

export default ServicesPage;