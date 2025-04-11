// 'use client';

// import { useState } from 'react';
// import { Plus, X } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogDescription,
// } from '@/components/ui/dialog';
// import { Label } from '@/components/ui/label';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';

// export default function ViewDetailPropertyFormPage() {
//   const [facilities, setFacilities] = useState<string[]>([
//     'Parking',
//     'Swimming pool',
//   ]);
//   const [rooms, setRooms] = useState<
//     Array<{
//       name: string;
//       description: string;
//       price: string;
//       quantity: string;
//     }>
//   >([
//     { name: 'Deluxe', description: '', price: '', quantity: '' },
//     { name: 'Superior', description: '', price: '', quantity: '' },
//   ]);

//   const [newFacility, setNewFacility] = useState('');
//   const [isFacilityDialogOpen, setIsFacilityDialogOpen] = useState(false);
//   const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
//   const [newRoom, setNewRoom] = useState<{
//     name: string;
//     description: string;
//     price: string;
//     quantity: string;
//   }>({
//     name: '',
//     description: '',
//     price: '',
//     quantity: '',
//   });
//   const [propertyCategory, setPropertyCategory] = useState<string>('');

//   // Delete confirmation dialog states
//   const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState<{
//     type: 'facility' | 'room';
//     index: number;
//     name: string;
//   } | null>(null);

//   const [isEditMode, setIsEditMode] = useState(false);
//   const [isSaveConfirmOpen, setIsSaveConfirmOpen] = useState(false);

//   const handleAddFacility = () => {
//     if (newFacility.trim()) {
//       setFacilities([...facilities, newFacility.trim()]);
//       setNewFacility('');
//       setIsFacilityDialogOpen(false);
//     }
//   };

//   const handleAddRoom = () => {
//     if (newRoom.name.trim()) {
//       setRooms([...rooms, { ...newRoom }]);
//       setNewRoom({
//         name: '',
//         description: '',
//         price: '',
//         quantity: '',
//       });
//       setIsRoomDialogOpen(false);
//     }
//   };

//   // Open confirmation dialog instead of deleting immediately
//   const confirmDelete = (
//     type: 'facility' | 'room',
//     index: number,
//     name: string,
//   ) => {
//     setItemToDelete({ type, index, name });
//     setIsDeleteConfirmOpen(true);
//   };

//   // Actual delete functions that run after confirmation
//   const handleDeleteConfirmed = () => {
//     if (!itemToDelete) return;

//     const { type, index } = itemToDelete;

//     if (type === 'facility') {
//       const updatedFacilities = [...facilities];
//       updatedFacilities.splice(index, 1);
//       setFacilities(updatedFacilities);
//     } else if (type === 'room') {
//       const updatedRooms = [...rooms];
//       updatedRooms.splice(index, 1);
//       setRooms(updatedRooms);
//     }

//     setIsDeleteConfirmOpen(false);
//     setItemToDelete(null);
//   };

