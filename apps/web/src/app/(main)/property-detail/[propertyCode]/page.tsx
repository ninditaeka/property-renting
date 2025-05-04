'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FormSearch from '@/components/LandingPage/FormSearch';
import { getPropertyByCode } from '../../../../store/propertyList.slice';
import { getPropertyWithAvailability } from '../../../../store/propertyDetail.slice';
import { AppDispatch, RootState } from '../../../../store/index'; // Adjust this path
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { RoomDetail } from '../../../../../types/propertyDetail.type'; // Import the existing RoomDetail type

// Create an extended interface that includes room_type_code
interface ExtendedRoomDetail extends RoomDetail {
  room_type_code?: string; // Add the optional room_type_code property
  processed_facilities?: string; // Add this for processed facilities
}

// Define booking params interface
interface BookingParams {
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children?: number;
}

// Function to decode URL encoded base64 image
const decodeImage = (encodedImage: string | undefined | null): string => {
  if (!encodedImage) return '/no_image.png';

  try {
    // Step 1: Decode the URL encoding
    const urlDecoded = decodeURIComponent(encodedImage);

    // Step 2: If it's a valid URL or already a data URL, return it
    if (urlDecoded.startsWith('http') || urlDecoded.startsWith('data:image')) {
      return urlDecoded;
    }

    // Step 3: Assume it's base64 and create a data URL
    return `data:image/jpeg;base64,${urlDecoded}`;
  } catch (error) {
    console.error('Error decoding image:', error);
    return '/no_image.png';
  }
};

// Function to format date from YYYY-MM-DD to DD-MM-YYYY
const formatDateForBackend = (dateStr: string): string => {
  if (!dateStr) return '';

  // Check if date is already in DD-MM-YYYY format
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    return dateStr;
  }

  // Handle YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  }

  // Default case - return as is
  return dateStr;
};

