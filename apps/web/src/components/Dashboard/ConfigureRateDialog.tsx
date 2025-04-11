'use client';

import { useState, useEffect } from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface ConfigurationRateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConfigurationRateDialog({
  open,
  onOpenChange,
}: ConfigurationRateDialogProps) {
  // Form state
  const [propertyName, setPropertyName] = useState('');
  const [saleName, setSaleName] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [roomType, setRoomType] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [discountType, setDiscountType] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [finalPrice, setFinalPrice] = useState('');

  // Sample data for dropdowns - replace with your actual data
  const properties = ['Property A', 'Property B', 'Property C'];
  const roomTypes = ['Deluxe', 'Superior', 'Standart', 'Two Rooms'];
  const roomNumbers = ['101', '102', '103', '201', '202', '203'];

  // Set base price when room type and room number are selected (simulating database fetch)
  useEffect(() => {
    if (roomType && roomNumber) {
      // Simulate fetching price from database based on room type and number
      const fetchedPrice = getRoomBasePrice(roomType, roomNumber);
      setBasePrice(`Rp ${fetchedPrice.toLocaleString('id-ID')}`);
    } else {
      setBasePrice('');
    }
  }, [roomType, roomNumber]);

  // Add this function to simulate database price lookup
  const getRoomBasePrice = (type: string, number: string) => {
    // This would be replaced with an actual database query
    const priceMap: Record<string, Record<string, number>> = {
      deluxe: { '101': 1500000, '102': 1600000, '103': 1550000 },
      superior: { '201': 2000000, '202': 2100000, '203': 2050000 },
      standart: { '101': 1000000, '102': 1100000, '103': 1050000 },
      'two rooms': { '201': 2500000, '202': 2600000, '203': 2550000 },
    };

    return priceMap[type]?.[number] || 1000000; // Default fallback price
  };

  // Calculate final price when basePrice, discountType, or discountValue changes
  useEffect(() => {
    if (basePrice) {
      const basePriceValue = Number.parseFloat(
        basePrice.replace(/[^0-9]/g, ''),
      );

      if (!isNaN(basePriceValue)) {
        let calculatedPrice = basePriceValue;

        if (discountType === 'percentage' && discountValue) {
          const percentageValue = Number.parseFloat(
            discountValue.replace(/[^0-9.]/g, ''),
          );
          if (!isNaN(percentageValue)) {
            calculatedPrice =
              basePriceValue - (basePriceValue * percentageValue) / 100;
          }
        } else if (discountType === 'nominal' && discountValue) {
          const nominalValue = Number.parseFloat(
            discountValue.replace(/[^0-9]/g, ''),
          );
          if (!isNaN(nominalValue)) {
            calculatedPrice = basePriceValue - nominalValue;
          }
        }

        // Format as Indonesian Rupiah
        setFinalPrice(`Rp ${calculatedPrice.toLocaleString('id-ID')}`);
      } else {
        setFinalPrice('');
      }
    } else {
      setFinalPrice('');
    }
  }, [basePrice, discountType, discountValue]);

  const handleActivateRate = () => {
    console.log({
      propertyName,
      saleName,
      startDate,
      endDate,
      roomType,
      roomNumber,
      basePrice,
      discountType,
      discountValue,
      finalPrice,
    });

    // Reset form
    setPropertyName('');
    setSaleName('');
    setStartDate(undefined);
    setEndDate(undefined);
    setRoomType('');
    setRoomNumber('');
    setBasePrice('');
    setDiscountType('');
    setDiscountValue('');
    setFinalPrice('');

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="sticky top-0 z-10 bg-background pb-4">
          <DialogTitle>Configuration Rate Form</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 overflow-y-auto pr-1 max-h-[calc(90vh-10rem)]">
          {/* Property Name */}
          <div className="space-y-2">
            <Label htmlFor="propertyName">Property Name</Label>
            <Select value={propertyName} onValueChange={setPropertyName}>
              <SelectTrigger id="propertyName">
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property} value={property.toLowerCase()}>
                    {property}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Room Type */}
          <div className="space-y-2">
            <Label htmlFor="roomType">Room Type</Label>
            <Select value={roomType} onValueChange={setRoomType}>
              <SelectTrigger id="roomType">
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent>
                {roomTypes.map((type) => (
                  <SelectItem key={type} value={type.toLowerCase()}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Room Number */}
          <div className="space-y-2">
            <Label htmlFor="roomNumber">Room Number</Label>
            <Select value={roomNumber} onValueChange={setRoomNumber}>
              <SelectTrigger id="roomNumber">
                <SelectValue placeholder="Select room number" />
              </SelectTrigger>
              <SelectContent>
                {roomNumbers.map((number) => (
                  <SelectItem key={number} value={number}>
                    {number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Base Price */}
          <div className="space-y-2">
            <Label htmlFor="basePrice">Base Price</Label>
            <Input
              id="basePrice"
              value={basePrice}
              readOnly
              className="bg-muted"
            />
          </div>

          {/* Name of Sale */}
          <div className="space-y-2">
            <Label htmlFor="saleName">Name of Sale</Label>
            <Input
              id="saleName"
              placeholder="Enter sale name"
              value={saleName}
              onChange={(e) => setSaleName(e.target.value)}
            />
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !startDate && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !endDate && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Discount Type */}
          <div className="space-y-2">
            <Label htmlFor="discountType">Discount Type</Label>
            <Select value={discountType} onValueChange={setDiscountType}>
              <SelectTrigger id="discountType">
                <SelectValue placeholder="Select discount type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nominal">Nominal</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Discount Value */}
          <div className="space-y-2">
            <Label htmlFor="discountValue">
              {discountType === 'percentage'
                ? 'Discount Percentage (%)'
                : 'Discount Amount'}
            </Label>
            <Input
              id="discountValue"
              placeholder={
                discountType === 'percentage' ? 'e.g., 15%' : 'e.g., Rp 100.000'
              }
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
            />
          </div>

          {/* Final Price */}
          <div className="space-y-2">
            <Label htmlFor="finalPrice">Final Price</Label>
            <Input
              id="finalPrice"
              placeholder="Final price after discount"
              value={finalPrice}
              readOnly
              className="bg-muted"
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-end sticky bottom-0 z-10 bg-background pt-4 pb-2">
          <DialogClose asChild>
            <Button variant="outline" className="mr-2">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-900"
            onClick={handleActivateRate}
          >
            Activate Rate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
