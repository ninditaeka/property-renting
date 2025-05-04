// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import Link from 'next/link';
// import {
//   Search,
//   Plus,
//   ArrowUpDown,
//   ArrowUp,
//   ArrowDown,
//   Loader2,
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from '@/components/ui/pagination';
// import { Input } from '@/components/ui/input';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { useToast } from '@/hooks/use-toast';

// // Import from tenant slice instead of roomInfo slice
// import { fetchRooms } from '../../store/tenant.slice';
// import { deleteRoom } from '../../store/room.slice';
// import { AppDispatch, useAppSelector } from '@/store'; // Make sure you have this type defined in your store
// import { RoomInfo } from '../../../types/roomInfo.type';

// const ITEMS_PER_PAGE = 4;

// // Type for sort fields
// type SortField = 'property_name' | 'room_type_name' | 'room_number' | 'price';

// type SortDirection = 'asc' | 'desc';

// export function RoomManagementPage() {
//   // Fix 1: Use properly typed dispatch
//   const dispatch = useDispatch<AppDispatch>();

//   // Update the selector to use tenant.rooms instead of roomInfo
//   const {
//     items: rooms,
//     isLoading,
//     error,
//   } = useAppSelector((state) => state.tenant.rooms);

//   // Fix 2: Initialize toast from hook
//   const { toast } = useToast();

//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortField, setSortField] = useState<SortField>('property_name');
//   const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [roomToDelete, setRoomToDelete] = useState<string | null>(null);
//   const [isDeleting, setIsDeleting] = useState(false);

//   useEffect(() => {
//     console.log('cek rooms:', rooms);
//   }, [rooms]);

//   // Fetch rooms when component mounts
//   useEffect(() => {
//     dispatch(fetchRooms());
//   }, [dispatch]);

//   // Handle sorting
//   const handleSort = (field: SortField) => {
//     if (sortField === field) {
//       // Toggle direction if same field
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       // Set new field and default to ascending
//       setSortField(field);
//       setSortDirection('asc');
//     }
//   };

//   // Get sort icon for header
//   const getSortIcon = (field: SortField) => {
//     if (sortField !== field) {
//       return <ArrowUpDown className="ml-1 h-4 w-4 text-muted-foreground" />;
//     }
//     return sortDirection === 'asc' ? (
//       <ArrowUp className="ml-1 h-4 w-4" />
//     ) : (
//       <ArrowDown className="ml-1 h-4 w-4" />
//     );
//   };

//   // Open delete confirmation dialog
//   const openDeleteDialog = (roomNumberCode: string) => {
//     setRoomToDelete(roomNumberCode);
//     setDeleteDialogOpen(true);
//   };

//   // Handle room deletion
//   const handleDeleteRoom = async () => {
//     if (!roomToDelete) return;

//     setIsDeleting(true);
//     try {
//       await dispatch(deleteRoom(roomToDelete)).unwrap();
//       toast({
//         title: 'Room deleted',
//         description: 'The room has been successfully deleted.',
//         variant: 'default',
//       });
//       setDeleteDialogOpen(false);
//       // Refresh room list
//       dispatch(fetchRooms());
//     } catch (error) {
//       toast({
//         title: 'Error',
//         description: 'Failed to delete room. Please try again.',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsDeleting(false);
//     }
//   };
//   const filteredAndSortedRooms = rooms
//     ? rooms
//         .filter((room) => {
//           const searchLower = searchTerm.toLowerCase();
//           return (
//             // Access through the nested property object
//             ((room.property && room.property.property_name) || '')
//               .toLowerCase()
//               .includes(searchLower) ||
//             // Access through the nested room_type object
//             ((room.room_type && room.room_type.room_type_name) || '')
//               .toLowerCase()
//               .includes(searchLower) ||
//             (room.room_number || '').toLowerCase().includes(searchLower) ||
//             // Price might be in room_type
//             ((room.room_type && room.room_type.room_type_price) || '')
//               .toString()
//               .toLowerCase()
//               .includes(searchLower)
//           );
//         })
//         .sort((a, b) => {
//           // Special handling for the sort fields that are nested
//           if (sortField === 'property_name') {
//             const valueA = ((a.property && a.property.property_name) || '')
//               .toString()
//               .toLowerCase();
//             const valueB = ((b.property && b.property.property_name) || '')
//               .toString()
//               .toLowerCase();
//             return sortDirection === 'asc'
//               ? valueA.localeCompare(valueB)
//               : valueB.localeCompare(valueA);
//           }

