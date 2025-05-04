'use client';

import type React from 'react';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Plus, X, Upload, ImageIcon } from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Redux actions
import {
  getPropertyByCode,
  updateProperty,
} from '../../store/propertyList.slice';

import {
  getPropertyWithRoomTypes,
  getPropertyWithFacilities,
} from '../../store/propertyDetail.slice';

import { fetchPropertyFacilities } from '../../store/propertyfacility.slice';
import { fetchPropertyCategories } from '../../store/propertyCategory.slice';
import type { AppDispatch, RootState } from '../../store';
import type {
  RoomType,
  CreatePropertyRequest,
  PropertyHavingFacility,
} from '../../../types/propertyList.type';
import { PropertyFacility } from '../../../types/propertyFacility.type';

// Form schema validation
const propertyFormSchema = z.object({
  propertyName: z.string().min(3, {
    message: 'Property name must be at least 3 characters.',
  }),
  propertyCategory: z.any().optional(),
  address: z.string().min(5, {
    message: 'Address must be at least 5 characters.',
  }),
  city: z.string().min(2, {
    message: 'City is required.',
  }),
  province: z.string().min(2, {
    message: 'Province is required.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

export default function ViewDetailPropertyFormPage() {
  const router = useRouter();
  const params = useParams();
  const propertyCode = Array.isArray(params.propertyCode)
    ? params.propertyCode[0]
    : (params.propertyCode as string);
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  // Redux selectors
  const {
    property,
    loading: propertyLoading,
    error: propertyError,
  } = useSelector((state: RootState) => state.propertyList);

  // Access room types from propertyDetail state
  const { property: propertyDetail, loading: propertyDetailLoading } =
    useSelector((state: RootState) => state.propertyDetail);

  // Extract room types and facilities from property detail
  const roomTypes = propertyDetail?.room_types || [];
  const propertyFacilities = propertyDetail?.facilities || [];

  // Update your selector to match your state structure
  const { propertyCategories, loading: categoriesLoading } = useSelector(
    (state: RootState) => ({
      propertyCategories: state.propertyCategories.propertyCategories || [],
      loading: state.propertyCategories.loading,
    }),
  );

  const { availableFacilities, loading: availableFacilitiesLoading } =
    useSelector((state: RootState) => ({
      availableFacilities: state.propertyFacilities.facilities,
      loading: state.propertyFacilities.status === 'loading',
    }));

  // Local state
  const [facilities, setFacilities] = useState<string[]>([]);
  const [rooms, setRooms] = useState<
    Array<{
      name: string;
      description: string;
      price: string;
      quantity: string;
      id?: string;
      photo?: string | null;
    }>
  >([]);

  const [newFacility, setNewFacility] = useState('');
  const [isFacilityDialogOpen, setIsFacilityDialogOpen] = useState(false);
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [newRoom, setNewRoom] = useState<{
    name: string;
    description: string;
    price: string;
    quantity: string;
    photo?: string | null;
  }>({
    name: '',
    description: '',
    price: '',
    quantity: '',
    photo: null,
  });

  // Property photo state
  const [propertyPhoto, setPropertyPhoto] = useState<string | null>(null);
  const [propertyPhotoPreview, setPropertyPhotoPreview] = useState<
    string | null
  >(null);
  const [newRoomPhoto, setNewRoomPhoto] = useState<string | null>(null);
  const [newRoomPhotoPreview, setNewRoomPhotoPreview] = useState<string | null>(
    null,
  );

  // Delete confirmation dialog states
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: 'facility' | 'room';
    index: number;
    name: string;
  } | null>(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaveConfirmOpen, setIsSaveConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize form with react-hook-form and zod validation
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      propertyName: '',
      propertyCategory: null,
      address: '',
      city: '',
      province: '',
      description: '',
    },
  });

  // Helper function to convert base64 to displayable image source
  const getImageSrc = (base64String: string | null) => {
    if (!base64String) return null;

    // Check if it's already a complete data URL
    if (base64String.startsWith('data:image')) {
      return base64String;
    }

    // If it starts with /9j/, it's likely a JPEG without the data URL prefix
    if (base64String.startsWith('/9j/')) {
      return `data:image/jpeg;base64,${base64String}`;
    }

    // For other formats, assume JPEG if we can't determine
    return `data:image/jpeg;base64,${base64String}`;
  };

  // Handle file input change for property photo
  const handlePropertyPhotoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const result = reader.result as string;
        // Save the full data URL for preview
        setPropertyPhotoPreview(result);
        // Save just the base64 part for submission
        const base64String = result.split(',')[1];
        setPropertyPhoto(base64String);

        toast({
          title: 'Photo uploaded',
          description: 'Property photo has been uploaded successfully',
        });
      };

      reader.readAsDataURL(file);
    }
  };

  // Handle file input change for room photo
  const handleRoomPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const result = reader.result as string;
        // Save the full data URL for preview
        setNewRoomPhotoPreview(result);
        // Save just the base64 part for submission
        const base64String = result.split(',')[1];
        setNewRoomPhoto(base64String);
        setNewRoom({ ...newRoom, photo: base64String });

        toast({
          title: 'Photo uploaded',
          description: 'Room photo has been uploaded successfully',
        });
      };

      reader.readAsDataURL(file);
    }
  };

  // Remove property photo
  const handleRemovePropertyPhoto = () => {
    setPropertyPhoto(null);
    setPropertyPhotoPreview(null);

    toast({
      title: 'Photo removed',
      description: 'Property photo has been removed',
    });
  };

  // Remove room photo
  const handleRemoveRoomPhoto = () => {
    setNewRoomPhoto(null);
    setNewRoomPhotoPreview(null);
    setNewRoom({ ...newRoom, photo: null });

    toast({
      title: 'Photo removed',
      description: 'Room photo has been removed',
    });
  };

  // Fetch property data on component mount
  useEffect(() => {
    if (propertyCode) {
      // First fetch property categories for dropdown
      dispatch(fetchPropertyCategories())
        .unwrap()
        .catch((error) => {
          toast({
            title: 'Error',
            description: 'Failed to load property categories',
            variant: 'destructive',
          });
        });

      // Then fetch all needed property data
      Promise.all([
        dispatch(getPropertyByCode(propertyCode)),
        dispatch(getPropertyWithRoomTypes(propertyCode)),
        dispatch(getPropertyWithFacilities(propertyCode)),
        dispatch(fetchPropertyFacilities()),
      ])
        .then(() => {
          setIsLoading(false);
        })
        .catch((error) => {
          toast({
            title: 'Error',
            description: 'Failed to load property data',
            variant: 'destructive',
          });
          setIsLoading(false);
        });
    }
  }, [dispatch, propertyCode, toast]);

  // Update form when property data is loaded
  useEffect(() => {
    if (property) {
      form.reset({
        propertyName: property.property_name || '',
        propertyCategory: property.property_category_id?.toString() || '',
        address: property.address || '',
        city: property.city || '',
        province: property.province || '',
        description: property.description || '',
      });

      // Set property photo if available
      if (property.property_photo) {
        setPropertyPhoto(property.property_photo);
      }
    }
  }, [property, form]);

  // Update rooms when room types are loaded
  useEffect(() => {
    if (roomTypes && Array.isArray(roomTypes) && roomTypes.length > 0) {
      setRooms(
        roomTypes.map((room: RoomType) => ({
          id: room.id?.toString() || '',
          name: room.room_type_name || '',
          description: room.description || '',
          price: room.room_type_price?.toString() || '',
          quantity: room.quantity_room?.toString() || '',
          photo: room.room_photo || null,
        })),
      );
    }
  }, [roomTypes]);

  // Update facilities when property facilities are loaded
  useEffect(() => {
    if (
      propertyFacilities &&
      Array.isArray(propertyFacilities) &&
      propertyFacilities.length > 0
    ) {
      const facilityNames = propertyFacilities.map(
        (facility: any) =>
          facility.property_facility_name || facility.name || '',
      );
      setFacilities(facilityNames.filter((name) => name));
    }
  }, [propertyFacilities]);

  // Form submit handler
  const onSubmit = (data: PropertyFormValues) => {
    setIsSaveConfirmOpen(true);
  };

  const handleSaveConfirmed = async () => {
    const formData = form.getValues();
    const propertyIdNum = parseInt(propertyCode, 10);
    try {
      // Prepare property data with proper field names matching the backend
      const propertyData: Partial<CreatePropertyRequest> = {
        // Map frontend field names to backend field names
        property_name: formData.propertyName,
        property_category_id: Number.parseInt(
          formData.propertyCategory || '0',
          10,
        ),
        address: formData.address,
        city: formData.city,
        province: formData.province,
        description: formData.description,
        property_photo: propertyPhoto === null ? undefined : propertyPhoto,

        // For facilities, create a PropertyFacility array as expected by CreatePropertyRequest
        property_having_facilities: facilities.map(
          (facilityName): PropertyFacility => {
            // Find the facility ID from availableFacilities if possible
            const facilityObj = availableFacilities.find(
              (f) => f.property_facility_name === facilityName,
            );
            const facilityId = facilityObj?.id || 0;

            // Create a simple PropertyFacility object
            return {
              id: facilityId,
              property_facility_name: facilityName,
            };
          },
        ),

        // For rooms, ensure structure matches CreatePropertyRequest.room_types
        room_types: rooms.map((room) => {
          // Create room type object with only the fields defined in CreatePropertyRequest
          return {
            room_type_name: room.name,
            description: room.description,
            room_type_price: Number.parseFloat(room.price || '0'),
            quantity_room: Number.parseInt(room.quantity || '0', 10),
            room_photo: room.photo || '', // Ensure this is never undefined
          };
        }),
      };

      console.log('Sending to API:', propertyData);
      // Dispatch the updateProperty action with the property code and data
      const result = await dispatch(
        updateProperty({
          propertyCode,
          propertyData,
        }),
      );
      console.log('API Response:', result);
      // Check if the action was fulfilled (not rejected)
      if (updateProperty.fulfilled.match(result)) {
        await Promise.all([
          dispatch(getPropertyByCode(propertyCode)),
          dispatch(getPropertyWithRoomTypes(propertyCode)),
          dispatch(getPropertyWithFacilities(propertyCode)),
        ]);
        toast({
          title: 'Success',
          description: 'Property information saved successfully',
        });
        setIsSaveConfirmOpen(false);
        setIsEditMode(false);
        router.push('/tenant');
      } else {
        // If the action was rejected, the error will be in result.payload
        throw new Error(result.payload as string);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description:
          typeof error === 'object' && error !== null && 'message' in error
            ? (error as Error).message
            : 'Failed to save property information',
        variant: 'destructive',
      });
    }
  };

  const handleAddFacility = () => {
    if (newFacility.trim()) {
      setFacilities([...facilities, newFacility.trim()]);
      setNewFacility('');
      setIsFacilityDialogOpen(false);
    }
  };

  const handleAddRoom = () => {
    if (newRoom.name.trim()) {
      setRooms([...rooms, { ...newRoom }]);
      setNewRoom({
        name: '',
        description: '',
        price: '',
        quantity: '',
        photo: null,
      });
      setNewRoomPhoto(null);
      setNewRoomPhotoPreview(null);
      setIsRoomDialogOpen(false);
    }
  };

  // Open confirmation dialog instead of deleting immediately
  const confirmDelete = (
    type: 'facility' | 'room',
    index: number,
    name: string,
  ) => {
    setItemToDelete({ type, index, name });
    setIsDeleteConfirmOpen(true);
  };

  // Actual delete functions that run after confirmation
  const handleDeleteConfirmed = () => {
    if (!itemToDelete) return;

    const { type, index } = itemToDelete;

    if (type === 'facility') {
      const updatedFacilities = [...facilities];
      updatedFacilities.splice(index, 1);
      setFacilities(updatedFacilities);
    } else if (type === 'room') {
      const updatedRooms = [...rooms];
      updatedRooms.splice(index, 1);
      setRooms(updatedRooms);
    }

    setIsDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  // Show loading state
  if (
    isLoading ||
    propertyLoading ||
    propertyDetailLoading ||
    categoriesLoading
  ) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading property information...</p>
        </div>
      </div>
    );
  }

  if (propertyError) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">
            Error loading property: {propertyError}
          </p>
          {typeof window !== 'undefined' && (
            <Button
              className="mt-4 bg-cyan-500 hover:bg-cyan-900"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="container mx-auto py-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="max-w-3xl mx-auto bg-gray-100">
              <CardHeader>
                <CardTitle>Property Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="propertyName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Property Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-white"
                          disabled={!isEditMode}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="propertyCategory"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Property Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={
                          field.value ? field.value.toString() : undefined
                        }
                        disabled={!isEditMode}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select property category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {propertyCategories &&
                          propertyCategories.length > 0 ? (
                            propertyCategories.map((category) => (
                              <SelectItem
                                key={
                                  category.property_category_code ||
                                  `category-${Math.random()}`
                                }
                                value={(category.id || '').toString()}
                              >
                                {category.property_category_name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="0">
                              No categories available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-white"
                          disabled={!isEditMode}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-white"
                          disabled={!isEditMode}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Province</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-white"
                          disabled={!isEditMode}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Property Photo Section */}
                <div className="space-y-2">
                  <Label>Photo of Property</Label>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        id="photo"
                        className="hidden"
                        onChange={handlePropertyPhotoChange}
                        disabled={!isEditMode}
                        accept="image/*"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor="photo"
                          className={`flex items-center justify-between ${isEditMode ? 'cursor-pointer' : 'cursor-not-allowed'} bg-white border rounded-md px-3 py-2`}
                        >
                          <span className="text-gray-500">
                            {propertyPhoto
                              ? 'Change photo...'
                              : 'Choose file...'}
                          </span>
                          <Button
                            type="button"
                            size="sm"
                            className="bg-cyan-500 hover:bg-cyan-900 text-xs"
                            disabled={!isEditMode}
                          >
                            <Upload className="h-3 w-3 mr-1" />
                            Upload
                          </Button>
                        </Label>
                      </div>
                    </div>

                    {/* Image preview area */}
                    <div className="mt-2 border rounded-md overflow-hidden bg-white">
                      {propertyPhoto ? (
                        <div className="relative">
                          <img
                            src={
                              propertyPhotoPreview ||
                              getImageSrc(propertyPhoto) ||
                              '/placeholder.svg'
                            }
                            alt="Property"
                            className="w-full h-48 object-cover"
                          />
                          {isEditMode && (
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              className="absolute top-2 right-2 bg-red-500 hover:bg-red-700"
                              onClick={handleRemovePropertyPhoto}
                            >
                              <X className="h-3 w-3 mr-1" />
                              Remove
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="h-48 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                          <ImageIcon className="h-12 w-12 mb-2 opacity-30" />
                          <p>No property photo available</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Property Facilities</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {(availableFacilities || []).map((facility, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`facility-${index}`}
                          value={facility.property_facility_name}
                          className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFacilities([
                                ...facilities,
                                facility.property_facility_name,
                              ]);
                            } else {
                              setFacilities(
                                facilities.filter(
                                  (f) => f !== facility.property_facility_name,
                                ),
                              );
                            }
                          }}
                          checked={facilities.includes(
                            facility.property_facility_name,
                          )}
                          disabled={!isEditMode}
                        />
                        <Label
                          htmlFor={`facility-${index}`}
                          className="text-sm font-normal"
                        >
                          {facility.property_facility_name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="bg-white min-h-[120px]"
                          disabled={!isEditMode}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Room Type</Label>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="flex items-center gap-1 bg-cyan-500 hover:bg-cyan-900 text-white text-xs"
                      onClick={() => setIsRoomDialogOpen(true)}
                      disabled={!isEditMode}
                    >
                      <Plus className="h-4 w-4" /> New Room Type
                    </Button>
                  </div>

                  {/* Room Types List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    {rooms.map((room, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-md p-3 border relative"
                      >
                        {isEditMode && (
                          <button
                            type="button"
                            onClick={() =>
                              confirmDelete('room', index, room.name)
                            }
                            className="absolute top-2 right-2 rounded-full bg-gray-200 hover:bg-gray-300 p-1 flex items-center justify-center"
                            aria-label={`Remove ${room.name}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}

                        <div className="flex flex-col h-full">
                          <h4 className="font-medium text-sm mb-1">
                            {room.name}
                          </h4>

                          {/* Room photo preview */}
                          {room.photo ? (
                            <div className="h-24 mb-2 overflow-hidden rounded border">
                              <img
                                src={
                                  getImageSrc(room.photo) || '/placeholder.svg'
                                }
                                alt={room.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-24 mb-2 flex items-center justify-center bg-gray-100 rounded border">
                              <span className="text-xs text-gray-400">
                                No photo
                              </span>
                            </div>
                          )}

                          <div className="text-xs text-gray-600 mb-1 line-clamp-2">
                            {room.description}
                          </div>

                          <div className="mt-auto flex justify-between text-xs">
                            <span>Price: Rp{room.price}</span>
                            <span>Qty: {room.quantity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="max-w-3xl mx-auto mt-6 flex justify-end gap-3">
              {isEditMode ? (
                <>
                  <Button
                    type="button"
                    className="bg-cyan-500 hover:bg-cyan-900 px-6 py-2 text-base"
                    onClick={() => {
                      // Check if form is valid before showing confirmation
                      const isValid = form.trigger();
                      isValid.then((valid) => {
                        if (valid) {
                          setIsSaveConfirmOpen(true);
                        }
                      });
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="px-6 py-2 text-base"
                    onClick={() => setIsEditMode(false)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  className="bg-cyan-500 hover:bg-cyan-900 px-6 py-2 text-base"
                  onClick={() => setIsEditMode(true)}
                >
                  Edit
                </Button>
              )}
            </div>
          </form>
        </Form>

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
                type="button"
                variant="outline"
                onClick={() => setIsFacilityDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
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
                <Label htmlFor="roomPrice">Room Type Price</Label>
                <Input
                  id="roomPrice"
                  placeholder="Enter price"
                  value={newRoom.price}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, price: e.target.value })
                  }
                  type="number"
                />
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
                />
              </div>

              {/* Room Photo Upload */}
              <div className="space-y-2">
                <Label>Room Photo</Label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      id="roomPhoto"
                      className="hidden"
                      onChange={handleRoomPhotoChange}
                      accept="image/*"
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor="roomPhoto"
                        className="flex items-center justify-between cursor-pointer bg-white border rounded-md px-3 py-2"
                      >
                        <span className="text-gray-500">
                          {newRoomPhoto ? 'Change photo...' : 'Choose file...'}
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          className="bg-cyan-500 hover:bg-cyan-900 text-xs"
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          Upload
                        </Button>
                      </Label>
                    </div>
                  </div>

                  {/* Room photo preview */}
                  {newRoomPhotoPreview ? (
                    <div className="relative mt-2 border rounded-md overflow-hidden">
                      <img
                        src={newRoomPhotoPreview || '/placeholder.svg'}
                        alt="Room preview"
                        className="w-full h-32 object-cover"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-700"
                        onClick={handleRemoveRoomPhoto}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="h-32 mt-2 flex flex-col items-center justify-center bg-gray-100 border rounded-md text-gray-400">
                      <ImageIcon className="h-8 w-8 mb-1 opacity-30" />
                      <p className="text-xs">No room photo uploaded</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRoomDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
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
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setItemToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteConfirmed}
                className="bg-red-500 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Save Confirmation Dialog */}
        <Dialog open={isSaveConfirmOpen} onOpenChange={setIsSaveConfirmOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Changes</DialogTitle>
              <DialogDescription>
                Are you sure you want to save these changes?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSaveConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveConfirmed}
                className="bg-cyan-500 hover:bg-cyan-900 text-white"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
