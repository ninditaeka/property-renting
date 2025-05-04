'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandGroup,
} from '@/components/ui/command';
import { DateRange as DayPickerDateRange } from 'react-day-picker';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Check, ChevronsUpDown, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, addDays, parse } from 'date-fns';
import { FormEvent } from 'react';
import { getCities } from '../../../utils/city';
import { useRouter } from 'next/navigation';

type GuestType = 'adults' | 'children' | 'rooms';
type Operation = 'add' | 'subtract';

// Define the search form data interface
interface SearchFormData {
  city: string;
  'check-in': string;
  'check-out': string;
  rooms: number;
  adults?: number;
  children?: number;
}

// Define the FormSearch component props
interface FormSearchProps {
  containerClassName?: string;
  onSubmit?: (formData: SearchFormData) => void;
  initialValues?: SearchFormData;
}

const calendarClassNames = {
  day_selected:
    'bg-sky-500 text-white hover:bg-sky-500 hover:text-white focus:bg-sky-500 focus:text-white',
  day_range_middle: 'bg-sky-100 text-sky-900',
  day_range_end:
    'bg-sky-500 text-white hover:bg-sky-500 hover:text-white focus:bg-sky-500 focus:text-white',
};

const Counter = ({
  label,
  value,
  type,
  onChange,
}: {
  label: string;
  value: number;
  type: GuestType;
  onChange: (type: GuestType, op: Operation) => void;
}) => (
  <div className="flex items-center justify-between">
    <span>{label}</span>
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={() => onChange(type, 'subtract')}
        type="button"
        aria-label={`Decrease ${label}`}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className="w-6 text-center">{value}</span>
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={() => onChange(type, 'add')}
        type="button"
        aria-label={`Increase ${label}`}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  </div>
);