//   return (
//     <div className="w-full h-full overflow-y-auto">
//       <div className="container mx-auto py-6">
//         <Card className="max-w-3xl mx-auto bg-gray-100">
//           <CardHeader>
//             <CardTitle>Property Information</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="space-y-2">
//               <Label htmlFor="propertyName">Property Name</Label>
//               <Input
//                 id="propertyName"
//                 className="bg-white"
//                 disabled={!isEditMode}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="propertyCategory">Property Category</Label>
//               <Select
//                 value={propertyCategory}
//                 onValueChange={setPropertyCategory}
//                 disabled={!isEditMode}
//               >
//                 <SelectTrigger id="propertyCategory" className="bg-white">
//                   <SelectValue placeholder="Select property category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="hotel">Hotel</SelectItem>
//                   <SelectItem value="villa">Villa</SelectItem>
//                   <SelectItem value="hostel">Hostel</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="address">Address</Label>
//               <Input id="address" className="bg-white" disabled={!isEditMode} />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="city">City</Label>
//               <Input id="city" className="bg-white" disabled={!isEditMode} />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="province">Province</Label>
//               <Input
//                 id="province"
//                 className="bg-white"
//                 disabled={!isEditMode}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>Photo of Property</Label>
//               <div className="flex items-center gap-2">
//                 <Input
//                   type="file"
//                   id="photo"
//                   className="hidden"
//                   disabled={!isEditMode}
//                 />
//                 <div className="flex-1">
//                   <Label
//                     htmlFor="photo"
//                     className="flex items-center justify-between cursor-pointer bg-white border rounded-md px-3 py-2"
//                   >
//                     <span className="text-gray-500">Choose file...</span>
//                     <Button
//                       size="sm"
//                       className="bg-cyan-500 hover:bg-cyan-900 text-xs"
//                       disabled={!isEditMode}
//                     >
//                       Upload
//                     </Button>
//                   </Label>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <Label>Property Facilities</Label>
//               <div className="grid grid-cols-2 gap-3">
//                 {[
//                   '24-hours security',
//                   'Gym and fitness center',
//                   'Sauna & Spa',
//                   'Swimming pool',
//                   'Restaurant',
//                   'Parking area',
//                   'Childeren Playground',
//                   'Meeting room',
//                   'Laundry services',
//                   'Lounge',
//                   'Minimarket',
//                   'Green Space',
//                   'Nearby Mall',
//                   'Shuttle Service',
//                   'AirPort Transport',
//                 ].map((facility, index) => (
//                   <div key={index} className="flex items-center space-x-2">
//                     <input
//                       type="checkbox"
//                       id={`facility-${index}`}
//                       value={facility}
//                       className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
//                       onChange={(e) => {
//                         if (e.target.checked) {
//                           setFacilities([...facilities, facility]);
//                         } else {
//                           setFacilities(
//                             facilities.filter((f) => f !== facility),
//                           );
//                         }
//                       }}
//                       checked={facilities.includes(facility)}
//                       disabled={!isEditMode}
//                     />
//                     <Label
//                       htmlFor={`facility-${index}`}
//                       className="text-sm font-normal"
//                     >
//                       {facility}
//                     </Label>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="description">Description</Label>
//               <Textarea
//                 id="description"
//                 className="bg-white"
//                 disabled={!isEditMode}
//               />
//             </div>

//             <div className="space-y-2">
//               <div className="flex justify-between items-center">
//                 <Label>Room Type</Label>
//                 <Button
//                   variant="secondary"
//                   size="sm"
//                   className="flex items-center gap-1 bg-cyan-500 hover:bg-cyan-900 text-white text-xs"
//                   onClick={() => setIsRoomDialogOpen(true)}
//                   disabled={!isEditMode}
//                 >
//                   <Plus className="h-4 w-4" /> New Room Type
//                 </Button>
//               </div>
//               <div className="flex flex-wrap gap-2 items-center mt-2">
//                 {rooms.map((room, index) => (
//                   <Badge
//                     key={index}
//                     variant="secondary"
//                     className="bg-gray-200 text-black flex items-center gap-1 pr-1"
//                   >
//                     {room.name}
//                     <button
//                       onClick={() => confirmDelete('room', index, room.name)}
//                       className="ml-1 rounded-full bg-gray-300 hover:bg-gray-400 p-0.5 flex items-center justify-center"
//                       aria-label={`Remove ${room.name}`}
//                       disabled={!isEditMode}
//                     >
//                       <X className="h-3 w-3" />
//                     </button>
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           </CardContent>