//           if (sortField === 'room_type_name') {
//             const valueA = ((a.room_type && a.room_type.room_type_name) || '')
//               .toString()
//               .toLowerCase();
//             const valueB = ((b.room_type && b.room_type.room_type_name) || '')
//               .toString()
//               .toLowerCase();
//             return sortDirection === 'asc'
//               ? valueA.localeCompare(valueB)
//               : valueB.localeCompare(valueA);
//           }

//           if (sortField === 'price') {
//             const valueA = ((a.room_type && a.room_type.room_type_price) || '')
//               .toString()
//               .toLowerCase();
//             const valueB = ((b.room_type && b.room_type.room_type_price) || '')
//               .toString()
//               .toLowerCase();
//             return sortDirection === 'asc'
//               ? valueA.localeCompare(valueB)
//               : valueB.localeCompare(valueA);
//           }

//           // Direct fields
//           const valueA = (a[sortField as keyof RoomInfo] || '')
//             .toString()
//             .toLowerCase();
//           const valueB = (b[sortField as keyof RoomInfo] || '')
//             .toString()
//             .toLowerCase();
//           return sortDirection === 'asc'
//             ? valueA.localeCompare(valueB)
//             : valueB.localeCompare(valueA);
//         })
//     : [];

//   const totalPages = Math.ceil(filteredAndSortedRooms.length / ITEMS_PER_PAGE);
//   const indexOfLastRoom = currentPage * ITEMS_PER_PAGE;
//   const indexOfFirstRoom = indexOfLastRoom - ITEMS_PER_PAGE;
//   const currentRooms = filteredAndSortedRooms.slice(
//     indexOfFirstRoom,
//     indexOfLastRoom,
//   );

//   const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

//   const pageNumbers = [];
//   for (let i = 1; i <= totalPages; i++) {
//     pageNumbers.push(i);
//   }

//   // Format price to currency
//   const formatPrice = (price: number | string) => {
//     if (!price) return '';
//     return typeof price === 'number'
//       ? `IDR ${price.toLocaleString('id-ID')}`
//       : price.toString().startsWith('IDR')
//         ? price
//         : `IDR ${price}`;
//   };

//   // Create sortable header
//   const SortableHeader = ({
//     field,
//     label,
//     className = '',
//   }: {
//     field: SortField;
//     label: string;
//     className?: string;
//   }) => (
//     <TableHead
//       className={`font-semibold cursor-pointer ${className}`}
//       onClick={() => handleSort(field)}
//     >
//       <div className="flex items-center">
//         {label}
//         {getSortIcon(field)}
//       </div>
//     </TableHead>
//   );

//   return (
//     <Card className="w-full mt-14">
//       <CardHeader>
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <CardTitle className="text-2xl">Room Management</CardTitle>
//             <CardDescription>
//               Manage and view all your property rooms
//             </CardDescription>
//           </div>
//           <Link href={'/tenant/room-management/register-room'}>
//             <Button className="bg-cyan-500 hover:bg-cyan-600">
//               <Plus className="mr-2 h-4 w-4" /> Create New Room
//             </Button>
//           </Link>
//         </div>
//         <div className="mt-4">
//           <div className="relative max-w-sm">
//             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input
//               type="search"
//               placeholder="Search rooms..."
//               className="pl-8"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="rounded-md border">
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow className="bg-muted/50">
//                   <SortableHeader
//                     field="property_name"
//                     label="Property Name"
//                     className="whitespace-nowrap"
//                   />
//                   <SortableHeader
//                     field="room_type_name"
//                     label="Room Type"
//                     className="whitespace-nowrap"
//                   />
//                   <SortableHeader
//                     field="room_number"
//                     label="Room Number"
//                     className="whitespace-nowrap"
//                   />
//                   <SortableHeader
//                     field="price"
//                     label="Price"
//                     className="whitespace-nowrap"
//                   />