export default function PropertyDetail() {
  const { propertyCode } = useParams<{ propertyCode: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  console.log('PropertyDetail rendering with code:', propertyCode);

  const dispatch = useDispatch<AppDispatch>();

  // Get booking parameters from URL
  const [bookingParams, setBookingParams] = useState<BookingParams>(() => {
    return {
      checkIn:
        searchParams.get('check-in') || new Date().toISOString().split('T')[0],
      checkOut:
        searchParams.get('check-out') ||
        new Date(Date.now() + 86400000).toISOString().split('T')[0],
      rooms: parseInt(searchParams.get('rooms') || '1', 10),
      adults: parseInt(searchParams.get('adults') || '2', 10),
      children: searchParams.get('children')
        ? parseInt(searchParams.get('children') || '0', 10)
        : undefined,
    };
  });

  // State for decoded images
  const [propertyImageSrc, setPropertyImageSrc] =
    useState<string>('/no_image.png');

  // State to track the lowest priced room - use the extended interface
  const [lowestPriceRoom, setLowestPriceRoom] =
    useState<ExtendedRoomDetail | null>(null);

  const propertyState = useSelector((state: RootState) => state.propertyList);
  const { property, loading, error } = propertyState;

  const propertyDetailState = useSelector(
    (state: RootState) => state.propertyDetail,
  );
  const { propertyWithAvailability, loading: availabilityLoading } =
    propertyDetailState;

  console.log('Redux state:', { propertyState, propertyDetailState });
  console.log('Booking params:', bookingParams);

  useEffect(() => {
    console.log('useEffect running with propertyCode:', propertyCode);

    if (propertyCode) {
      console.log('Dispatching getPropertyByCode');
      dispatch(getPropertyByCode(propertyCode));

      // Format dates for the backend (DD-MM-YYYY)
      const formattedCheckIn = formatDateForBackend(bookingParams.checkIn);
      const formattedCheckOut = formatDateForBackend(bookingParams.checkOut);

      console.log('Dispatching getPropertyWithAvailability', {
        formattedCheckIn,
        formattedCheckOut,
      });

      dispatch(
        getPropertyWithAvailability({
          propertyCode,
          checkInDate: formattedCheckIn,
          checkOutDate: formattedCheckOut,
        }),
      );
    }
  }, [dispatch, propertyCode, bookingParams.checkIn, bookingParams.checkOut]);

  // Effect to decode property image when property data changes
  useEffect(() => {
    if (property?.property_photo) {
      setPropertyImageSrc(decodeImage(property.property_photo));
    }
  }, [property]);

  // Effect to select one room type's facilities to display
  useEffect(() => {
    if (
      propertyWithAvailability?.room_details &&
      propertyWithAvailability.room_details.length > 0
    ) {
      // Filter room types that have facilities data
      const roomTypesWithFacilities =
        propertyWithAvailability.room_details.filter(
          (room) => room.room_facilities && room.room_facilities.trim() !== '',
        );

      if (roomTypesWithFacilities.length > 0) {
        // Try to select the lowest price room type with facilities
        const roomsByPrice = [...roomTypesWithFacilities].sort(
          (a, b) => a.room_type_price - b.room_type_price,
        );

        // Process the facilities to remove duplicates
        const baseRoom = roomsByPrice[0];
        let processedFacilities = '';

        if (baseRoom && baseRoom.room_facilities) {
          // Split the facilities by commas, clean up whitespace, and remove duplicates
          const facilitiesArray = baseRoom.room_facilities
            .split(',')
            .map((item) => item.trim())
            .filter(
              (item, index, self) => item && self.indexOf(item) === index,
            );

          // Join the unique facilities back into a string
          processedFacilities = facilitiesArray.join(', ');
        }

        // Create a new object with the processed_facilities property explicitly included
        // Cast baseRoom to ExtendedRoomDetail to safely add processed_facilities
        const selectedRoom: ExtendedRoomDetail = {
          ...baseRoom,
          room_type_code: (baseRoom as any).room_type_code, // Get room_type_code if it exists in the API response
          processed_facilities: processedFacilities,
        };

        setLowestPriceRoom(selectedRoom);
      } else {
        // If no room types have facilities data, just set the first room type
        const baseRoom = propertyWithAvailability.room_details[0];

        // Create a new object with the proper type
        const selectedRoom: ExtendedRoomDetail = {
          ...baseRoom,
          room_type_code: (baseRoom as any).room_type_code, // Get room_type_code if it exists in the API response
        };

        setLowestPriceRoom(selectedRoom);
      }
    }
  }, [propertyWithAvailability]);

  // Function to handle booking button click
  const handleBookingClick = (room: ExtendedRoomDetail) => {
    // Use the appropriate property that contains the UUID
    const bookingCode =
      room.room_type_code || propertyCode || room.room_type_code;

    // Build query string with booking parameters
    const queryParams = new URLSearchParams();
    queryParams.set('check-in', bookingParams.checkIn);
    queryParams.set('check-out', bookingParams.checkOut);
    queryParams.set('rooms', bookingParams.rooms.toString());
    queryParams.set('adults', bookingParams.adults.toString());
    if (bookingParams.children !== undefined) {
      queryParams.set('children', bookingParams.children.toString());
    }

    console.log('Redirecting to booking with code:', bookingCode);
    // Pass the booking parameters to the next page
    router.push(`/booking/${bookingCode}?${queryParams.toString()}`);
  };

  console.log('Render state:', {
    loading,
    availabilityLoading,
    error,
    property,
    lowestPriceRoom,
  });

  if (loading || availabilityLoading) {
    return (
      <div className="mt-24 max-w-4xl mx-auto p-4">
        <p className="text-center">Loading property details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-24 max-w-4xl mx-auto p-4">
        <p className="text-center text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="mt-24">
      <div className="max-w-4xl mx-auto mt-10 bg-white">
        {/* Pass booking parameters to FormSearch */}
        <FormSearch
          initialValues={{
            city: property?.city || '',
            'check-in': bookingParams.checkIn,
            'check-out': bookingParams.checkOut,
            rooms: bookingParams.rooms,
            adults: bookingParams.adults,
            children: bookingParams.children,
          }}
        />

        <div className="p-4">
          <h1 className="text-xl font-bold">
            {property?.property_name || 'Loading property...'}
          </h1>
          <div className="flex items-center text-gray-500 mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">
              {property
                ? `${property.city}, ${property.province}`
                : 'Loading location...'}
            </span>
          </div>
        </div>

        <div className="relative w-full h-[300px]">
          <Image
            src={propertyImageSrc}
            alt={property?.property_name || 'Hotel Room'}
            fill
            sizes="100vw"
            className="object-cover rounded-lg"
            priority
            unoptimized={
              propertyImageSrc.startsWith('data:') ? true : undefined
            } // Disable optimization for data URLs
          />
        </div>

        <div className="p-4 border-t mt-4">
          <h2 className="font-semibold text-lg mb-2">Description</h2>
          <div className="border rounded-md p-4 text-sm text-gray-700">
            <p>{property?.description || 'Loading property description...'}</p>
          </div>
        </div>

        <div className="p-4 border-t">
          <h2 className="font-semibold text-lg mb-4">Available Room Types</h2>

          {propertyWithAvailability?.room_details &&
          propertyWithAvailability.room_details.length > 0 ? (
            propertyWithAvailability.room_details.map((room) => (
              <Card
                key={room.room_type_id}
                className="mb-4 border overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-[150px] relative">
                    <Image
                      src={decodeImage(room.room_photo)}
                      alt={room.room_type_name}
                      fill
                      sizes="100vw"
                      className="object-cover"
                      unoptimized={
                        room.room_photo &&
                        decodeImage(room.room_photo).startsWith('data:')
                          ? true
                          : undefined
                      } // Disable optimization for data URLs
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col md:flex-row justify-between">
                    <div>
                      <h3 className="font-semibold">{room.room_type_name}</h3>
                      <p className="text-sm text-gray-600 mt-2">
                        {room.description || 'No description available'}
                      </p>
                      {/* Display facilities only for the lowest price room type */}
                      {lowestPriceRoom &&
                        lowestPriceRoom.room_type_id === room.room_type_id &&
                        lowestPriceRoom.processed_facilities && (
                          <p className="text-xs text-gray-500 mt-1">
                            <span className="font-medium">
                              Room facilities:
                            </span>{' '}
                            {lowestPriceRoom.processed_facilities}
                          </p>
                        )}
                      <p className="text-xs text-gray-500 mt-1">
                        Available rooms: {room.quantity_room}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col items-end justify-between">
                      <div className="text-base font-bold flex justify-end">
                        <span>IDR</span>{' '}
                        <span className="ml-2">
                          {room.room_type_price.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <Button
                        className="mt-2 bg-sky-400 hover:bg-sky-500"
                        disabled={room.quantity_room <= 0}
                        onClick={() =>
                          handleBookingClick(room as ExtendedRoomDetail)
                        }
                      >
                        {room.quantity_room > 0 ? 'Choose' : 'Sold Out'}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-6 border rounded-md">
              <p className="text-gray-500">
                No available rooms for the selected dates
              </p>
            </div>
          )}

          {/* Property availability summary if needed */}
          {propertyWithAvailability?.property_details && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm">
              <p>
                Status:{' '}
                <span className="font-medium">
                  {
                    propertyWithAvailability.property_details
                      .availability_status
                  }
                </span>
              </p>
              <p>
                Available rooms:{' '}
                <span className="font-medium">
                  {propertyWithAvailability.property_details.total_rooms -
                    propertyWithAvailability.property_details.booked_rooms}{' '}
                  of {propertyWithAvailability.property_details.total_rooms}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
