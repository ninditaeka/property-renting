'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X } from 'lucide-react';
import {
  useSelector as useReduxSelector,
  useDispatch as useReduxDispatch,
} from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/index'; // Update with your store path
import { useRouter } from 'next/navigation'; // Import useRouter for redirection

// Import UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

// Import your actual Redux action creators
import { createRoom } from '@/store/room.slice'; // Replace with your actual path

// Import fetchProperties from tenant.slice instead of getAllProperties from propertyList.slice
import { fetchProperties } from '@/store/tenant.slice';

import {
  fetchRoomTypesByProperty,
  fetchPricesByRoomType,
} from '@/store/roomManagement.slice';

import { fetchRoomFacilities } from '@/store/roomFacility.slice';
import { CreateRoomRequest } from '../../../types/room.type';

// Define typed hooks for Redux - this is the key to fixing the TypeScript errors
const useDispatch = () => useReduxDispatch<AppDispatch>();
const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

// Define form schema with Zod
const roomFormSchema = z.object({
  property_code: z.string().min(1, { message: 'Property is required' }),
  room_type_code: z.string().min(1, { message: 'Room type is required' }),
  room_number: z
    .string()
    .min(1, { message: 'Room number is required' })
    .refine((value) => /^[A-Za-z0-9-]+$/.test(value), {
      message: 'Room number should only contain letters, numbers and hyphens',
    }),
  room_type_price: z.number().optional(),
  facilities: z.array(z.string()).optional(),
  custom_facilities: z.array(z.string()).optional(),
});

type RoomFormValues = z.infer<typeof roomFormSchema>;