//           {/* Add Facility Dialog */}
//           <Dialog
//             open={isFacilityDialogOpen}
//             onOpenChange={setIsFacilityDialogOpen}
//           >
//             <DialogContent className="sm:max-w-md">
//               <DialogHeader>
//                 <DialogTitle>Add New Property Facility</DialogTitle>
//               </DialogHeader>
//               <div className="space-y-4 py-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="facilityName">Facility Name</Label>
//                   <Input
//                     id="facilityName"
//                     placeholder="Enter facility name"
//                     value={newFacility}
//                     onChange={(e) => setNewFacility(e.target.value)}
//                     disabled={!isEditMode}
//                   />
//                 </div>
//               </div>
//               <DialogFooter>
//                 <Button
//                   variant="outline"
//                   onClick={() => setIsFacilityDialogOpen(false)}
//                   disabled={!isEditMode}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={handleAddFacility}
//                   className="bg-cyan-500 hover:bg-cyan-900 text-xs"
//                   disabled={!isEditMode}
//                 >
//                   Add Facility
//                 </Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>

//           {/* Add Room Dialog */}
//           <Dialog open={isRoomDialogOpen} onOpenChange={setIsRoomDialogOpen}>
//             <DialogContent className="sm:max-w-md">
//               <DialogHeader>
//                 <DialogTitle>Add New Room Type</DialogTitle>
//               </DialogHeader>
//               <div className="space-y-4 py-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="roomName">Room Type Name</Label>
//                   <Input
//                     id="roomName"
//                     placeholder="Enter room type name"
//                     value={newRoom.name}
//                     onChange={(e) =>
//                       setNewRoom({ ...newRoom, name: e.target.value })
//                     }
//                     disabled={!isEditMode}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="roomDescription">Description</Label>
//                   <Textarea
//                     id="roomDescription"
//                     placeholder="Enter room description"
//                     value={newRoom.description}
//                     onChange={(e) =>
//                       setNewRoom({ ...newRoom, description: e.target.value })
//                     }
//                     className="min-h-[80px]"
//                     disabled={!isEditMode}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="roomPrice">Room Type Price</Label>
//                   <Input
//                     id="roomPrice"
//                     placeholder="Enter price"
//                     value={newRoom.price}
//                     onChange={(e) =>
//                       setNewRoom({ ...newRoom, price: e.target.value })
//                     }
//                     type="number"
//                     disabled={!isEditMode}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="roomQuantity">Quantity</Label>
//                   <Input
//                     id="roomQuantity"
//                     placeholder="Enter quantity"
//                     value={newRoom.quantity}
//                     onChange={(e) =>
//                       setNewRoom({ ...newRoom, quantity: e.target.value })
//                     }
//                     type="number"
//                     disabled={!isEditMode}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Room Photo</Label>
//                   <div className="flex items-center gap-2">
//                     <Input
//                       type="file"
//                       id="roomPhoto"
//                       className="hidden"
//                       disabled={!isEditMode}
//                     />
//                     <div className="flex-1">
//                       <Label
//                         htmlFor="roomPhoto"
//                         className="flex items-center justify-between cursor-pointer bg-white border rounded-md px-3 py-2"
//                       >
//                         <span className="text-gray-500">Choose file...</span>
//                         <Button
//                           size="sm"
//                           className="bg-cyan-500 hover:bg-cyan-900 text-xs"
//                           disabled={!isEditMode}
//                         >
//                           Upload
//                         </Button>
//                       </Label>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <DialogFooter>
//                 <Button
//                   variant="outline"
//                   onClick={() => setIsRoomDialogOpen(false)}
//                   disabled={!isEditMode}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={handleAddRoom}
//                   className="bg-cyan-500 hover:bg-cyan-900 text-xs"
//                   disabled={!isEditMode}
//                 >
//                   Add Room Type
//                 </Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>

