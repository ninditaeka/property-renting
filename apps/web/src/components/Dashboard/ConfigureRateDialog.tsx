'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store/index';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// UI Components
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Redux actions
import { fetchProperties, selectAllProperties } from '../../store/tenant.slice';
import { fetchRoomTypesByProperty } from '../../store/roomManagement.slice';
import { fetchRoomNumbersByRoomType } from '../../store/priceManagement.slice';
import { addPriceSeason } from '../../store/priceSeason.slice';
import { RootState } from '../../store/index';
import { CreatePriceSeasonPayload } from '../../../types/priceSeason.type';
import { RoomType } from '../../../types/roomManagement.type';

// Form validation schema
const formSchema = z.object({
  propertyName: z.string().min(1, { message: 'Property is required' }),
  roomType: z.string().min(1, { message: 'Room type is required' }),
  roomNumber: z.string().min(1, { message: 'Room number is required' }),
  saleName: z.string().min(1, { message: 'Sale name is required' }),
  startDate: z.date({
    required_error: 'Start date is required',
  }),
  endDate: z
    .date({
      required_error: 'End date is required',
    })
    .refine((date) => date > new Date(), {
      message: 'End date must be in the future',
    }),
  discountType: z.string().min(1, { message: 'Discount type is required' }),
  discountValue: z.string().min(1, { message: 'Discount value is required' }),
});

type FormValues = z.infer<typeof formSchema>;

interface ConfigurationRateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Define a minimal property interface that matches what's actually available in the state
interface PropertyWithRequiredFields {
  id: string | number;
  property_name: string;
  property_code: string;
}

