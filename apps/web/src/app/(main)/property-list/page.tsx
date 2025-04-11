'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import FormSearch from '@/components/LandingPage/FormSearch';

export default function SearchPage() {
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [priceDisplay, setPriceDisplay] = useState('highest');

  const hotells = [
    {
      id: 1,
      name: 'The Gala Hotel',
      location: 'Buah batu, Bandung',
      facilities: ['Swimming pool', 'parking', 'sauna and spa'],
      price: 2459200,
      image: '/hotel1.jpg',
    },
    {
      id: 2,
      name: 'The Gala Hotel',
      location: 'Buah batu, Bandung',
      facilities: ['Swimming pool', 'parking', 'sauna and spa'],
      price: 2459200,
      image: '/hotel1.jpg',
    },
    {
      id: 3,
      name: 'The Gala Hotel',
      location: 'Buah batu, Bandung',
      facilities: ['Swimming pool', 'parking', 'sauna and spa'],
      price: 2459200,
      image: '/hotel1.jpg',
    },
  ];

  return (
    <div className="container mx-auto px-10 mt-14 py-12">
      <div className="flex flex-col md:flex-row gap-6 mt-8">
        <div className="max-w-4xl md:w-64 flex-shrink-0">
          <div className="border border-blue-200 rounded-md p-4">
            <h3 className="text-sm font-medium mb-4">Filter by:</h3>

            <div className="mb-6 mt-8">
              <h4 className="font-medium mb-2">Property type:</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox id="hotels" />
                  <Label htmlFor="hotels" className="ml-2 text-sm font-normal">
                    Hotels
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="apartments" />
                  <Label
                    htmlFor="apartments"
                    className="ml-2 text-sm font-normal"
                  >
                    Apartments
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="villas" />
                  <Label htmlFor="villas" className="ml-2 text-sm font-normal">
                    Villas
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="cottages" />
                  <Label
                    htmlFor="cottages"
                    className="ml-2 text-sm font-normal"
                  >
                    Cottages
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <FormSearch />
            <div>
              <h2 className="text-lg font-medium text-sky-500">Bandung</h2>
              <p className="text-sm text-gray-500">230 properties found</p>
            </div>

            <div className="flex flex-col md:flex-row gap-2 mt-2 md:mt-0 ">
              <div className="flex items-center gap-2">
                <span className="text-sm">sort by:</span>
                <div className="relative">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px] h-8 text-sm">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="absolute z-50">
                      <SelectItem value="name">name of property</SelectItem>
                      <SelectItem value="price">price</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative">
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-[70px] h-8 text-sm">
                      <SelectValue placeholder="Order" />
                    </SelectTrigger>
                    <SelectContent className="absolute z-50">
                      <SelectItem value="asc">asc</SelectItem>
                      <SelectItem value="desc">desc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm">price display:</span>
                <div className="relative">
                  <Select value={priceDisplay} onValueChange={setPriceDisplay}>
                    <SelectTrigger className="w-[120px] h-8 text-sm">
                      <SelectValue placeholder="Price display" />
                    </SelectTrigger>
                    <SelectContent className="absolute z-50">
                      <SelectItem value="highest">highest price</SelectItem>
                      <SelectItem value="lowest">lowest price</SelectItem>
                      <SelectItem value="average">average price</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {hotells.map((hotell) => (
              <div
                key={hotell.id}
                className="border rounded-md overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <Image
                      src={hotell.image || '/placeholder.svg'}
                      alt={hotell.name}
                      width={300}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 p-6 flex flex-col md:flex-row justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{hotell.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <MapPin size={14} className="mr-1" />
                        <span>{hotell.location}</span>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-1">Facilities:</p>
                        <p className="text-sm text-gray-600">
                          {hotell.facilities.join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 flex flex-col items-end justify-between">
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          Rp {hotell.price.toLocaleString()}
                        </p>
                      </div>

                      <Button className="bg-sky-400 hover:bg-sky-500 mt-4">
                        Select Room
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-10">
            <div className="flex">
              <Button
                variant="outline"
                className="rounded-l-md rounded-r-none border-r-0"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                className="rounded-none border-r-0 bg-gray-100"
              >
                3
              </Button>
              <Button variant="outline" className="rounded-none border-r-0">
                4
              </Button>
              <Button variant="outline" className="rounded-r-md rounded-l-none">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
