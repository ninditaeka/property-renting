'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Search,
  Plus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { deleteProperty } from '../../store/propertyList.slice';
import { fetchProperties } from '../../store/tenant.slice';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '../../store'; // Use your custom hooks
import { Property } from '../../../types/tenant.type';

const ITEMS_PER_PAGE = 4;

// Define the schema for validation
const searchSchema = z.object({
  searchTerm: z.string().optional(),
});

export function PropertyListPage() {
  // Use your custom hook instead of useDispatch
  const dispatch = useAppDispatch();

  // Use your custom hook and update the selector path based on your store structure
  const properties = useAppSelector((state) => state.tenant.properties.items);
  const loading = useAppSelector((state) => state.tenant.properties.isLoading);
  const error = useAppSelector((state) => state.tenant.properties.error);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<keyof Property>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [deletingPropertyCode, setDeletingPropertyCode] = useState<
    string | null
  >(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(searchSchema),
  });

  useEffect(() => {
    // Use unwrap() to properly handle the Promise
    dispatch(fetchProperties())
      .unwrap()
      .catch((error) => console.error('Failed to fetch properties:', error));
  }, [dispatch]);

  // Handle sorting
  const handleSort = (field: keyof Property) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Safe string conversion helper function
  const safeToString = (value: any): string => {
    if (value === null || value === undefined) {
      return '';
    }
    return String(value).toLowerCase();
  };

  // Helper function to safely get room type names
  const getRoomTypeString = (roomTypes: any): string => {
    if (!roomTypes) return '';

    if (typeof roomTypes === 'string') {
      return roomTypes.toLowerCase();
    }

    if (Array.isArray(roomTypes)) {
      return roomTypes
        .map((room) => {
          if (typeof room === 'string') return room;
          if (room && typeof room === 'object' && room.room_type_name) {
            return room.room_type_name;
          }
          return '';
        })
        .join('')
        .toLowerCase();
    }

    return '';
  };

  // Filter and sort properties
  const filteredAndSortedProperties = properties
    .filter((property) => {
      if (!searchTerm) return true;

      const searchTermLower = searchTerm.toLowerCase();

      // Safely convert all potential searchable fields to strings
      const propertyId = safeToString(property.id);
      const propertyCode = safeToString(property.property_code);
      const propertyName = safeToString(property.property_name);
      const propertyCity = safeToString(property.city);

      return (
        propertyId.includes(searchTermLower) ||
        propertyCode.includes(searchTermLower) ||
        propertyName.includes(searchTermLower) ||
        propertyCity.includes(searchTermLower)
      );
    })
    .sort((a: Property, b: Property) => {
      if (sortField === 'id') {
        // Add null checks for id property
        const idA = a.id ?? 0; // Use nullish coalescing
        const idB = b.id ?? 0;
        return sortDirection === 'asc' ? idA - idB : idB - idA;
      } else {
        // Handle string types for sorting with safe conversions
        let valueA = '';
        let valueB = '';

        if (sortField === 'property_name') {
          valueA = safeToString(a.property_name);
          valueB = safeToString(b.property_name);
        } else if (sortField === 'room_types') {
          valueA = getRoomTypeString(a.room_types);
          valueB = getRoomTypeString(b.room_types);
        } else if (sortField === 'city') {
          valueA = safeToString(a.city);
          valueB = safeToString(b.city);
        } else {
          // Handle any other fields safely
          valueA = safeToString(a[sortField]);
          valueB = safeToString(b[sortField]);
        }

        return sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
    });

  const totalPages = Math.ceil(
    filteredAndSortedProperties.length / ITEMS_PER_PAGE,
  );
  const currentProperties = filteredAndSortedProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleDeleteClick = (propertyCode: string) => {
    setDeletingPropertyCode(propertyCode);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingPropertyCode) {
      // Use unwrap() to properly handle the Promise
      dispatch(deleteProperty(deletingPropertyCode))
        .unwrap()
        .then(() => {
          setIsDeleteDialogOpen(false);
          setDeletingPropertyCode(null);
        })
        .catch((error) => console.error('Failed to delete property:', error));
    }
  };

  const onSubmit = (data: { searchTerm?: string }) => {
    if (data.searchTerm) {
      setSearchTerm(data.searchTerm);
    } else {
      setSearchTerm(''); // Handle case when searchTerm is not provided
    }
  };

  return (
    <>
      <Card className="w-full mt-14">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">Property List</CardTitle>
              <CardDescription>
                Manage and view all your registered properties
              </CardDescription>
            </div>
            <Link href="/tenant/register-property">
              <Button className="bg-cyan-500 hover:bg-cyan-600">
                <Plus className="mr-2 h-4 w-4" /> Register Property
              </Button>
            </Link>
          </div>
          <div className="mt-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="relative max-w-sm"
            >
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Controller
                name="searchTerm"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    type="search"
                    placeholder="Search properties..."
                    className="pl-8"
                    {...field}
                  />
                )}
              />
            </form>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead
                      className="font-semibold cursor-pointer"
                      onClick={() => handleSort('id')}
                    >
                      ID
                      {sortField === 'id' ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="inline ml-1 h-4 w-4" />
                        ) : (
                          <ArrowDown className="inline ml-1 h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="inline ml-1 h-4 w-4" />
                      )}
                    </TableHead>
                    <TableHead
                      className="font-semibold cursor-pointer"
                      onClick={() => handleSort('property_name')}
                    >
                      Property Name
                      {sortField === 'property_name' ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="inline ml-1 h-4 w-4" />
                        ) : (
                          <ArrowDown className="inline ml-1 h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="inline ml-1 h-4 w-4" />
                      )}
                    </TableHead>
                    <TableHead
                      className="font-semibold cursor-pointer"
                      onClick={() => handleSort('city')}
                    >
                      City
                      {sortField === 'city' ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="inline ml-1 h-4 w-4" />
                        ) : (
                          <ArrowDown className="inline ml-1 h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="inline ml-1 h-4 w-4" />
                      )}
                    </TableHead>
                    <TableHead className="font-semibold text-right">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="h-24 text-center text-muted-foreground"
                      >
                        Loading properties...
                      </TableCell>
                    </TableRow>
                  ) : currentProperties.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No properties found matching your search.
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentProperties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell className="font-medium">
                          {property.id} {/* Display ID */}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span>{property.property_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{property.city}</TableCell>
                        <TableCell className="text-right">
                          <Link
                            href={`/tenant/view-detail-property/${property.property_code}`} // Use property_code for detail view
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            >
                              View Detail
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            onClick={() =>
                              handleDeleteClick(String(property.property_code))
                            } // Ensure property_code is a string
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <Pagination className="mt-4 justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={
                    currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                  }
                  aria-disabled={currentPage === 1}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, index) => (
                <PaginationItem key={index + 1}>
                  <PaginationLink
                    isActive={currentPage === index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }
                  aria-disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this property?
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. This will permanently delete the
              property and remove the data from our servers.
            </p>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleConfirmDelete} variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