export function ConfigurationRateDialog({
  open,
  onOpenChange,
}: ConfigurationRateDialogProps) {
  const dispatch = useAppDispatch();

  // Redux state selectors
  const properties = useSelector(
    selectAllProperties,
  ) as PropertyWithRequiredFields[];
  const { roomTypes } = useSelector((state: RootState) => state.roomManagement);
  const { roomNumbers } = useSelector(
    (state: RootState) => state.priceManagement,
  );

  const { status: priceSeasonStatus } = useSelector(
    (state: RootState) => state.priceSeason,
  );

  // Local state
  const [basePrice, setBasePrice] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  const [basePriceValue, setBasePriceValue] = useState(0);
  const [selectedRoomTypePrice, setSelectedRoomTypePrice] = useState<
    number | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form setup with zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyName: '',
      roomType: '',
      roomNumber: '',
      saleName: '',
      discountType: '',
      discountValue: '',
    },
  });

  // Watch form values for calculations
  const watchedPropertyName = form.watch('propertyName');
  const watchedRoomType = form.watch('roomType');
  const watchedRoomNumber = form.watch('roomNumber');
  const watchedDiscountType = form.watch('discountType');
  const watchedDiscountValue = form.watch('discountValue');

  // Fetch properties on component mount
  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  // Fetch room types when property changes
  useEffect(() => {
    if (watchedPropertyName) {
      // Find property code from property name
      const selectedProperty = properties.find(
        (property) =>
          property.property_name.toLowerCase() ===
          watchedPropertyName.toLowerCase(),
      );
      if (selectedProperty?.property_code) {
        dispatch(fetchRoomTypesByProperty(selectedProperty.property_code));
      }

      // Reset dependent fields
      form.setValue('roomType', '');
      form.setValue('roomNumber', '');
      setBasePrice('');
      setFinalPrice('');
      setSelectedRoomTypePrice(null);
    }
  }, [watchedPropertyName, properties, dispatch, form]);

  // Update selectedRoomTypePrice when roomType changes and store the price
  useEffect(() => {
    if (watchedRoomType) {
      // Find the selected room type to get its price
      const selectedRoomType = roomTypes.find(
        (type: RoomType) => type.room_type_code === watchedRoomType,
      );

      if (selectedRoomType?.room_type_price) {
        setSelectedRoomTypePrice(selectedRoomType.room_type_price);
      } else {
        setSelectedRoomTypePrice(null);
      }

      // Fetch room numbers for this room type
      dispatch(fetchRoomNumbersByRoomType(watchedRoomType));

      // Reset dependent fields
      form.setValue('roomNumber', '');
      setBasePrice('');
      setFinalPrice('');
    }
  }, [watchedRoomType, roomTypes, dispatch, form]);

  // Set base price when room number is selected
  useEffect(() => {
    if (selectedRoomTypePrice && watchedRoomNumber) {
      setBasePriceValue(selectedRoomTypePrice);
      setBasePrice(`IDR ${selectedRoomTypePrice.toLocaleString('id-ID')}`);
    } else {
      setBasePrice('');
      setBasePriceValue(0);
    }
  }, [selectedRoomTypePrice, watchedRoomNumber]);

  // Calculate final price based on discount
  useEffect(() => {
    if (basePriceValue > 0 && watchedDiscountType && watchedDiscountValue) {
      let calculatedPrice = basePriceValue;

      if (watchedDiscountType === 'percentage') {
        const percentageValue = parseFloat(
          watchedDiscountValue.replace(/[^0-9.]/g, ''),
        );
        if (!isNaN(percentageValue)) {
          calculatedPrice =
            basePriceValue - (basePriceValue * percentageValue) / 100;
        }
      } else if (watchedDiscountType === 'nominal') {
        const nominalValue = parseFloat(
          watchedDiscountValue.replace(/[^0-9]/g, ''),
        );
        if (!isNaN(nominalValue)) {
          calculatedPrice = basePriceValue - nominalValue;
        }
      }

      setFinalPrice(`IDR ${calculatedPrice.toLocaleString('id-ID')}`);
    } else {
      setFinalPrice('');
    }
  }, [basePriceValue, watchedDiscountType, watchedDiscountValue]);

  // Handle successful form submission
  useEffect(() => {
    if (priceSeasonStatus === 'succeeded' && isSubmitting) {
      // Reset form
      form.reset();
      setBasePrice('');
      setFinalPrice('');
      setSelectedRoomTypePrice(null);
      setIsSubmitting(false);

      // Close dialog
      onOpenChange(false);
    }
  }, [priceSeasonStatus, form, onOpenChange, isSubmitting]);

  const onSubmit = (data: FormValues) => {
    // Calculate final price value for submission
    const finalPriceValue = parseFloat(finalPrice.replace(/[^0-9]/g, ''));

    // Find property code from property name
    const selectedProperty = properties.find(
      (property) =>
        property.property_name.toLowerCase() ===
        data.propertyName.toLowerCase(),
    );

    if (!selectedProperty) {
      return;
    }

    // Find room number ID from room number
    const selectedRoom = roomNumbers.data.find(
      (room) => room.room_number === data.roomNumber,
    );

    if (!selectedRoom) {
      // You might want to show an error message here
      return;
    }

    const payload: CreatePriceSeasonPayload = {
      property_id: properties.find(
        (property) => property.property_code === selectedProperty.property_code,
      )?.id,
      room_numbers_id: roomNumbers.data.find(
        (roomNumber: any) =>
          roomNumber.room_number_code === selectedRoom.room_number_code,
      )?.id,
      name_of_sale: data.saleName,
      start_date: format(data.startDate, 'yyyy-MM-dd'),
      end_date: format(data.endDate, 'yyyy-MM-dd'),
      discount_type: data.discountType as 'nominal' | 'percentage',
      discount_amount: parseFloat(data.discountValue.replace(/[^0-9.]/g, '')),
      finall_price: finalPriceValue || basePriceValue,
    };

    // Set submitting state to true
    setIsSubmitting(true);

    // Dispatch action to create price season
    dispatch(addPriceSeason(payload));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="sticky top-0 z-10 bg-background pb-4">
          <DialogTitle>Configuration Rate Form</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2 overflow-y-auto pr-1 max-h-[calc(90vh-10rem)]"
          >
            {/* Property Name */}
            <FormField
              control={form.control}
              name="propertyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Name</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {properties.map((property) => (
                        <SelectItem
                          key={property.property_code}
                          value={property.property_name.toLowerCase()}
                        >
                          {property.property_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Room Type */}
            <FormField
              control={form.control}
              name="roomType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={roomTypes.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roomTypes.map((type: RoomType) => (
                        <SelectItem
                          key={type.room_type_code}
                          value={type.room_type_code}
                        >
                          {type.room_type_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Room Number */}
            <FormField
              control={form.control}
              name="roomNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Number</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={roomNumbers.data.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room number" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roomNumbers.data.map((room: any) => (
                        <SelectItem
                          key={room.room_number_id || room.room_number}
                          value={room.room_number}
                        >
                          {room.room_number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Base Price */}
            <div className="space-y-2">
              <Label htmlFor="basePrice">Base Price</Label>
              <Input
                id="basePrice"
                value={basePrice}
                disabled
                placeholder="Base Price"
              />
            </div>

            {/* Sale Name */}
            <FormField
              control={form.control}
              name="saleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sale Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter sale name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Selector - Start and End Date */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) => date <= new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Discount Type */}
            <FormField
              control={form.control}
              name="discountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select discount type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="nominal">Nominal (IDR)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Discount Value */}
            <FormField
              control={form.control}
              name="discountValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Discount Value{' '}
                    {watchedDiscountType === 'percentage' ? '(%)' : '(IDR)'}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        watchedDiscountType === 'percentage'
                          ? 'Enter percentage'
                          : 'Enter amount'
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Final Price */}
            <div className="space-y-2">
              <Label htmlFor="finalPrice">Final Price</Label>
              <Input
                id="finalPrice"
                value={finalPrice}
                disabled
                placeholder="Final Price"
              />
            </div>

            <DialogFooter className="sticky bottom-0 pt-4 bg-background">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isSubmitting || priceSeasonStatus === 'loading'}
              >
                {isSubmitting || priceSeasonStatus === 'loading'
                  ? 'Saving...'
                  : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