//                   <TableHead className="font-semibold whitespace-nowrap">
//                     Action
//                   </TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {isLoading ? (
//                   <TableRow>
//                     <TableCell colSpan={6} className="h-24 text-center">
//                       <div className="flex justify-center items-center">
//                         <Loader2 className="h-6 w-6 animate-spin mr-2" />
//                         Loading rooms...
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ) : error ? (
//                   <TableRow>
//                     <TableCell
//                       colSpan={6}
//                       className="h-24 text-center text-red-500"
//                     >
//                       Error loading rooms: {error}
//                     </TableCell>
//                   </TableRow>
//                 ) : currentRooms.length === 0 ? (
//                   <TableRow>
//                     <TableCell
//                       colSpan={6}
//                       className="h-24 text-center text-muted-foreground"
//                     >
//                       No rooms found matching your search.
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   currentRooms.map((room) => (
//                     <TableRow key={room.room_number_id}>
//                       <TableCell className="whitespace-nowrap">
//                         {room.property.property_name}
//                       </TableCell>
//                       <TableCell className="whitespace-nowrap">
//                         {room.room_type.room_type_name}
//                       </TableCell>
//                       <TableCell className="whitespace-nowrap">
//                         {room.room_number}
//                       </TableCell>
//                       <TableCell className="whitespace-nowrap">
//                         {formatPrice(room.room_type.room_type_price)}
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex space-x-2">
//                           {/* <Link
//                             href={`/tenant/room-management/edit/${room.room_number_code}`}
//                             className="text-blue-600 hover:underline"
//                           >
//                             Edit
//                           </Link> */}
//                           <button
//                             onClick={() =>
//                               openDeleteDialog(room.room_number_code)
//                             }
//                             className="text-red-600 hover:underline"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </div>

//         {!isLoading && !error && filteredAndSortedRooms.length > 0 && (
//           <Pagination className="mt-4 justify-end">
//             <PaginationContent>
//               <PaginationItem>
//                 <PaginationPrevious
//                   onClick={() => paginate(Math.max(1, currentPage - 1))}
//                   className={
//                     currentPage === 1 ? 'pointer-events-none opacity-50' : ''
//                   }
//                   aria-disabled={currentPage === 1}
//                 />
//               </PaginationItem>

//               {pageNumbers.map((number) => (
//                 <PaginationItem key={number}>
//                   <PaginationLink
//                     isActive={currentPage === number}
//                     onClick={() => paginate(number)}
//                   >
//                     {number}
//                   </PaginationLink>
//                 </PaginationItem>
//               ))}

//               <PaginationItem>
//                 <PaginationNext
//                   onClick={() =>
//                     paginate(Math.min(totalPages, currentPage + 1))
//                   }
//                   className={
//                     currentPage === totalPages
//                       ? 'pointer-events-none opacity-50'
//                       : ''
//                   }
//                   aria-disabled={currentPage === totalPages}
//                 />
//               </PaginationItem>
//             </PaginationContent>
//           </Pagination>
//         )}
//       </CardContent>

//       {/* Delete Room Dialog */}
//       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Confirm Deletion</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to delete this room? This action cannot be
//               undone.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setDeleteDialogOpen(false)}
//               disabled={isDeleting}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={handleDeleteRoom}
//               disabled={isDeleting}
//             >
//               {isDeleting ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Deleting...
//                 </>
//               ) : (
//                 'Delete'
//               )}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </Card>
//   );
// }
import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import {
  Search,
  Plus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

// Import from tenant slice
import { fetchRooms } from '../../store/tenant.slice';
import { deleteRoom } from '../../store/room.slice';
import { AppDispatch, useAppSelector } from '@/store';
import { RoomInfo } from '../../../types/roomInfo.type';

const ITEMS_PER_PAGE = 4;

// Type for sort fields
type SortField = 'property_name' | 'room_type_name' | 'room_number' | 'price';
type SortDirection = 'asc' | 'desc';

export function RoomManagementPage() {
  // Use properly typed dispatch
  const dispatch = useDispatch<AppDispatch>();

  // Update the selector to use tenant.rooms
  const {
    items: rooms,
    isLoading,
    error,
  } = useAppSelector((state) => state.tenant.rooms);

  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('property_name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [key, setKey] = useState(Date.now()); // Add a key to force remount

  // Fetch rooms when component mounts or key changes
  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch, key]);

  // Handle sorting
  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        // Toggle direction if same field
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        // Set new field and default to ascending
        setSortField(field);
        setSortDirection('asc');
      }
    },
    [sortField, sortDirection],
  );

  // Get sort icon for header
  const getSortIcon = useCallback(
    (field: SortField) => {
      if (sortField !== field) {
        return <ArrowUpDown className="ml-1 h-4 w-4 text-muted-foreground" />;
      }
      return sortDirection === 'asc' ? (
        <ArrowUp className="ml-1 h-4 w-4" />
      ) : (
        <ArrowDown className="ml-1 h-4 w-4" />
      );
    },
    [sortField, sortDirection],
  );

  // Open delete confirmation dialog
  const openDeleteDialog = useCallback((roomNumberCode: string) => {
    setRoomToDelete(roomNumberCode);
    setDeleteDialogOpen(true);
  }, []);

  // Handle room deletion
  const handleDeleteRoom = async () => {
    if (!roomToDelete) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteRoom(roomToDelete)).unwrap();
      toast({
        title: 'Room deleted',
        description: 'The room has been successfully deleted.',
        variant: 'default',
      });
      setDeleteDialogOpen(false);
      // Refresh room list
      dispatch(fetchRooms());
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete room. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Reset component state when coming back to this page
  useEffect(() => {
    const handleRouteChange = () => {
      setKey(Date.now());
    };

    // This is a simplified version - in Next.js, you'd use router events
    // For demo purposes, we're just showing the concept
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const filteredAndSortedRooms = rooms
    ? rooms
        .filter((room) => {
          const searchLower = searchTerm.toLowerCase();
          return (
            // Access through the nested property object
            ((room.property && room.property.property_name) || '')
              .toLowerCase()
              .includes(searchLower) ||
            // Access through the nested room_type object
            ((room.room_type && room.room_type.room_type_name) || '')
              .toLowerCase()
              .includes(searchLower) ||
            (room.room_number || '').toLowerCase().includes(searchLower) ||
            // Price might be in room_type
            ((room.room_type && room.room_type.room_type_price) || '')
              .toString()
              .toLowerCase()
              .includes(searchLower)
          );
        })
        .sort((a, b) => {
          // Special handling for the sort fields that are nested
          if (sortField === 'property_name') {
            const valueA = ((a.property && a.property.property_name) || '')
              .toString()
              .toLowerCase();
            const valueB = ((b.property && b.property.property_name) || '')
              .toString()
              .toLowerCase();
            return sortDirection === 'asc'
              ? valueA.localeCompare(valueB)
              : valueB.localeCompare(valueA);
          }

          if (sortField === 'room_type_name') {
            const valueA = ((a.room_type && a.room_type.room_type_name) || '')
              .toString()
              .toLowerCase();
            const valueB = ((b.room_type && b.room_type.room_type_name) || '')
              .toString()
              .toLowerCase();
            return sortDirection === 'asc'
              ? valueA.localeCompare(valueB)
              : valueB.localeCompare(valueA);
          }

          if (sortField === 'price') {
            const valueA = ((a.room_type && a.room_type.room_type_price) || '')
              .toString()
              .toLowerCase();
            const valueB = ((b.room_type && b.room_type.room_type_price) || '')
              .toString()
              .toLowerCase();
            return sortDirection === 'asc'
              ? valueA.localeCompare(valueB)
              : valueB.localeCompare(valueA);
          }

          // Direct fields
          const valueA = (a[sortField as keyof RoomInfo] || '')
            .toString()
            .toLowerCase();
          const valueB = (b[sortField as keyof RoomInfo] || '')
            .toString()
            .toLowerCase();
          return sortDirection === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        })
    : [];

  const totalPages = Math.ceil(filteredAndSortedRooms.length / ITEMS_PER_PAGE);
  const indexOfLastRoom = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstRoom = indexOfLastRoom - ITEMS_PER_PAGE;
  const currentRooms = filteredAndSortedRooms.slice(
    indexOfFirstRoom,
    indexOfLastRoom,
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Format price to currency
  const formatPrice = (price: number | string) => {
    if (!price) return '';
    return typeof price === 'number'
      ? `IDR ${price.toLocaleString('id-ID')}`
      : price.toString().startsWith('IDR')
        ? price
        : `IDR ${price}`;
  };

  // Create sortable header
  const SortableHeader = ({
    field,
    label,
    className = '',
  }: {
    field: SortField;
    label: string;
    className?: string;
  }) => (
    <TableHead
      className={`font-semibold cursor-pointer ${className}`}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center">
        {label}
        {getSortIcon(field)}
      </div>
    </TableHead>
  );

  return (
    <Card className="w-full mt-14" key={key}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">Room Management</CardTitle>
            <CardDescription>
              Manage and view all your property rooms
            </CardDescription>
          </div>
          {/* <Button
            className="bg-cyan-500 hover:bg-cyan-600"
            onClick={() =>
              (window.location.href = '/tenant/room-management/register-room')
            }
          >
            <Plus className="mr-2 h-4 w-4" /> Create New Room
          </Button> */}
          {typeof window !== 'undefined' && (
            <Button
              className="bg-cyan-500 hover:bg-cyan-600"
              onClick={() =>
                (window.location.href = '/tenant/room-management/register-room')
              }
            >
              <Plus className="mr-2 h-4 w-4" /> Create New Room
            </Button>
          )}
        </div>
        <div className="mt-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search rooms..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <SortableHeader
                    field="property_name"
                    label="Property Name"
                    className="whitespace-nowrap"
                  />
                  <SortableHeader
                    field="room_type_name"
                    label="Room Type"
                    className="whitespace-nowrap"
                  />
                  <SortableHeader
                    field="room_number"
                    label="Room Number"
                    className="whitespace-nowrap"
                  />
                  <SortableHeader
                    field="price"
                    label="Price"
                    className="whitespace-nowrap"
                  />

                  <TableHead className="font-semibold whitespace-nowrap">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        Loading rooms...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-red-500"
                    >
                      Error loading rooms: {error}
                    </TableCell>
                  </TableRow>
                ) : currentRooms.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No rooms found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentRooms.map((room) => (
                    <TableRow key={room.room_number_id}>
                      <TableCell className="whitespace-nowrap">
                        {room.property.property_name}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {room.room_type.room_type_name}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {room.room_number}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatPrice(room.room_type.room_type_price)}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              openDeleteDialog(room.room_number_code)
                            }
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {!isLoading && !error && filteredAndSortedRooms.length > 0 && (
          <Pagination className="mt-4 justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  className={
                    currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                  }
                  aria-disabled={currentPage === 1}
                />
              </PaginationItem>

              {pageNumbers.map((number) => (
                <PaginationItem key={number}>
                  <PaginationLink
                    isActive={currentPage === number}
                    onClick={() => paginate(number)}
                  >
                    {number}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    paginate(Math.min(totalPages, currentPage + 1))
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
        )}
      </CardContent>

      {/* Delete Room Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this room? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteRoom}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
