'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
import { useDispatch, useSelector } from 'react-redux';
import { searchProperties } from '../../../store/propertyList.slice';
import { AppDispatch } from '../../../store/index';
import { useSearchParams } from 'next/navigation';

// Updated Property type definition to include all properties used in the code
interface Property {
  id?: string;
  property_code?: string;
  property_name?: string;
  property_photo?: string;
  city?: string;
  province?: string;
  lowest_price?: number;
  highest_price?: number;
  facilities?: string | Array<{ name?: string }>;
  property_having_facilities?: Array<{
    property_facility?: {
      property_facility_name?: string;
    };
  }>;
  property_type?: string;
}

// Property state interface
interface PropertyState {
  properties: Property[];
  loading: boolean;
  error: string | null;
}

// Define the search form data interface
interface SearchFormData {
  city: string;
  'check-in': string;
  'check-out': string;
  rooms: number;
  adults?: number;
  children?: number;
}

export default function PropertyList() {
  const dispatch = useDispatch<AppDispatch>();
  const { properties, loading, error } = useSelector(
    (state: { propertyList: PropertyState }) => state.propertyList,
  );
  // Get URL search parameters
  const searchParamsUrl = useSearchParams();

  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [priceDisplay, setPriceDisplay] = useState('highest');
  const [propertyTypes, setPropertyTypes] = useState<{
    [key: string]: boolean;
  }>({
    hotels: false,
    apartments: false,
    villas: false,
    cottages: false,
  });

  // Initialize state based on URL parameters or defaults
  const [searchParams, setSearchParams] = useState<SearchFormData>(() => {
    // Get parameters from URL or use defaults
    return {
      city: searchParamsUrl.get('city') || 'Bandung',
      'check-in':
        searchParamsUrl.get('check-in') ||
        new Date().toISOString().split('T')[0],
      'check-out':
        searchParamsUrl.get('check-out') ||
        new Date(Date.now() + 86400000).toISOString().split('T')[0],
      rooms: parseInt(searchParamsUrl.get('rooms') || '1', 10),
      adults: parseInt(searchParamsUrl.get('adults') || '2', 10),
      children: parseInt(searchParamsUrl.get('children') || '0', 10),
    };
  });

  // Load properties when component mounts or searchParams changes
  useEffect(() => {
    // Format dates for the API
    const formatDateForApi = (dateStr: string): string => {
      // Handle both ISO format and DD-MM-YYYY format
      if (dateStr.includes('-')) {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          // Check if it's ISO format (YYYY-MM-DD) or DD-MM-YYYY
          if (parts[0].length === 4) {
            // ISO format: convert to DD-MM-YYYY
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
          } else if (parts[2].length === 4) {
            // Already DD-MM-YYYY format
            return dateStr;
          }
        }
      }
      return dateStr; // Return as is if format is unknown
    };

    const mappedParams = {
      city: searchParams.city,
      checkIn: formatDateForApi(searchParams['check-in']),
      checkOut: formatDateForApi(searchParams['check-out']),
      rooms: searchParams.rooms,
      adults: searchParams.adults,
      children: searchParams.children,
    };

    dispatch(searchProperties(mappedParams));
  }, [dispatch, searchParams]);

  // Handle search form submission
  const handleSearch = (formData: SearchFormData) => {
    setSearchParams(formData);
  };

  // Handle property type filter changes
  const handlePropertyTypeChange = (type: string, checked: boolean) => {
    setPropertyTypes((prev) => ({
      ...prev,
      [type]: checked,
    }));
  };

  // Apply filters to properties
  const filteredProperties = properties.filter((property) => {
    // Skip filtering if no property types are selected
    const anyTypeSelected = Object.values(propertyTypes).some(Boolean);
    if (!anyTypeSelected) return true;

    // This is a simplified filter - in a real app, you'd map property types properly
    const type = property.property_type?.toLowerCase() || '';

    if (propertyTypes.hotels && type.includes('hotel')) return true;
    if (propertyTypes.apartments && type.includes('apartment')) return true;
    if (propertyTypes.villas && type.includes('villa')) return true;
    if (propertyTypes.cottages && type.includes('cottage')) return true;

    return false;
  });

  // Sort the properties based on sortBy and sortOrder
  const sortedProperties = [...filteredProperties].sort(
    (a: Property, b: Property) => {
      if (sortBy === 'name') {
        const aName = a.property_name || '';
        const bName = b.property_name || '';
        return sortOrder === 'asc'
          ? aName.localeCompare(bName)
          : bName.localeCompare(aName);
      } else if (sortBy === 'price') {
        const aPrice = a.lowest_price || 0;
        const bPrice = b.lowest_price || 0;
        return sortOrder === 'asc' ? aPrice - bPrice : bPrice - aPrice;
      }
      return 0;
    },
  );

  // Helper function to safely parse facilities
  const parseFacilities = (facility: string): string[] => {
    try {
      if (typeof facility === 'string' && facility.includes(',')) {
        return facility.split(',').map((item) => item.trim());
      } else if (typeof facility === 'string') {
        return [facility.trim()];
      }
      return [];
    } catch (error) {
      console.error('Error parsing facilities:', error);
      return [];
    }
  };

  // Helper function to safely display facilities with proper typing
  const displayFacilities = (property: Property): string => {
    // Check if facilities is a string - in API response it comes as a string
    if (typeof property.facilities === 'string') {
      return parseFacilities(property.facilities).join(', ');
    }

    // Handle the case where facilities is an array of objects
    if (Array.isArray(property.facilities) && property.facilities.length > 0) {
      return property.facilities
        .map((f: any) => {
          // Handle both string and object formats
          if (typeof f === 'string') return f;
          return f.name || '';
        })
        .filter(Boolean)
        .join(', ');
    }

    // Handle property_having_facilities as backup
    if (
      property.property_having_facilities &&
      Array.isArray(property.property_having_facilities) &&
      property.property_having_facilities.length > 0
    ) {
      return property.property_having_facilities
        .map(
          (f: { property_facility?: { property_facility_name?: string } }) =>
            f.property_facility?.property_facility_name,
        )
        .filter(Boolean)
        .join(', ');
    }

    return 'Information not available';
  };

  // Helper function to safely display location
  const displayLocation = (property: Property): string => {
    const city = property.city || '';
    const province = property.province || '';

    if (city && province) {
      return `${city}, ${province}`;
    } else if (city) {
      return city;
    } else if (province) {
      return province;
    }

    return 'Location not specified';
  };

  // Helper function to get image source from base64 string with proper URL decoding
  const getImageSrc = (photo: string | null | undefined): string => {
    if (!photo) {
      return '/no_image.png';
    }

    // Check if it's already a complete data URL or a path
    if (
      photo.startsWith('data:image') ||
      photo.startsWith('/') ||
      photo.startsWith('http')
    ) {
      return photo;
    }

    try {
      // First URL decode the string (if it's URL encoded)
      const urlDecoded = decodeURIComponent(photo);

      // Check if it's a base64 string (typically starts with /9j/ for JPEGs)
      if (urlDecoded.startsWith('/9j/')) {
        return `data:image/jpeg;base64,${urlDecoded}`;
      }

      // For other base64 encoded images without a specific prefix
      if (/^[A-Za-z0-9+/=]+$/.test(urlDecoded)) {
        return `data:image/jpeg;base64,${urlDecoded}`;
      }

      // If we've reached here and it looks like base64 content with special chars
      // that might have been URL encoded
      return `data:image/jpeg;base64,${urlDecoded}`;
    } catch (error) {
      console.error('Error processing image source:', error);
      return '/no_image.png';
    }
  };

  // Function to handle price display based on selection
  const displayPrice = (property: Property): number => {
    if (priceDisplay === 'highest') {
      return property.highest_price || property.lowest_price || 0;
    } else if (priceDisplay === 'lowest') {
      return property.lowest_price || 0;
    } else if (priceDisplay === 'average') {
      if (property.highest_price && property.lowest_price) {
        return Math.round((property.highest_price + property.lowest_price) / 2);
      }
      return property.lowest_price || 0;
    }
    return property.lowest_price || 0;
  };

  // Helper function to get property code for detail page link
  const getPropertyCode = (property: Property): string => {
    console.log('property:', property);
    return property.property_code || property.id || '';
  };

  return (
    <div className="container mx-auto px-4 md:px-10 mt-14 py-12">
      <div className="flex flex-col md:flex-row gap-6 mt-8">
        <div className="max-w-4xl md:w-64 flex-shrink-0">
          <div className="border border-blue-200 rounded-md p-4">
            <h3 className="text-sm font-medium mb-4">Filter by:</h3>

            <div className="mb-6 mt-8">
              <h4 className="font-medium mb-2">Property type:</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox
                    id="hotels"
                    checked={propertyTypes.hotels}
                    onCheckedChange={(checked) =>
                      handlePropertyTypeChange('hotels', checked === true)
                    }
                  />
                  <Label htmlFor="hotels" className="ml-2 text-sm font-normal">
                    Hotels
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="apartments"
                    checked={propertyTypes.apartments}
                    onCheckedChange={(checked) =>
                      handlePropertyTypeChange('apartments', checked === true)
                    }
                  />
                  <Label
                    htmlFor="apartments"
                    className="ml-2 text-sm font-normal"
                  >
                    Apartments
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="villas"
                    checked={propertyTypes.villas}
                    onCheckedChange={(checked) =>
                      handlePropertyTypeChange('villas', checked === true)
                    }
                  />
                  <Label htmlFor="villas" className="ml-2 text-sm font-normal">
                    Villas
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="cottages"
                    checked={propertyTypes.cottages}
                    onCheckedChange={(checked) =>
                      handlePropertyTypeChange('cottages', checked === true)
                    }
                  />
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
          <div className="flex flex-col mb-6">
            <FormSearch onSubmit={handleSearch} initialValues={searchParams} />
          </div>

          <div className="flex flex-col md:flex-row gap-2 mb-6 ">
            <div className="mt-4 mr-6">
              <h2 className="text-lg font-medium text-sky-500">
                {searchParams.city}
              </h2>
              <p className="text-sm text-gray-500">
                {sortedProperties.length} properties found
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm whitespace-nowrap">sort by:</span>
              <div className="relative z-30 md:mr-6">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] h-8 text-sm">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="w-[180px] z-50">
                    <SelectItem value="name">name of property</SelectItem>
                    <SelectItem value="price">price</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="relative z-30">
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-[120px] h-8 text-sm">
                    <SelectValue placeholder="Order" />
                  </SelectTrigger>
                  <SelectContent className="w-[100px] z-50">
                    <SelectItem value="asc">asc</SelectItem>
                    <SelectItem value="desc">desc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2 md:mt-0 md:mr-6">
              <span className="text-sm whitespace-nowrap">price display:</span>
              <div className="relative z-20">
                <Select value={priceDisplay} onValueChange={setPriceDisplay}>
                  <SelectTrigger className="w-[200px] h-8 text-sm">
                    <SelectValue placeholder="Price display" />
                  </SelectTrigger>
                  <SelectContent className="w-[120px] z-50">
                    <SelectItem value="highest">highest price</SelectItem>
                    <SelectItem value="lowest">lowest price</SelectItem>
                    <SelectItem value="average">average price</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <p>Loading properties...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center py-10">
              <p className="text-red-500">Error: {error}</p>
            </div>
          ) : sortedProperties.length === 0 ? (
            <div className="flex justify-center py-10">
              <p>No properties found for the selected criteria.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedProperties.map((property) => (
                <div
                  key={property.id || property.property_code}
                  className="border rounded-md overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3">
                      <Image
                        src={getImageSrc(property.property_photo)}
                        alt={property.property_name || ''}
                        width={300}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 p-6 flex flex-col md:flex-row justify-between">
                      <div>
                        <h3 className="text-lg font-medium">
                          {property.property_name}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <MapPin size={14} className="mr-1" />
                          <span>{displayLocation(property)}</span>
                        </div>

                        <div>
                          <p className="text-sm font-medium mb-1">
                            Facilities:
                          </p>
                          <p className="text-sm text-gray-600">
                            {displayFacilities(property)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 md:mt-0 flex flex-col items-end justify-between">
                        <div className="text-right">
                          <p className="text-lg font-bold flex justify-end">
                            <span>IDR</span>
                            <span className="ml-2">
                              {displayPrice(property).toLocaleString()}
                            </span>
                          </p>
                        </div>

                        {/* <Link
                          href={`/property-detail/${getPropertyCode(property)}`}
                        >
                          <Button className="bg-sky-400 hover:bg-sky-500 mt-4">
                            Select Property
                          </Button>
                        </Link> */}
                        <Link
                          href={`/property-detail/${getPropertyCode(property)}?check-in=${
                            searchParams['check-in']
                          }&check-out=${
                            searchParams['check-out']
                          }&rooms=${searchParams.rooms}&adults=${searchParams.adults || 2}${
                            searchParams.children
                              ? `&children=${searchParams.children}`
                              : ''
                          }`}
                        >
                          <Button className="bg-sky-400 hover:bg-sky-500 mt-4">
                            Select Property
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {sortedProperties.length > 0 && (
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
                  1
                </Button>
                <Button variant="outline" className="rounded-none border-r-0">
                  2
                </Button>
                <Button
                  variant="outline"
                  className="rounded-r-md rounded-l-none"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
