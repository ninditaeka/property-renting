'use client';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createBookingAsync,
  fetchAvailableRooms,
  selectRoom,
  fetchLowestPriceRoom,
  setBookingDates,
} from '../../../../store/booking.slice';
import type { RootState, AppDispatch } from '../../../../store/index';
import type { BookingFormData } from '../../../../../types/booking.type';
import { formatDateToDDMMYYYY } from '@/service/booking.service';

// Form validation schema
const bookingFormSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  phoneNumber: z.string().min(5, 'Phone number must be at least 5 digits'),
  countryCode: z.string(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

// Function to parse and format date from URL (DD-MM-YYYY format)
const parseUrlDate = (dateStr: string | null): string => {
  if (!dateStr) return '';

  // Validate the date format (expecting DD-MM-YYYY)
  const datePattern = /^(\d{2})-(\d{2})-(\d{4})$/;
  if (datePattern.test(dateStr)) {
    return dateStr; // Already in the correct format
  }

  // If date is invalid, return empty string
  return '';
};

// Format date for display in the UI (from DD-MM-YYYY to readable format)
const formatDisplayDate = (dateStr: string): string => {
  // Convert from DD-MM-YYYY to Date object
  const [day, month, year] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  // Format for display
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export default function BookingPage(): JSX.Element {
  const params = useParams();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const router = useRouter();

  // Get roomTypeCode from URL params
  const roomTypeCode = (params?.roomTypeCode as string) || 'STD'; // Default to 'STD' if not provided

  // Get state from Redux store
  const {
    availableRooms = [],
    selectedRoom,
    lowestPriceRoom,
    totalPrice = 0,
    status = 'idle',
    bookingDates,
    propertyId,
  } = useSelector((state: RootState) => state.booking);

  // Use current date for default check-in and tomorrow for check-out
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Get dates from URL query parameters
  const urlCheckIn = searchParams?.get('check-in');
  const urlCheckOut = searchParams?.get('check-out');

  // Use URL dates if available, otherwise use bookingDates from state or defaults
  const [checkIn, setCheckIn] = useState<string>(
    parseUrlDate(urlCheckIn) ||
      bookingDates?.['check-in'] ||
      formatDateToDDMMYYYY(today),
  );

  const [checkOut, setCheckOut] = useState<string>(
    parseUrlDate(urlCheckOut) ||
      bookingDates?.['check-out'] ||
      formatDateToDDMMYYYY(tomorrow),
  );

  // Track previous status to detect changes
  const [prevStatus, setPrevStatus] = useState<string>(status);

  // Form setup
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      countryCode: '+62',
    },
  });

  // Update booking dates in Redux when local state changes
  useEffect(() => {
    if (checkIn && checkOut) {
      dispatch(setBookingDates({ 'check-in': checkIn, 'check-out': checkOut }));
    }
  }, [dispatch, checkIn, checkOut]);

  // Only track status changes without showing toasts on initial load
  useEffect(() => {
    setPrevStatus(status);
  }, [status]);

  // Room number from selected room
  const roomNumber: string = selectedRoom?.room_number || '';

  // Initialize data on component mount
  useEffect(() => {
    // Fetch available rooms
    dispatch(
      fetchAvailableRooms({
        roomTypeCode,
        checkInDate: checkIn,
        checkOutDate: checkOut,
      }),
    );

    // Fetch lowest price room - this will set the total price in the Redux store
    dispatch(
      fetchLowestPriceRoom({
        roomTypeCode,
        checkInDate: checkIn,
        checkOutDate: checkOut,
      }),
    );
  }, [dispatch, roomTypeCode, checkIn, checkOut]);

  // Use the lowest price room if no room selected
  useEffect(() => {
    if (!selectedRoom && lowestPriceRoom && availableRooms.length > 0) {
      // Find matching room in available rooms
      const matchingRoom = availableRooms.find(
        (room) => room.room_number === lowestPriceRoom.room_number,
      );
      if (matchingRoom) {
        dispatch(selectRoom(matchingRoom));
      } else {
        // If no exact match, use the first available room
        dispatch(selectRoom(availableRooms[0]));
      }
    }
  }, [dispatch, selectedRoom, lowestPriceRoom, availableRooms]);

  // Helper function to get room type name
  const getRoomTypeName = (code: string): string => {
    switch (code) {
      case 'STD':
        return 'Standard Room';
      case 'DLX':
        return 'Deluxe Room';
      case 'SUI':
        return 'Suite';
      case 'FAM':
        return 'Family Room';
      case 'EXE':
        return 'Executive Room';
      default:
        return 'Standard Room';
    }
  };

  // Handle booking submission
  const onSubmit = (values: BookingFormValues): void => {
    if (!roomNumber && !lowestPriceRoom?.room_number) {
      toast({
        variant: 'destructive',
        title: 'Room Selection Required',
        description: 'Please select a room to continue with your booking.',
      });
      return;
    }

    const bookingData: BookingFormData = {
      full_name: values.fullName,
      phone_number: `${values.countryCode}${values.phoneNumber}`,
      property_id:
        propertyId ||
        (selectedRoom?.property_id ? Number(selectedRoom.property_id) : null) ||
        (lowestPriceRoom?.property_id
          ? Number(lowestPriceRoom.property_id)
          : 1),
      room_type_id:
        selectedRoom?.room_type_id ||
        lowestPriceRoom?.room_type_id ||
        Number(roomTypeCode) ||
        1,
      room_number_booking: Number(
        roomNumber || lowestPriceRoom?.room_number || 1,
      ),
      'check-in': checkIn,
      'check-out': checkOut,
      total_price: totalPrice,
    };

    dispatch(createBookingAsync(bookingData))
      .unwrap()
      .then(() => {
        // Show success toast
        toast({
          description:
            'Your room has been successfully booked! Check your email for confirmation details.',
        });

        // Redirect to landing page after successful booking
        setTimeout(() => {
          router.push('/');
        }, 2000);
      })
      .catch((error) => {
        // Show error toast if booking fails
        toast({
          variant: 'destructive',
          title: 'Booking Failed',
          description:
            error || 'An error occurred while processing your booking.',
        });
      });
  };

  // Format price display
  const formatCurrency = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace('Rp', 'IDR ');
  };

  // Get property name from lowest price room or fallback
  const propertyName: string =
    lowestPriceRoom?.property_name || 'The Gaia Hotel';

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6 mt-20">
      <h1 className="text-lg md:text-xl font-bold mb-2">
        Your Accommodation Booking
      </h1>
      <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-6">
        Please ensure all details on this page are correct before proceeding to
        payment.
      </p>
      <div className="space-y-4 md:space-y-6">
        <Card className="overflow-hidden">
          <CardContent className="p-4 md:p-5">
            <h2 className="font-medium text-sm md:text-base mb-3 md:mb-4">
              Enter your details
            </h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3 md:space-y-4"
              >
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5 md:space-y-2">
                      <FormLabel className="text-sm">
                        Full Name (as in Official ID Card)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-9 md:h-10"
                          placeholder="John Doe"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-1.5 md:space-y-2">
                  <FormField
                    control={form.control}
                    name="countryCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Phone Number</FormLabel>
                        <div className="flex">
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="w-[70px] md:w-[80px] rounded-r-none border-r-0 h-9 md:h-10">
                                <SelectValue placeholder="+62" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="+62">+62</SelectItem>
                                <SelectItem value="+1">+1</SelectItem>
                                <SelectItem value="+44">+44</SelectItem>
                                <SelectItem value="+61">+61</SelectItem>
                                <SelectItem value="+49">+49</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                              <FormControl>
                                <Input
                                  {...field}
                                  className="rounded-l-none h-9 md:h-10"
                                  placeholder="490 033"
                                />
                              </FormControl>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="phoneNumber"
                          render={({ field }) => <FormMessage />}
                        />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Hidden form submission button */}
                <div className="hidden">
                  <Button type="submit">Submit Form</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardContent className="p-4 md:p-5">
            <h2 className="font-medium text-sm md:text-base mb-3 md:mb-4">
              Your Booking Details
            </h2>
            <div className="space-y-3 md:space-y-4">
              <div>
                <h3 className="font-medium text-sm md:text-base">
                  {propertyName}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Bandung, Indonesia
                </p>
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium">Room Type</p>
                <div className="text-xs md:text-sm mt-0.5 md:mt-1">
                  {selectedRoom?.room_type_name ||
                    lowestPriceRoom?.room_type_name ||
                    getRoomTypeName(roomTypeCode)}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                <div>
                  <p className="text-xs md:text-sm font-medium">Check-in</p>
                  <div className="flex items-center text-xs md:text-sm mt-0.5 md:mt-1">
                    <span>{formatDisplayDate(checkIn)}</span>
                  </div>
                </div>
                <div className="mt-2 md:mt-0">
                  <p className="text-xs md:text-sm font-medium">Check-out</p>
                  <div className="flex items-center text-xs md:text-sm mt-0.5 md:mt-1">
                    <span>{formatDisplayDate(checkOut)}</span>
                  </div>
                </div>
              </div>
              <Separator className="my-1 md:my-2" />
              <div className="flex justify-between items-center">
                <p className="font-medium text-sm md:text-base">Total Price</p>
                <p className="font-bold text-sm md:text-base">
                  {formatCurrency(totalPrice)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button
            className="bg-sky-400 hover:bg-sky-500 text-white w-full"
            type="button"
            onClick={() => {
              const isValid = form.trigger();

              // Only proceed if form is valid
              isValid.then((valid) => {
                if (valid) {
                  // Trigger form submission
                  form.handleSubmit(onSubmit)();
                } else {
                  // Show error toast if form validation fails
                  toast({
                    variant: 'destructive',
                    title: 'Form Validation Error',
                    description: 'Please check the form fields and try again.',
                  });
                }
              });
            }}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Processing...' : 'Book Now'}
          </Button>
        </div>
      </div>
    </div>
  );
}