//           {/* Delete Confirmation Dialog */}
//           <Dialog
//             open={isDeleteConfirmOpen}
//             onOpenChange={setIsDeleteConfirmOpen}
//           >
//             <DialogContent className="sm:max-w-md">
//               <DialogHeader>
//                 <DialogTitle>Confirm Deletion</DialogTitle>
//                 <DialogDescription>
//                   Are you sure you want to delete "{itemToDelete?.name}"?
//                 </DialogDescription>
//               </DialogHeader>
//               <DialogFooter className="mt-4">
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setIsDeleteConfirmOpen(false);
//                     setItemToDelete(null);
//                   }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   variant="destructive"
//                   onClick={handleDeleteConfirmed}
//                   className="bg-red-500 hover:bg-red-700 text-white"
//                 >
//                   Delete
//                 </Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         </Card>

//         <div className="max-w-3xl mx-auto mt-6 flex justify-end gap-3">
//           {isEditMode ? (
//             <>
//               <Button
//                 className="bg-cyan-500 hover:bg-cyan-900 px-6 py-2 text-base"
//                 onClick={() => setIsSaveConfirmOpen(true)}
//               >
//                 Save
//               </Button>
//               <Button
//                 variant="outline"
//                 className="px-6 py-2 text-base"
//                 onClick={() => setIsEditMode(false)}
//               >
//                 Cancel
//               </Button>
//             </>
//           ) : (
//             <Button
//               className="bg-cyan-500 hover:bg-cyan-900 px-6 py-2 text-base"
//               onClick={() => setIsEditMode(true)}
//             >
//               Edit
//             </Button>
//           )}
//         </div>

//         {/* Save Confirmation Dialog */}
//         <Dialog open={isSaveConfirmOpen} onOpenChange={setIsSaveConfirmOpen}>
//           <DialogContent className="sm:max-w-md">
//             <DialogHeader>
//               <DialogTitle>Confirm Changes</DialogTitle>
//               <DialogDescription>
//                 Are you sure you want to save these changes?
//               </DialogDescription>
//             </DialogHeader>
//             <DialogFooter className="mt-4">
//               <Button
//                 variant="outline"
//                 onClick={() => setIsSaveConfirmOpen(false)}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 onClick={() => {
//                   setIsSaveConfirmOpen(false);
//                   setIsEditMode(false);
//                   // Here you would typically save the data to your backend
//                   // For now, we'll just exit edit mode
//                 }}
//                 className="bg-cyan-500 hover:bg-cyan-900 text-white"
//               >
//                 Save Changes
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Plus, X } from 'lucide-react';

// UI Components
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
  updateProperty, // Added new import
} from '../../store/propertyList.slice';

import {
  getPropertyWithRoomTypes,
  getPropertyWithFacilities,
} from '../../store/propertyDetail.slice';

import { fetchPropertyFacilities } from '../../store/propertyfacility.slice';
import { AppDispatch, RootState } from '../../store';
import { RoomType } from '../../../types/propertyList.type';

// Form schema validation
const propertyFormSchema = z.object({
  propertyName: z.string().min(3, {
    message: 'Property name must be at least 3 characters.',
  }),
  propertyCategory: z.string().min(1, {
    message: 'Property category is required.',
  }),
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
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  // Redux selectors
  const {
    property,
    loading: propertyLoading,
    error: propertyError,
  } = useSelector((state: RootState) => state.propertyList);

  const { roomTypes, loading: roomTypesLoading } = useSelector(
    (state: RootState) => state.propertyDetail,
  );

  const { facilities: propertyFacilities, loading: facilitiesLoading } =
    useSelector((state: RootState) => state.propertyDetail);

  // const { availableFacilities, loading: availableFacilitiesLoading } =
  //   useSelector((state: RootState) => state.propertyFacilities);
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
  }>({
    name: '',
    description: '',
    price: '',
    quantity: '',
  });

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
      propertyCategory: '',
      address: '',
      city: '',
      province: '',
      description: '',
    },
  });

  // Fetch property data on component mount
  useEffect(() => {
    const propertyCode = new URLSearchParams(window.location.search).get(
      'code',
    );

    if (propertyCode) {
      setIsLoading(true);

      // Fetch all required data
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
  }, [dispatch, toast]);

  // Update local state when redux data changes
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
    }
  }, [property, form]);

  useEffect(() => {
    if (roomTypes && Array.isArray(roomTypes) && roomTypes.length > 0) {
      setRooms(
        roomTypes.map((room: RoomType) => ({
          id: room.id.toString(), // Convert id to string
          name: room.room_type_name,
          description: room.description || '',
          price: room.room_type_price?.toString() || '',
          quantity: room.quantity_room?.toString() || '',
        })),
      );
    }
  }, [roomTypes]);

  // Form submit handler
  const onSubmit = (data: PropertyFormValues) => {
    setIsSaveConfirmOpen(true);
  };

  const handleSaveConfirmed = async () => {
    const formData = form.getValues();

    try {
      // Get property code from URL
      const propertyCode = new URLSearchParams(window.location.search).get(
        'code',
      );

      if (!propertyCode) {
        throw new Error('Property code not found');
      }

      // Prepare property data
      const propertyData = {
        name: formData.propertyName,
        category: parseInt(formData.propertyCategory, 10),
        address: formData.address,
        city: formData.city,
        province: formData.province,
        description: formData.description,
        // Add facilities and other fields if needed
      };

      // Dispatch the updateProperty action with the property code and data
      const result = await dispatch(
        updateProperty({
          propertyCode,
          propertyData,
        }),
      );

      // Check if the action was fulfilled (not rejected)
      if (updateProperty.fulfilled.match(result)) {
        toast({
          title: 'Success',
          description: 'Property information saved successfully',
        });

        setIsSaveConfirmOpen(false);
        setIsEditMode(false);
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
      });
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

  if (isLoading || propertyLoading) {
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
          <Button
            className="mt-4 bg-cyan-500 hover:bg-cyan-900"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
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
                        defaultValue={field.value}
                        disabled={!isEditMode}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select property category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="hotel">Hotel</SelectItem>
                          <SelectItem value="villa">Villa</SelectItem>
                          <SelectItem value="hostel">Hostel</SelectItem>
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

                <div className="space-y-2">
                  <Label>Photo of Property</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      id="photo"
                      className="hidden"
                      disabled={!isEditMode}
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor="photo"
                        className="flex items-center justify-between cursor-pointer bg-white border rounded-md px-3 py-2"
                      >
                        <span className="text-gray-500">Choose file...</span>
                        <Button
                          type="button"
                          size="sm"
                          className="bg-cyan-500 hover:bg-cyan-900 text-xs"
                          disabled={!isEditMode}
                        >
                          Upload
                        </Button>
                      </Label>
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
                  <div className="flex flex-wrap gap-2 items-center mt-2">
                    {rooms.map((room, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-gray-200 text-black flex items-center gap-1 pr-1"
                      >
                        {room.name}
                        <button
                          type="button"
                          onClick={() =>
                            confirmDelete('room', index, room.name)
                          }
                          className="ml-1 rounded-full bg-gray-300 hover:bg-gray-400 p-0.5 flex items-center justify-center"
                          aria-label={`Remove ${room.name}`}
                          disabled={!isEditMode}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="max-w-3xl mx-auto mt-6 flex justify-end gap-3">
              {isEditMode ? (
                <>
                  <Button
                    type="submit"
                    className="bg-cyan-500 hover:bg-cyan-900 px-6 py-2 text-base"
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
              <div className="space-y-2">
                <Label>Room Photo</Label>
                <div className="flex items-center gap-2">
                  <Input type="file" id="roomPhoto" className="hidden" />
                  <div className="flex-1">
                    <Label
                      htmlFor="roomPhoto"
                      className="flex items-center justify-between cursor-pointer bg-white border rounded-md px-3 py-2"
                    >
                      <span className="text-gray-500">Choose file...</span>
                      <Button
                        type="button"
                        size="sm"
                        className="bg-cyan-500 hover:bg-cyan-900 text-xs"
                      >
                        Upload
                      </Button>
                    </Label>
                  </div>
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
