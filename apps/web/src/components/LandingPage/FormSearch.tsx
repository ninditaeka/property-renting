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
import { format, addDays } from 'date-fns';

type GuestType = 'adults' | 'children' | 'rooms';
type Operation = 'add' | 'subtract';

const cities = [
  { value: 'bandung', label: 'Bandung' },
  { value: 'jakarta', label: 'Jakarta' },
  { value: 'bali', label: 'Bali' },
  { value: 'yogyakarta', label: 'Yogyakarta' },
  { value: 'lombok', label: 'Lombok' },
];

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
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  </div>
);

export default function FormSearch({ containerClassName = 'w-full' }: any) {
  const [city, setCity] = useState('');
  const [dateRange, setDateRange] = useState<DayPickerDateRange | undefined>();
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });

  const handleGuestChange = (type: GuestType, operation: Operation) => {
    setGuests((prev) => {
      const newValue = operation === 'add' ? prev[type] + 1 : prev[type] - 1;
      if ((type === 'adults' || type === 'rooms') && newValue < 1) return prev;
      if (newValue < 0) return prev;
      return { ...prev, [type]: newValue };
    });
  };

  const formatDateRange = () => {
    if (!dateRange?.from) return 'Select dates';
    if (!dateRange.to) return `${format(dateRange.from, 'MMM dd')} - ?`;
    return `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd')}`;
  };

  const disabledDays = [
    {
      before: addDays(new Date(), 2),
    },
  ];

  const formatGuestText = () => {
    const parts = [];
    parts.push(`${guests.adults} ${guests.adults === 1 ? 'adult' : 'adults'}`);
    if (guests.children > 0) {
      parts.push(
        `${guests.children} ${guests.children === 1 ? 'child' : 'children'}`,
      );
    }
    parts.push(`${guests.rooms} ${guests.rooms === 1 ? 'room' : 'rooms'}`);
    return parts.join(', ');
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${containerClassName}  bg-yellow-400 rounded-lg shadow-sm p-4 relative z-10`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log({ city, dateRange, guests });
          }}
        >
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 min-w-[180px]">
              <Label className="text-xs mb-1 block">Destination</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between h-10"
                  >
                    {city
                      ? cities.find((c) => c.value === city)?.label
                      : 'Select city'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 z-50">
                  <Command>
                    <CommandInput placeholder="Search cities..." />
                    <CommandList>
                      <CommandEmpty>No city found.</CommandEmpty>
                      <CommandGroup>
                        {cities.map((c) => (
                          <CommandItem
                            key={c.value}
                            value={c.value}
                            onSelect={(value) =>
                              setCity(value === city ? '' : value)
                            }
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
              <Label className="text-xs mb-1 block">
                Check-in and Check-out Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-10 text-left font-normal"
                  >
                    {formatDateRange()}
                    <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => setDateRange(range ?? undefined)}
                    initialFocus
                    numberOfMonths={2}
                    disabled={disabledDays}
                    classNames={calendarClassNames}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex-1 min-w-[180px]">
              <Label className="text-xs mb-1 block">Guests and Rooms</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-10 text-left font-normal"
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
