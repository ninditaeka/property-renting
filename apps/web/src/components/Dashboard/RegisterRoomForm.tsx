'use client';

import type React from 'react';

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

// Simulated database data
const PROPERTIES = [
  { id: 1, name: 'Seaside Villa' },
  { id: 2, name: 'Mountain Lodge' },
  { id: 3, name: 'City Apartment' },
];

const ROOM_TYPES = [
  { id: 1, name: 'Single bedroom', price: 100 },
  { id: 2, name: 'Double bedroom', price: 150 },
  { id: 3, name: 'One bedroom', price: 120 },
  { id: 4, name: 'Two bedroom', price: 200 },
  { id: 5, name: 'Three bedroom', price: 300 },
];

const FACILITIES = [
  { id: 'single_bedroom', label: 'Single bedroom' },
  { id: 'double_bedroom', label: 'Double bedroom' },
  { id: 'extra_bed', label: 'Extra bed' },
  { id: 'ac', label: 'AC' },
  { id: 'tv', label: 'TV' },
  { id: 'wifi', label: 'Wifi' },
  { id: 'work_desk', label: 'Work desk' },
  { id: 'mini_bar', label: 'Mini bar' },
  { id: 'balcony', label: 'Balcony' },
  { id: 'room_services', label: 'Room services' },
  { id: 'fully_equipped_kitchen', label: 'Fully equipped kitchen' },
  { id: 'living_room', label: 'Living room' },
  { id: 'private_swimming_pool', label: 'Private swimming pool' },
  { id: 'bbq_area', label: 'BBQ area' },
  { id: 'locker_storage', label: 'Locker storage' },
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'one_bedroom', label: 'One bedroom' },
  { id: 'two_bedroom', label: 'Two bedroom' },
  { id: 'three_bedroom', label: 'Three bedroom' },
  { id: 'one_bathroom', label: 'One bathroom' },
  { id: 'two_bathroom', label: 'Two bathroom' },
];

export default function RoomManagementFormPage() {
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [selectedRoomType, setSelectedRoomType] = useState<string>('');
  const [roomPrice, setRoomPrice] = useState<number | null>(null);
  const [numberRoom, setNumberRoom] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

  // New state for facility dialog
  const [isFacilityDialogOpen, setIsFacilityDialogOpen] = useState(false);
  const [newFacility, setNewFacility] = useState('');

  // Delete confirmation dialog states
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState<string | null>(null);

  // Update price when room type changes
  useEffect(() => {
    if (selectedRoomType) {
      const roomType = ROOM_TYPES.find(
        (rt) => rt.id.toString() === selectedRoomType,
      );
      if (roomType) {
        setRoomPrice(roomType.price);
      }
    } else {
      setRoomPrice(null);
    }
  }, [selectedRoomType]);

  const handleAddFacility = () => {
    if (newFacility.trim()) {
      setSelectedFacilities([...selectedFacilities, newFacility.trim()]);
      setNewFacility('');
      setIsFacilityDialogOpen(false);
    }
  };

  const confirmDeleteFacility = (facility: string) => {
    setFacilityToDelete(facility);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmed = () => {
    if (!facilityToDelete) return;

    setSelectedFacilities(
      selectedFacilities.filter((f) => f !== facilityToDelete),
    );

    setIsDeleteConfirmOpen(false);
    setFacilityToDelete(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log({
      propertyId: selectedProperty,
      roomTypeId: selectedRoomType,
      price: roomPrice,
      numberRoom,
      description,
      facilities: selectedFacilities,
    });
    alert('Room created successfully!');
  };

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="container mx-auto py-6">
        <Card className="max-w-3xl mx-auto bg-gray-100">
          <CardHeader>
            <CardTitle>Room Management Form</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="property">Property Name</Label>
              <Select
                value={selectedProperty}
                onValueChange={setSelectedProperty}
              >
                <SelectTrigger id="property" className="bg-white">
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTIES.map((property) => (
                    <SelectItem
                      key={property.id}
                      value={property.id.toString()}
                    >
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomType">Room Type</Label>
              <Select
                value={selectedRoomType}
                onValueChange={setSelectedRoomType}
              >
                <SelectTrigger id="roomType" className="bg-white">
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  {ROOM_TYPES.map((roomType) => (
                    <SelectItem
                      key={roomType.id}
                      value={roomType.id.toString()}
                    >
                      {roomType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={roomPrice || ''}
                readOnly
                className="bg-white"
                placeholder="Price will be shown automatically"
              />
              <p className="text-sm text-gray-500 mt-1">
                Price is automatically set based on room type
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name_room">Number of Room</Label>
              <Input
                id="number_room"
                type="text"
                value={numberRoom}
                onChange={(e) => setNumberRoom(e.target.value)}
                className="bg-white"
                placeholder="Enter room number"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Room Facilities</Label>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-1 bg-cyan-500 hover:bg-cyan-900 text-white text-xs"
                  onClick={() => setIsFacilityDialogOpen(true)}
                >
                  <Plus className="h-4 w-4" /> Add Facility
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {FACILITIES.map((facility) => (
                  <div
                    key={facility.id}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      id={facility.id}
                      value={facility.id}
                      className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFacilities([
                            ...selectedFacilities,
                            facility.id,
                          ]);
                        } else {
                          setSelectedFacilities(
                            selectedFacilities.filter((f) => f !== facility.id),
                          );
                        }
                      }}
                      checked={selectedFacilities.includes(facility.id)}
                    />
                    <Label
                      htmlFor={facility.id}
                      className="text-sm font-normal"
                    >
                      {facility.label}
                    </Label>
                  </div>
                ))}
              </div>

              {selectedFacilities.length > 0 && (
                <div className="mt-2">
                  <Label className="block mb-2">Selected Facilities</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedFacilities.map((facilityId, index) => {
                      const facilityLabel =
                        FACILITIES.find((f) => f.id === facilityId)?.label ||
                        facilityId;
                      return (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-gray-200 text-black flex items-center gap-1 pr-1"
                        >
                          {facilityLabel}
                          <button
                            onClick={() => confirmDeleteFacility(facilityId)}
                            className="ml-1 rounded-full bg-gray-300 hover:bg-gray-400 p-0.5 flex items-center justify-center"
                            aria-label={`Remove ${facilityLabel}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </CardContent>

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
          <Dialog
            open={isDeleteConfirmOpen}
            onOpenChange={setIsDeleteConfirmOpen}
          >
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
        </Card>

        <div className="max-w-3xl mx-auto mt-6 flex justify-end">
          <Button
            onClick={handleSubmit}
            className="bg-cyan-500 hover:bg-cyan-900 px-6 py-2 text-base"
          >
            Create Room
          </Button>
        </div>
      </div>
    </div>
  );
}