export default function RoomManagementFormPage() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const router = useRouter(); // Initialize router for navigation

  // Redux state selectors
  // Update selector to use tenant state for properties
  const properties = useSelector((state) => state.tenant.properties.items);
  const propertiesLoading = useSelector(
    (state) => state.tenant.properties.isLoading,
  );
  const { roomTypes, priceInfo } = useSelector((state) => state.roomManagement);
  const { facilities } = useSelector((state) => state.roomFacilities);
  const { loading, success, error } = useSelector((state) => state.room);

  // Local state
  const [isFacilityDialogOpen, setIsFacilityDialogOpen] = useState(false);
  const [newFacility, setNewFacility] = useState('');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState<string | null>(null);
  const [customFacilities, setCustomFacilities] = useState<string[]>([]);
  const [selectedFacilityIds, setSelectedFacilityIds] = useState<string[]>([]);

  // Initialize the form
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      property_code: '',
      room_type_code: '',
      room_type_price: 0,
      room_number: '',
      facilities: [],
      custom_facilities: [],
    },
  });

  // Get form values
  const { watch, setValue } = form;
  const selectedProperty = watch('property_code');
  const selectedRoomType = watch('room_type_code');

  // Load initial data - Use fetchProperties instead of getAllProperties
  useEffect(() => {
    void dispatch(fetchProperties());
    void dispatch(fetchRoomFacilities());
  }, [dispatch]);

  // Update room types when property changes
  useEffect(() => {
    if (selectedProperty) {
      void dispatch(fetchRoomTypesByProperty(selectedProperty));
      // Reset room type when property changes
      setValue('room_type_code', '');
    }
  }, [selectedProperty, dispatch, setValue]);

  // Update price when room type changes
  useEffect(() => {
    if (selectedRoomType) {
      void dispatch(fetchPricesByRoomType({ roomTypeCode: selectedRoomType }));
    }
  }, [selectedRoomType, dispatch]);

  // Show toast for success or error states and redirect on success
  useEffect(() => {
    if (success) {
      toast({
        title: 'Success',
        description: 'Room created successfully!',
        variant: 'default',
      });

      // Redirect to room management page after successful creation
      router.push('/tenant/room-management');
    }

    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    }
  }, [success, error, toast, router]);

  // Toggle facility selection
  const toggleFacilitySelection = (facilityId: string) => {
    setSelectedFacilityIds((prevSelectedIds) => {
      const newSelectedIds = prevSelectedIds.includes(facilityId)
        ? prevSelectedIds.filter((id) => id !== facilityId)
        : [...prevSelectedIds, facilityId];

      // Update the form value whenever we change the selected facilities
      setValue('facilities', newSelectedIds);
      return newSelectedIds;
    });
  };

  // Handle custom facility addition
  const handleAddFacility = () => {
    if (newFacility.trim()) {
      setCustomFacilities((prev) => [...prev, newFacility.trim()]);

      // Update form values for custom facilities
      const currentCustomFacilities = form.getValues('custom_facilities') || [];
      setValue('custom_facilities', [
        ...currentCustomFacilities,
        newFacility.trim(),
      ]);

      setNewFacility('');
      setIsFacilityDialogOpen(false);
    }
  };

  // Handle facility deletion confirmation
  const confirmDeleteFacility = (facility: string) => {
    setFacilityToDelete(facility);
    setIsDeleteConfirmOpen(true);
  };

  // Handle confirmed facility deletion
  const handleDeleteConfirmed = () => {
    if (!facilityToDelete) return;

    // If it's a custom facility
    if (customFacilities.includes(facilityToDelete)) {
      setCustomFacilities(
        customFacilities.filter((f) => f !== facilityToDelete),
      );

      // Update form values
      const currentCustomFacilities = form.getValues('custom_facilities') || [];
      setValue(
        'custom_facilities',
        currentCustomFacilities.filter((f) => f !== facilityToDelete),
      );
    } else {
      // If it's a standard facility
      setSelectedFacilityIds(
        selectedFacilityIds.filter((id) => id !== facilityToDelete),
      );

      // Update form values
      const currentFacilities = form.getValues('facilities') || [];
      setValue(
        'facilities',
        currentFacilities.filter((f) => f !== facilityToDelete),
      );
    }

    setIsDeleteConfirmOpen(false);
    setFacilityToDelete(null);
  };

  // Form submission handler
  const onSubmit = (data: RoomFormValues) => {
    // Prepare facilities data (combining standard and custom)
    const standardFacilities = data.facilities?.map((id) => Number(id)) || [];

    // Create room request payload
    const roomData: CreateRoomRequest = {
      property_id: properties.find(
        (property) => property.property_code == data.property_code,
      )?.id,
      room_type_id: roomTypes.find(
        (roomtype) => roomtype.room_type_code == data.room_type_code,
      )?.id,
      room_number: data.room_number,
      room_facilities_ids: standardFacilities, // Only sending standard facilities IDs as numbers
    };

    // Dispatch create room action
    void dispatch(createRoom(roomData));
  };

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="container mx-auto py-6">
        <Card className="max-w-3xl mx-auto bg-gray-100">
          <CardHeader>
            <CardTitle>Room Management Form</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Property Selection */}
                <FormField
                  control={form.control}
                  name="property_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Name</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select property" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {properties && properties.length > 0 ? (
                            properties.map((property) => (
                              <SelectItem
                                key={property.property_code}
                                value={property.property_code}
                              >
                                {property.property_name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="loading" disabled>
                              Loading properties...
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Room Type Selection */}
                <FormField
                  control={form.control}
                  name="room_type_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!selectedProperty}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select room type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roomTypes && roomTypes.length > 0 ? (
                            roomTypes.map((roomType) => (
                              <SelectItem
                                key={roomType.room_type_code}
                                value={roomType.room_type_code}
                              >
                                {roomType.room_type_name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="loading" disabled>
                              {selectedProperty
                                ? 'Loading room types...'
                                : 'Select a property first'}
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price Display */}
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="text"
                    value={
                      priceInfo?.basePrice ? `IDR ${priceInfo.basePrice}` : ''
                    }
                    readOnly
                    className="bg-white"
                    placeholder="Price will be shown automatically"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Price is automatically set based on room type
                  </p>
                </div>

                {/* Room Number */}
                <FormField
                  control={form.control}
                  name="room_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter room number"
                          className="bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This will be the identifying number for the room
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Room Facilities */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Room Facilities</Label>
                  </div>

                  {/* Standard Facilities Checkboxes - Using standard HTML checkboxes */}
                  <div className="grid grid-cols-2 gap-3">
                    {facilities && facilities.length > 0 ? (
                      facilities.map((facility) => (
                        <div
                          key={facility.id}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            id={`facility-${facility.id}`}
                            value={facility.id?.toString()}
                            className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                            onChange={() =>
                              toggleFacilitySelection(
                                facility.id?.toString() || '',
                              )
                            }
                            checked={selectedFacilityIds.includes(
                              facility.id?.toString() || '',
                            )}
                          />
                          <Label
                            htmlFor={`facility-${facility.id}`}
                            className="text-sm font-normal"
                          >
                            {facility.room_facility_name}
                          </Label>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 col-span-2">
                        Loading facilities...
                      </p>
                    )}
                  </div>

                  {/* Selected Facilities Display */}
                  {(selectedFacilityIds.length > 0 ||
                    customFacilities.length > 0) && (
                    <div className="mt-2">
                      <Label className="block mb-2">Selected Facilities</Label>
                      <div className="flex flex-wrap gap-2">
                        {/* Standard facilities badges */}
                        {selectedFacilityIds.map((facilityId) => {
                          const facilityName =
                            facilities?.find((f) => String(f.id) === facilityId)
                              ?.room_facility_name || facilityId;
                          return (
                            <Badge
                              key={facilityId}
                              variant="secondary"
                              className="bg-gray-200 text-black flex items-center gap-1 pr-1"
                            >
                              {facilityName}
                              <button
                                onClick={() =>
                                  confirmDeleteFacility(facilityId)
                                }
                                className="ml-1 rounded-full bg-gray-300 hover:bg-gray-400 p-0.5 flex items-center justify-center"
                                aria-label={`Remove ${facilityName}`}
                                type="button"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          );
                        })}

                        {/* Custom facilities badges */}
                        {customFacilities.map((facility) => (
                          <Badge
                            key={facility}
                            variant="secondary"
                            className="bg-gray-200 text-black flex items-center gap-1 pr-1"
                          >
                            {facility}
                            <button
                              onClick={() => confirmDeleteFacility(facility)}
                              className="ml-1 rounded-full bg-gray-300 hover:bg-gray-400 p-0.5 flex items-center justify-center"
                              aria-label={`Remove ${facility}`}
                              type="button"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    className="bg-cyan-500 hover:bg-cyan-900 px-6 py-2 text-base"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Room'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Add Facility Dialog */}
      <Dialog
        open={isFacilityDialogOpen}
        onOpenChange={setIsFacilityDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Facility</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="facilityName">Facility Name</Label>
              <Input
                id="facilityName"
                placeholder="Enter facility name"
                value={newFacility}
                onChange={(e) => setNewFacility(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsFacilityDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddFacility}
              className="bg-cyan-500 hover:bg-cyan-900 text-xs"
            >
              Add Facility
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this facility?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteConfirmOpen(false);
                setFacilityToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirmed}
              className="bg-red-500 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