export default function FormSearch({
  containerClassName = 'w-full',
  onSubmit,
  initialValues,
}: FormSearchProps) {
  const router = useRouter();
  const cities = getCities();

  // Convert string dates from initialValues to actual Date objects for the dateRange
  const parseDateString = (dateStr: string): Date => {
    // Try to parse different date formats
    try {
      // Try ISO format first (YYYY-MM-DD)
      if (dateStr.includes('-') && dateStr.split('-')[0].length === 4) {
        return new Date(dateStr);
      }
      // Try DD-MM-YYYY format
      else if (dateStr.includes('-')) {
        return parse(dateStr, 'dd-MM-yyyy', new Date());
      }
      // Default fallback
      return new Date(dateStr);
    } catch (e) {
      console.error('Failed to parse date:', dateStr);
      return new Date();
    }
  };

  // Initialize state with values from initialValues or defaults
  const [city, setCity] = useState<string>(initialValues?.city || '');

  // Initialize dateRange from initialValues
  const [dateRange, setDateRange] = useState<DayPickerDateRange | undefined>(
    () => {
      if (initialValues?.['check-in'] && initialValues?.['check-out']) {
        return {
          from: parseDateString(initialValues['check-in']),
          to: parseDateString(initialValues['check-out']),
        };
      }
      return undefined;
    },
  );

  const [guests, setGuests] = useState({
    adults: initialValues?.adults || 2,
    children: initialValues?.children || 0,
    rooms: initialValues?.rooms || 1,
  });

  const handleGuestChange = (type: GuestType, operation: Operation): void => {
    setGuests((prev) => {
      const newValue = operation === 'add' ? prev[type] + 1 : prev[type] - 1;
      if ((type === 'adults' || type === 'rooms') && newValue < 1) return prev;
      if (newValue < 0) return prev;
      return { ...prev, [type]: newValue };
    });
  };

  const formatDateRange = (): string => {
    if (!dateRange?.from) return 'Select dates';
    if (!dateRange.to) return `${format(dateRange.from, 'MMM dd')} - ?`;
    return `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd')}`;
  };

  const disabledDays = [
    {
      before: addDays(new Date(), 0), // Allow selection from today
    },
  ];

  const formatGuestText = (): string => {
    const parts: string[] = [];
    parts.push(`${guests.adults} ${guests.adults === 1 ? 'adult' : 'adults'}`);
    if (guests.children > 0) {
      parts.push(
        `${guests.children} ${guests.children === 1 ? 'child' : 'children'}`,
      );
    }
    parts.push(`${guests.rooms} ${guests.rooms === 1 ? 'room' : 'rooms'}`);
    return parts.join(', ');
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    // Validation: Check if city is selected
    if (!city) {
      console.warn('Please select a city');
      return;
    }

    // Validation: Check if date range is selected
    if (!dateRange?.from || !dateRange?.to) {
      console.warn('Please select check-in and check-out dates');
      return;
    }

    // Get city name instead of value
    const cityName = cities.find((c) => c.value === city)?.label || city;

    // Format dates using the DD-MM-YYYY format
    const checkInDate = format(dateRange.from, 'dd-MM-yyyy');
    const checkOutDate = format(dateRange.to, 'dd-MM-yyyy');

    // Create URL parameters with aligned format
    const searchParams = new URLSearchParams();
    searchParams.append('city', cityName);
    searchParams.append('check-in', checkInDate);
    searchParams.append('check-out', checkOutDate);
    searchParams.append('rooms', guests.rooms.toString());

    // Optional: Add adults and children if needed
    if (guests.adults) searchParams.append('adults', guests.adults.toString());
    if (guests.children)
      searchParams.append('children', guests.children.toString());

    // Create the URL for redirection - CHANGED THIS LINE
    const frontendUrl = `/property-list?${searchParams.toString()}`;

    console.log('Redirecting to:', frontendUrl);

    router.push(frontendUrl);
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${containerClassName} bg-yellow-400 rounded-lg shadow-sm p-4 relative z-10`}
      >
        <form onSubmit={handleSearch}>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 min-w-[180px]">
              <Label htmlFor="city-select" className="text-xs mb-1 block">
                Destination
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="city-select"
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between h-10"
                    type="button"
                    aria-expanded="false"
                    aria-label="Select destination city"
                  >
                    {city
                      ? cities.find((c) => c.value === city)?.label || city
                      : 'Select city'}
                    <ChevronsUpDown className="ml-2 mt-4 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2  z-50">
                  <Command>
                    <CommandInput
                      placeholder="cities, places to go,"
                      className="focus:ring-0 focus:ring-sky-500 text-gray-500"
                    />
                    <CommandList>
                      <CommandEmpty>
                        No city found. Try another search.
                      </CommandEmpty>
                      <CommandGroup>
                        {cities.map((c) => (
                          <CommandItem
                            key={c.value}
                            value={c.value}
                            onSelect={(value: string) => {
                              setCity(value === city ? '' : value);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                city === c.value ? 'opacity-100' : 'opacity-0',
                              )}
                            />
                            {c.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex-1 min-w-[180px]">
              <Label htmlFor="date-select" className="text-xs mb-1 block">
                Check-in and Check-out Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date-select"
                    variant="outline"
                    className="w-full justify-between h-10 text-left font-normal"
                    type="button"
                    aria-label="Select check-in and check-out dates"
                  >
                    {formatDateRange()}
                    <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range: DayPickerDateRange | undefined) => {
                      setDateRange(range ?? undefined);
                    }}
                    initialFocus
                    numberOfMonths={2}
                    disabled={disabledDays}
                    classNames={calendarClassNames}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex-1 min-w-[180px]">
              <Label htmlFor="guests-select" className="text-xs mb-1 block">
                Guests and Rooms
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="guests-select"
                    variant="outline"
                    className="w-full justify-between h-10 text-left font-normal"
                    type="button"
                    aria-label="Select guests and rooms"
                  >
                    {formatGuestText()}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 z-50">
                  <div className="space-y-3 p-2">
                    <Counter
                      label="Adults"
                      value={guests.adults}
                      type="adults"
                      onChange={handleGuestChange}
                    />
                    <Counter
                      label="Children"
                      value={guests.children}
                      type="children"
                      onChange={handleGuestChange}
                    />
                    <Counter
                      label="Rooms"
                      value={guests.rooms}
                      type="rooms"
                      onChange={handleGuestChange}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-end">
              <Button
                type="submit"
                className="h-10 px-6 bg-sky-500 hover:bg-sky-600"
                aria-label="Search for hotels"
              >
                Search
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
