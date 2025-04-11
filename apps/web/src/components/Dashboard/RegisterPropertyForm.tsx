'use client';

import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  fetchPropertyCategories,
  resetSuccess,
} from '@/store/propertyCategory.slice';
import { createProperty, resetPropertyState } from '@/store/propertyList.slice';
import { fetchPropertyFacilities } from '../../store/propertyfacility.slice';
import {
  PreparedRoom,
  CreatePropertyRequest,
  Room,
} from '../../../types/propertyList.type';
import { RootState, AppDispatch } from '@/store';

// Define the validation schema
const roomSchema = z.object({
  name: z.string().min(1, 'Room type name is required'),
  description: z.string().optional(),
  price: z
    .string()
    .min(1, 'Room price is required')
    .refine((val) => parseFloat(val) >= 0, {
      message: 'Price cannot be negative',
    }),
  quantity: z
    .string()
    .min(1, 'Room quantity is required')
    .refine((val) => parseInt(val) >= 1, {
      message: 'Quantity must be at least 1',
    }),
  photo: z.instanceof(File).optional(), // Room photo
});

const propertySchema = z.object({
  name: z.string().min(1, 'Property name is required'),
  category: z.string().min(1, 'Property category is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  province: z.string().min(1, 'Province is required'),
  photo: z.instanceof(File).optional(), // Property photo
  facilities: z.array(z.string()).optional(),
  description: z.string().optional(),
  rooms: z.array(roomSchema).optional(),
});

type ItemToDelete = {
  type: 'facility' | 'room';
  index: number;
  name: string;
} | null;

// Function to convert file to base64
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default function RegisterPropertyFormPage() {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter(); // For redirection after form submission

  // Get property categories from Redux store
  const { propertyCategories, loading: categoriesLoading } = useSelector(
    (state: RootState) => state.propertyCategories,
  );

  // Get property facilities from Redux store
  // Get only the facilities array from the state
  const propertyFacilitiesState = useSelector(
    (state: RootState) => state.propertyFacilities,
  );

  // Access facilities directly
  const facilities = propertyFacilitiesState.facilities;

  // For loading state, use a local state instead
  const [facilitiesLoading, setFacilitiesLoading] = useState(false);

  // Get property slice state for submission status
  const {
    loading: propertyLoading,
    success,
    error,
  } = useSelector((state: RootState) => state.propertyList);

  const [selectedFacilityIds, setSelectedFacilityIds] = useState<string[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  const [newFacility, setNewFacility] = useState<string>('');
  const [isFacilityDialogOpen, setIsFacilityDialogOpen] =
    useState<boolean>(false);
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState<boolean>(false);
  const [newRoom, setNewRoom] = useState<Room>({
    name: '',
    description: '',
    price: '',
    quantity: '',
  });

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<ItemToDelete>(null);

  // State for base64 encoded images
  const [propertyImageBase64, setPropertyImageBase64] = useState<string | null>(
    null,
  );
  const [roomImageBase64, setRoomImageBase64] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      facilities: [],
      rooms: [],
    },
  });

  // Fetch property categories and facilities on component mount
  useEffect(() => {
    dispatch(fetchPropertyCategories());

    // Set loading state manually
    setFacilitiesLoading(true);
    dispatch(fetchPropertyFacilities())
      .then(() => {
        setFacilitiesLoading(false);
      })
      .catch(() => {
        setFacilitiesLoading(false);
      });
  }, [dispatch]);

  // Check for successful property creation and redirect
  useEffect(() => {
    if (success) {
      toast({
        title: 'Success',
        description: 'Property registration submitted successfully',
      });

      // Reset success state to prevent repeated redirects
      dispatch(resetPropertyState());

      // Redirect to dashboard/tenant
      router.push('/tenant');
    }

    if (error) {
      toast({
        title: 'Error',
        description:
          error || 'Failed to submit property data. Please try again.',
        variant: 'destructive',
      });

      // Reset error state
      dispatch(resetPropertyState());
    }
  }, [success, error, dispatch, toast, router]);

  const handleAddFacility = () => {
    if (newFacility.trim()) {
      setSelectedFacilityIds([...selectedFacilityIds, newFacility.trim()]);
      setNewFacility('');
      setIsFacilityDialogOpen(false);
    }
  };

  const handleAddRoom = () => {
    if (
      newRoom.name.trim() &&
      parseFloat(newRoom.price) >= 0 &&
      parseInt(newRoom.quantity) >= 1
    ) {
      setRooms([...rooms, { ...newRoom }]);
      setNewRoom({
        name: '',
        description: '',
        price: '',
        quantity: '',
      });
      setRoomImageBase64(null); // Reset room image preview
      setIsRoomDialogOpen(false);
    } else {
      toast({
        title: 'Validation Error',
        description:
          'Please check all required fields. Price must be non-negative and quantity must be at least 1.',
        variant: 'destructive',
      });
    }
  };

  const confirmDelete = (
    type: 'facility' | 'room',
    index: number,
    name: string,
  ) => {
    setItemToDelete({ type, index, name });
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmed = () => {
    if (!itemToDelete) return;

    const { type, index } = itemToDelete;

    if (type === 'facility') {
      const updatedFacilities = [...selectedFacilityIds];
      updatedFacilities.splice(index, 1);
      setSelectedFacilityIds(updatedFacilities);
    } else if (type === 'room') {
      const updatedRooms = [...rooms];
      updatedRooms.splice(index, 1);
      setRooms(updatedRooms);
    }

    setIsDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  const onSubmit = async (data: z.infer<typeof propertySchema>) => {
    try {
      // Add facilities to form data
      data.facilities = selectedFacilityIds;

      // Add rooms to form data
      data.rooms = rooms;

      // Prepare room data with base64 encoded photos
      const preparedRooms: PreparedRoom[] = await Promise.all(
        rooms.map(async (room) => {
          const preparedRoom: PreparedRoom = {
            name: room.name,
            description: room.description,
            price: room.price,
            quantity: room.quantity,
          };

          if (room.photo) {
            try {
              const base64 = await convertToBase64(room.photo);
              const fileImage = base64.split(',')[1];
              preparedRoom.photoBase64 = fileImage;
            } catch (error) {
              console.error('Error converting room photo to base64:', error);
            }
          }
          return preparedRoom;
        }),
      );

      const propertyData: CreatePropertyRequest = {
        property_name: data.name,
        province: data.province,
        city: data.city,
        address: data.address,
        description: data.description || '',
        property_photo: propertyImageBase64 || '',
        property_category_id: Number(data.category),
        property_facility_ids: selectedFacilityIds.map((id) => Number(id)),
        room_types: await Promise.all(
          preparedRooms.map(async (room) => ({
            room_type_name: room.name,
            description: room.description ?? '',
            room_type_price: Number(room.price),
            quantity_room: Number(room.quantity),
            room_photo: room.photo ? await convertToBase64(room.photo) : '',
          })),
        ),
      };

      // Dispatch the createProperty action
      dispatch(createProperty(propertyData));
    } catch (error) {
      console.error('Error preparing property data:', error);
      toast({
        title: 'Error',
        description: 'Failed to prepare property data. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Handler for property photo upload
  const handlePropertyPhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        toast({
          title: 'Failed to upload',
          description: 'File size must be 2MB or less',
          variant: 'destructive',
        });
        return;
      }

      try {
        const base64 = await convertToBase64(file);
        const fileImage = base64.split(',')[1];
        setPropertyImageBase64(fileImage);
        setValue('photo', file);
      } catch (error) {
        console.error('Error converting file to base64:', error);
        toast({
          title: 'Error',
          description: 'Failed to process the image',
          variant: 'destructive',
        });
      }
    }
  };

  // Handler for room photo upload
  const handleRoomPhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        toast({
          title: 'Error',
          description: 'File size must be 2MB or less',
          variant: 'destructive',
        });
        return;
      }

      try {
        const base64 = await convertToBase64(file);
        const fileImage = base64.split(',')[1];
        setRoomImageBase64(fileImage);
        setNewRoom({ ...newRoom, photo: file });
      } catch (error) {
        console.error('Error converting file to base64:', error);
        toast({
          title: 'Error',
          description: 'Failed to process the image',
          variant: 'destructive',
        });
      }
    }
  };

  const toggleFacilitySelection = (facilityId: string) => {
    setSelectedFacilityIds((prev) => {
      if (prev.includes(facilityId)) {
        return prev.filter((id) => id !== facilityId);
      } else {
        return [...prev, facilityId];
      }
    });
  };

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="container mx-auto py-6">
        <Card className="max-w-3xl mx-auto bg-gray-100">
          <CardHeader>
            <CardTitle>Property Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="propertyName">Property Name</Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input id="propertyName" className="bg-white" {...field} />
                  )}
                />
                {errors.name && (
                  <p className="text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertyCategory">Property Category</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="propertyCategory" className="bg-white">
                        <SelectValue
                          placeholder={
                            categoriesLoading
                              ? 'Loading categories...'
                              : 'Select property category'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyCategories &&
                          propertyCategories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id?.toString() || ''}
                            >
                              {category.property_category_name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-red-500">{errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <Input id="address" className="bg-white" {...field} />
                  )}
                />
                {errors.address && (
                  <p className="text-red-500">{errors.address.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <Input id="city" className="bg-white" {...field} />
                  )}
                />
                {errors.city && (
                  <p className="text-red-500">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="province">Province</Label>
                <Controller
                  name="province"
                  control={control}
                  render={({ field }) => (
                    <Input id="province" className="bg-white" {...field} />
                  )}
                />
                {errors.province && (
                  <p className="text-red-500">{errors.province.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Photo of Property</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    id="photo"
                    className="hidden"
                    onChange={handlePropertyPhotoUpload}
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="photo"
                      className="flex items-center justify-between cursor-pointer bg-white border rounded-md px-3 py-2"
                    >
                      <span className="text-gray-500">
                        {propertyImageBase64
                          ? 'File selected'
                          : 'Choose file...'}
                      </span>
                      <Button
                        size="sm"
                        className="bg-cyan-500 hover:bg-cyan-900 text-xs"
                      >
                        Upload
                      </Button>
                    </Label>
                  </div>
                </div>
                {errors.photo && (
                  <p className="text-red-500">{errors.photo.message}</p>
                )}
                {propertyImageBase64 && (
                  <p className="text-green-600 text-sm">
                    Image uploaded successfully
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <Label>Property Facilities</Label>
                {facilitiesLoading ? (
                  <p>Loading facilities...</p>
                ) : (
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
                            {facility.property_facility_name}
                          </Label>
                        </div>
                      ))
                    ) : (
                      <p>No facilities available</p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      id="description"
                      className="bg-white"
                      {...field}
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Room Type</Label>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="flex items-center mt-4 gap-1 bg-cyan-500 hover:bg-cyan-900 text-white text-xs"
                    onClick={() => {
                      dispatch(resetPropertyState());
                      setIsRoomDialogOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4" /> New Room Type
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 items-center mt-2">
                  {rooms.map((room, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-gray-200 text-black flex items-center gap-1 pr-1"
                    >
                      {room.name} (IDR {room.price})
                      <button
                        type="button"
                        onClick={() => confirmDelete('room', index, room.name)}
                        className="ml-1 rounded-full bg-gray-300 hover:bg-gray-400 p-0.5 flex items-center justify-center"
                        aria-label={`Remove ${room.name}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="max-w-3xl mx-auto mt-6 flex justify-end">
                <Button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-900 px-6 py-2 text-base"
                  disabled={propertyLoading}
                >
                  {propertyLoading ? 'Registering...' : 'Register Property'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Add Facility Dialog */}
        <Dialog
          open={isFacilityDialogOpen}
          onOpenChange={setIsFacilityDialogOpen}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Property Facility</DialogTitle>
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

        {/* Add Room Dialog */}
        <Dialog open={isRoomDialogOpen} onOpenChange={setIsRoomDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Room Type</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="roomName">Room Type Name</Label>
                <Input
                  id="roomName"
                  placeholder="Enter room type name"
                  value={newRoom.name}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomDescription">Description</Label>
                <Textarea
                  id="roomDescription"
                  placeholder="Enter room description"
                  value={newRoom.description}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, description: e.target.value })
                  }
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomPrice">Room Type Price (IDR)</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">IDR</span>
                  </div>
                  <Input
                    id="roomPrice"
                    placeholder="Enter price"
                    value={newRoom.price}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, price: e.target.value })
                    }
                    type="number"
                    min="0"
                    step="1000"
                    className="pl-12"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomQuantity">Quantity</Label>
                <Input
                  id="roomQuantity"
                  placeholder="Enter quantity"
                  value={newRoom.quantity}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, quantity: e.target.value })
                  }
                  type="number"
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label>Room Photo</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    id="roomPhoto"
                    className="hidden"
                    onChange={handleRoomPhotoUpload}
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="roomPhoto"
                      className="flex items-center justify-between cursor-pointer bg-white border rounded-md px-3 py-2"
                    >
                      <span className="text-gray-500">
                        {roomImageBase64 ? 'File selected' : 'Choose file...'}
                      </span>
                      <Button
                        size="sm"
                        className="bg-cyan-500 hover:bg-cyan-900 text-xs"
                      >
                        Upload
                      </Button>
                    </Label>
                  </div>
                </div>
                {roomImageBase64 && (
                  <p className="text-green-600 text-sm">
                    Image uploaded successfully
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsRoomDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddRoom}
                className="bg-cyan-500 hover:bg-cyan-900 text-xs"
              >
                Add Room Type
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={isDeleteConfirmOpen}
          onOpenChange={setIsDeleteConfirmOpen}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{itemToDelete?.name}"?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setItemToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirmed}
                className="bg-red-500 hover:bg-red-700 text-xs"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
