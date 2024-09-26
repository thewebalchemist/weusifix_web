import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const popularCities = [
  "Nairobi", "Nakuru", "Mombasa", "Kisumu", "Eldoret", "Nyeri", "Thika", "Isiolo", "Meru", "Malindi",
  "Machakos", "Lamu", "Kilifi", "Kericho", "Kakamega", "Bungoma", "Cairo", "Johannesburg",
  "Cape Town", "Lagos", "Casablanca", "Addis Ababa", "Kinshasa",
  "Accra", "Dar es Salaam", "Algiers", "Tunis", "Abidjan",
  "Luanda", "Kampala", "Harare", "Alexandria"
];

const professionalsNearYou = [
  "Plumbers", "Appliance repair", "Handyman", "Electrician", "Cleaning services", "Roofing companies",
  "Moving companies", "Fence repair", "Home cleaning", "Welding services", "Computer repair", "Landscapers",
  "Refrigerator repair", "TV repair", "Carpet cleaning", "Painters", "Exterminator", "General contractors",
  "Phone repair", "Window replacement", "Concrete contractors", "Dryer repair", "Window tinting",
  "Furniture repair", "Washing machine repair", "Pool installation", "Solar repairs", "Hot tub repair",
  "AC repair", "Septic tank cleaning", "Auto Mechanic", "Barber", "Hair Saloonist", "Cooks", "Chefs", "Baristas"
];

const professionalsForHire = [
  "Chef", "Personal trainer", "Tutor", "Photographer", "Videographer", "Makeup artist", "Hairstylist",
  "DJ", "Music Producers", "Masseurs", "Carpenter", "Electrician", "Plumber", "Home Cleaners", "Mechanic",
  "Painters", "Auto detailer", "Welder", "HVAC technician", "Locksmith"
];

const HomepageSections: React.FC = () => {
  return (
    <div className="container mx-auto px-2 lg:px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Popular Cities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {popularCities.map((city) => (
              <Link href={`/search?location=${encodeURIComponent(city)}`} key={city}>
                <Button variant="outline" className="w-full">{city}</Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Professionals Near You</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols md:grid-cols-2 lg:grid-cols-3 gap-4">
            {professionalsNearYou.map((professional) => (
              <Link href={`/search?query=${encodeURIComponent(professional)} near me`} key={professional}>
                <Button variant="outline" className="w-full">{professional} near me</Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Professionals For Hire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {professionalsForHire.map((professional) => (
              <Link href={`/search?query=${encodeURIComponent(professional)} for hire`} key={professional}>
                <Button variant="outline" className="w-full">{professional} for hire</Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomepageSections;