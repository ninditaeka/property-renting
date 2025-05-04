'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
import { useToast } from '@/hooks/use-toast';

// Types
interface Property {
  id: number;
  property_code: string;
  property_name: string;
}

interface RoomType {
  id: number;
  room_type_code: string;
  room_type_name: string;
}

interface Facility {
  id: number;
  room_facility_name: string;
}

interface PriceInfo {
  basePrice: number;
}

export default function RoomManagementForm() {
  const { toast } = useToast();
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    property_code: '',
    room_type_code: '',
    room_number: '',
  });
  const [errors, setErrors] = useState({
    room_number: '',
  });

  // Mock data (in a real app, this would come from API calls)
  const [properties, setProperties] = useState<Property[]>([
    { id: 1, property_code: 'PROP001', property_name: 'Seaside Resort' },
    { id: 2, property_code: 'PROP002', property_name: 'Mountain Lodge' },
    { id: 3, property_code: 'PROP003', property_name: 'City Hotel' },
  ]);

  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([
    { id: 1, room_facility_name: 'Wi-Fi' },
    { id: 2, room_facility_name: 'Air Conditioning' },
    { id: 3, room_facility_name: 'TV' },
    { id: 4, room_facility_name: 'Mini Bar' },
    { id: 5, room_facility_name: 'Safe' },
    { id: 6, room_facility_name: 'Balcony' },
  ]);

  const [priceInfo, setPriceInfo] = useState<PriceInfo | null>(null);
  const [loading, setLoading] = useState(false);

  // Facility management
  const [isFacilityDialogOpen, setIsFacilityDialogOpen] = useState(false);
  const [newFacility, setNewFacility] = useState('');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState<string | null>(null);
  const [customFacilities, setCustomFacilities] = useState<string[]>([]);
  const [selectedFacilityIds, setSelectedFacilityIds] = useState<string[]>([]);

  // Set default values for the form
  useEffect(() => {
    // In a real app, these would come from API or props
    setFormData({
      property_code: 'PROP001', // Default property
      room_type_code: '',
      room_number: '',
    });
  }, []);

  // Load room types when component mounts or property changes
  useEffect(() => {
    if (formData.property_code) {
      // In a real app, this would be an API call
      const mockRoomTypesByProperty: Record<string, RoomType[]> = {
        PROP001: [
          { id: 1, room_type_code: 'STD001', room_type_name: 'Standard Room' },
          { id: 2, room_type_code: 'DLX001', room_type_name: 'Deluxe Room' },
        ],
        PROP002: [
          { id: 3, room_type_code: 'CAB001', room_type_name: 'Cabin' },
          { id: 4, room_type_code: 'SUI001', room_type_name: 'Suite' },
        ],
        PROP003: [
          { id: 5, room_type_code: 'SGL001', room_type_name: 'Single Room' },
          { id: 6, room_type_code: 'DBL001', room_type_name: 'Double Room' },
        ],
      };

      setRoomTypes(mockRoomTypesByProperty[formData.property_code] || []);

      // Set a default room type
      if (mockRoomTypesByProperty[formData.property_code]?.length > 0) {
        const defaultRoomType =
          mockRoomTypesByProperty[formData.property_code][0].room_type_code;
        setFormData((prev) => ({ ...prev, room_type_code: defaultRoomType }));
      }
    }
  }, [formData.property_code]);

  // Load price when room type changes
  useEffect(() => {
    if (formData.room_type_code) {
      // In a real app, this would be an API call
      const mockPricesByRoomType: Record<string, PriceInfo> = {
        STD001: { basePrice: 100000 },
        DLX001: { basePrice: 150000 },
        CAB001: { basePrice: 200000 },
        SUI001: { basePrice: 300000 },
        SGL001: { basePrice: 80000 },
        DBL001: { basePrice: 120000 },
      };

      setPriceInfo(mockPricesByRoomType[formData.room_type_code] || null);
    }
  }, [formData.room_type_code]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user selects
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Toggle facility selection
  const toggleFacilitySelection = (facilityId: string) => {
    setSelectedFacilityIds((prevSelectedIds) => {
      return prevSelectedIds.includes(facilityId)
        ? prevSelectedIds.filter((id) => id !== facilityId)
        : [...prevSelectedIds, facilityId];
    });
  };

  // Handle custom facility addition
  const handleAddFacility = () => {
    if (newFacility.trim()) {
      setCustomFacilities((prev) => [...prev, newFacility.trim()]);
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
    } else {
      // If it's a standard facility
      setSelectedFacilityIds(
        selectedFacilityIds.filter((id) => id !== facilityToDelete),
      );
    }

    setIsDeleteConfirmOpen(false);
    setFacilityToDelete(null);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {
      room_number: '',
    };

    let isValid = true;

    if (!formData.room_number) {
      newErrors.room_number = 'Room number is required';
      isValid = false;
    } else if (!/^[A-Za-z0-9-]+$/.test(formData.room_number)) {
      newErrors.room_number =
        'Room number should only contain letters, numbers and hyphens';
      isValid = false;
    }

    setErrors(newErrors as any);
    return isValid;
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Prepare facilities data
    const standardFacilities = selectedFacilityIds.map((id) => Number(id));

    // Create room request payload
    const roomData = {
      property_id: properties.find(
        (property) => property.property_code === formData.property_code,
      )?.id,
      room_type_id: roomTypes.find(
        (roomType) => roomType.room_type_code === formData.room_type_code,
      )?.id,
      room_number: formData.room_number,
      room_facilities_ids: standardFacilities,
      custom_facilities: customFacilities,
    };

    // Simulate API call
    console.log('Submitting room data:', roomData);

    // Simulate success after 1 second
    setTimeout(() => {
      setLoading(false);

      toast({
        title: 'Success',
        description: 'Room created successfully!',
        variant: 'default',
      });

      // In a real app, this would redirect after successful API call
      // router.push('/tenant/room-management');
    }, 1000);
  };

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="container mx-auto py-6">
        <Card className="max-w-3xl mx-auto bg-gray-100">
          <CardHeader>
            <CardTitle>Room Management Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Property Selection - Read Only */}
              <div className="space-y-2">
                <Label htmlFor="property_code">Property Name</Label>
                <Input
                  id="property_code"
                  value={
                    properties.find(
                      (p) => p.property_code === formData.property_code,
                    )?.property_name || ''
                  }
                  className="bg-gray-100"
                  readOnly
                />
                <p className="text-sm text-gray-500 mt-1">
                  Property information cannot be changed
                </p>
              </div>

              {/* Room Type Selection - Read Only */}
              <div className="space-y-2">
                <Label htmlFor="room_type_code">Room Type</Label>
                <Input
                  id="room_type_code"
                  value={
                    roomTypes.find(
                      (rt) => rt.room_type_code === formData.room_type_code,
                    )?.room_type_name || ''
                  }
                  className="bg-gray-100"
                  readOnly
                />
                <p className="text-sm text-gray-500 mt-1">
                  Room type information cannot be changed
                </p>
              </div>

              {/* Price Display - Read Only */}
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="text"
                  value={
                    priceInfo?.basePrice ? `IDR ${priceInfo.basePrice}` : ''
                  }
                  readOnly
                  className="bg-gray-100"
                  placeholder="Price will be shown automatically"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Price information cannot be changed
                </p>
              </div>

              {/* Room Number */}
              <div className="space-y-2">
                <Label htmlFor="room_number">Room Number</Label>
                <Input
                  id="room_number"
                  name="room_number"
                  placeholder="Enter room number"
                  className="bg-white"
                  value={formData.room_number}
                  onChange={handleInputChange}
                />
                <p className="text-sm text-gray-500 mt-1">
                  This will be the identifying number for the room
                </p>
                {errors.room_number && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.room_number}
                  </p>
                )}
              </div>

              {/* Room Facilities */}
              <div className="space-y-4">
                {/* Standard Facilities Checkboxes */}
                <div className="grid grid-cols-2 gap-3">
                  {facilities.map((facility) => (
                    <div
                      key={facility.id}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        id={`facility-${facility.id}`}
                        value={facility.id.toString()}
                        className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                        onChange={() =>
                          toggleFacilitySelection(facility.id.toString())
                        }
                        checked={selectedFacilityIds.includes(
                          facility.id.toString(),
                        )}
                      />
                      <Label
                        htmlFor={`facility-${facility.id}`}
                        className="text-sm font-normal"
                      >
                        {facility.room_facility_name}
                      </Label>
                    </div>
                  ))}
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
                          facilities.find((f) => String(f.id) === facilityId)
                            ?.room_facility_name || facilityId;
                        return (
                          <Badge
                            key={facilityId}
                            variant="secondary"
                            className="bg-gray-200 text-black flex items-center gap-1 pr-1"
                          >
                            {facilityName}
                            <button
                              onClick={() => confirmDeleteFacility(facilityId)}
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
                  {loading ? 'Creating...' : 'Save'}
                </Button>
              </div>
            </form>
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
