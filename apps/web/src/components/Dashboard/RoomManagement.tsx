// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { Search, Plus, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
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

// const allRooms = [
//   {
//     id: '#01',
//     propertyName: 'Seaside Resort',
//     roomType: 'Deluxe',
//     roomNumber: '101',
//     price: 'Rp 500.000',
//     facility: 'Wi-Fi, Private balcony, Smart TV',
//     description:
//       'A luxurious room with elegant design and premium features such as a private balcony, bathtub, seating area, and exclusive services. Often offers stunning views of the sea, garden, or city. Ideal for guests who want a more upscale stay experience.',
//   },
//   {
//     id: '#02',
//     propertyName: 'Seaside Resort',
//     roomType: 'Deluxe',
//     roomNumber: '102',
//     price: 'Rp 500.000',
//     facility: 'Wi-Fi, Private balcony, Smart TV',
//     description:
//       'A luxurious room with elegant design and premium features such as a private balcony, bathtub, seating area, and exclusive services. Often offers stunning views of the sea, garden, or city. Ideal for guests who want a more upscale stay experience.',
//   },
//   {
//     id: '#03',
//     propertyName: 'Mountain Lodge',
//     roomType: 'Deluxe',
//     roomNumber: '201',
//     price: 'Rp 500.000',
//     facility: 'Wi-Fi, Private balcony, Smart TV',
//     description:
//       'A luxurious room with elegant design and premium features such as a private balcony, bathtub, seating area, and exclusive services. Often offers stunning views of the sea, garden, or city. Ideal for guests who want a more upscale stay experience.',
//   },
//   {
//     id: '#04',
//     propertyName: 'Mountain Lodge',
//     roomType: 'Deluxe',
//     roomNumber: '202',
//     price: 'Rp 500.000',
//     facility: 'Wi-Fi, Private balcony, Smart TV',
//     description:
//       'A luxurious room with elegant design and premium features such as a private balcony, bathtub, seating area, and exclusive services. Often offers stunning views of the sea, garden, or city. Ideal for guests who want a more upscale stay experience.',
//   },
//   {
//     id: '#05',
//     propertyName: 'City Center Hotel',
//     roomType: 'Deluxe',
//     roomNumber: '301',
//     price: 'Rp 500.000',
//     facility: 'Wi-Fi, Private balcony, Smart TV',
//     description:
//       'A luxurious room with elegant design and premium features such as a private balcony, bathtub, seating area, and exclusive services. Often offers stunning views of the sea, garden, or city. Ideal for guests who want a more upscale stay experience.',
//   },
//   {
//     id: '#06',
//     propertyName: 'City Center Hotel',
//     roomType: 'Deluxe',
//     roomNumber: '302',
//     price: 'Rp 500.000',
//     facility: 'Wi-Fi, Private balcony, Smart TV',
//     description:
//       'A luxurious room with elegant design and premium features such as a private balcony, bathtub, seating area, and exclusive services. Often offers stunning views of the sea, garden, or city. Ideal for guests who want a more upscale stay experience.',
//   },
//   {
//     id: '#07',
//     propertyName: 'Lakeside Villa',
//     roomType: 'Deluxe',
//     roomNumber: '401',
//     price: 'Rp 500.000',
//     facility: 'Wi-Fi, Private balcony, Smart TV',
//     description:
//       'A luxurious room with elegant design and premium features such as a private balcony, bathtub, seating area, and exclusive services. Often offers stunning views of the sea, garden, or city. Ideal for guests who want a more upscale stay experience.',
//   },
//   {
//     id: '#08',
//     propertyName: 'Lakeside Villa',
//     roomType: 'Deluxe',
//     roomNumber: '402',
//     price: 'Rp 500.000',
//     facility: 'Wi-Fi, Private balcony, Smart TV',
//     description:
//       'A luxurious room with elegant design and premium features such as a private balcony, bathtub, seating area, and exclusive services. Often offers stunning views of the sea, garden, or city. Ideal for guests who want a more upscale stay experience.',
//   },
// ];

// const ITEMS_PER_PAGE = 4;

// // Type for sort fields
// type SortField =
//   | 'propertyName'
//   | 'roomType'
//   | 'roomNumber'
//   | 'price'
//   | 'facility';
// type SortDirection = 'asc' | 'desc';

// export function RoomManagementPage() {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortField, setSortField] = useState<SortField>('propertyName');
//   const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

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

//   // Filter and sort rooms
//   const filteredAndSortedRooms = allRooms
//     .filter(
//       (room) =>
//         room.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         room.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         room.price.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         room.facility.toLowerCase().includes(searchTerm.toLowerCase()),
//     )
//     .sort((a, b) => {
//       // Default string comparison
//       const valueA = a[sortField].toString().toLowerCase();
//       const valueB = b[sortField].toString().toLowerCase();

//       return sortDirection === 'asc'
//         ? valueA.localeCompare(valueB)
//         : valueB.localeCompare(valueA);
//     });

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
//                     field="propertyName"
//                     label="Property Name"
//                     className="whitespace-nowrap"
//                   />
//                   <SortableHeader
//                     field="roomType"
//                     label="Room Type"
//                     className="whitespace-nowrap"
//                   />
//                   <SortableHeader
//                     field="roomNumber"
//                     label="Room Number"
//                     className="whitespace-nowrap"
//                   />
//                   <SortableHeader
//                     field="price"
//                     label="Price"
//                     className="whitespace-nowrap"
//                   />
//                   <SortableHeader
//                     field="facility"
//                     label="Room Facility"
//                     className="whitespace-nowrap"
//                   />
//                   <TableHead className="font-semibold whitespace-nowrap">
//                     Action
//                   </TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {currentRooms.length === 0 ? (
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
//                     <TableRow key={room.id}>
//                       <TableCell className="whitespace-nowrap">
//                         {room.propertyName}
//                       </TableCell>
//                       <TableCell className="whitespace-nowrap">
//                         {room.roomType}
//                       </TableCell>
//                       <TableCell className="whitespace-nowrap">
//                         {room.roomNumber}
//                       </TableCell>
//                       <TableCell className="whitespace-nowrap">
//                         {room.price}
//                       </TableCell>
//                       <TableCell>{room.facility}</TableCell>
//                       <TableCell>
//                         <div className="flex space-x-2">
//                           <Link
//                             href={`/tenant/room-management/edit/${room.id}`}
//                             className="text-blue-600 hover:underline"
//                           >
//                             Edit
//                           </Link>
//                           <Link
//                             href={`/tenant/room-management/delete/${room.id}`}
//                             className="text-red-600 hover:underline"
//                           >
//                             Delete
//                           </Link>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </div>

//         <Pagination className="mt-4 justify-end">
//           <PaginationContent>
//             <PaginationItem>
//               <PaginationPrevious
//                 onClick={() => paginate(Math.max(1, currentPage - 1))}
//                 className={
//                   currentPage === 1 ? 'pointer-events-none opacity-50' : ''
//                 }
//                 aria-disabled={currentPage === 1}
//               />
//             </PaginationItem>

//             {pageNumbers.map((number) => (
//               <PaginationItem key={number}>
//                 <PaginationLink
//                   isActive={currentPage === number}
//                   onClick={() => paginate(number)}
//                 >
//                   {number}
//                 </PaginationLink>
//               </PaginationItem>
//             ))}

//             <PaginationItem>
//               <PaginationNext
//                 onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
//                 className={
//                   currentPage === totalPages
//                     ? 'pointer-events-none opacity-50'
//                     : ''
//                 }
//                 aria-disabled={currentPage === totalPages}
//               />
//             </PaginationItem>
//           </PaginationContent>
//         </Pagination>
//       </CardContent>
//     </Card>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
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
import { useToast } from '@/hooks/use-toast';
import {
  fetchRooms,
  deleteRoom,
  resetSuccess,
  resetError,
} from '../../store/room.slice';
import { RootState, AppDispatch } from '../../store/index';
import Link from 'next/link';

const ITEMS_PER_PAGE = 4;

// Type for sort fields
type SortField =
  | 'propertyName'
  | 'roomType'
  | 'roomNumber'
  | 'price'
  | 'facility';
type SortDirection = 'asc' | 'desc';

export function RoomManagementPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('propertyName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Get rooms from Redux store
  const { rooms, loading, error, success } = useSelector(
    (state: RootState) => state.room,
  );

  // Fetch rooms on component mount
  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  // Handle success/error states
  useEffect(() => {
    if (success) {
      toast({
        title: 'Success',
        description: 'Room operation completed successfully.',
      });
      dispatch(resetSuccess());
    }

    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
      dispatch(resetError());
    }
  }, [success, error, dispatch, toast]);

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort icon for header
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1 h-4 w-4 text-muted-foreground" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="ml-1 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4" />
    );
  };

  // Handle room deletion
  const handleDeleteRoom = (roomCode: string) => {
    if (confirm('Are you sure you want to delete this room?')) {
      dispatch(deleteRoom(roomCode));
    }
  };

  // Filter and sort rooms
  const filteredAndSortedRooms = rooms
    .filter(
      (room) =>
        room.property_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.room_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.room_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.price
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        room.facility?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      // Maps for comparison values based on fields
      const fieldMap = {
        propertyName: 'property_name',
        roomType: 'room_type',
        roomNumber: 'room_number',
        price: 'price',
        facility: 'facility',
      };

      const field = fieldMap[sortField];

      // Default string comparison
      const valueA = (a[field] || '').toString().toLowerCase();
      const valueB = (b[field] || '').toString().toLowerCase();

      return sortDirection === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });

  const totalPages = Math.ceil(filteredAndSortedRooms.length / ITEMS_PER_PAGE);

  const indexOfLastRoom = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstRoom = indexOfLastRoom - ITEMS_PER_PAGE;
  const currentRooms = filteredAndSortedRooms.slice(
    indexOfFirstRoom,
    indexOfLastRoom,
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Create sortable header
  const SortableHeader = ({ field, label, className = '' }) => (
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
    <Card className="w-full mt-14">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">Room Management</CardTitle>
            <CardDescription>
              Manage and view all your property rooms
            </CardDescription>
          </div>
          <Link href={'/tenant/room-management/register-room'}>
            <Button className="bg-cyan-500 hover:bg-cyan-600">
              <Plus className="mr-2 h-4 w-4" /> Create New Room
            </Button>
          </Link>
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
                    field="propertyName"
                    label="Property Name"
                    className="whitespace-nowrap"
                  />
                  <SortableHeader
                    field="roomType"
                    label="Room Type"
                    className="whitespace-nowrap"
                  />
                  <SortableHeader
                    field="roomNumber"
                    label="Room Number"
                    className="whitespace-nowrap"
                  />
                  <SortableHeader
                    field="price"
                    label="Price"
                    className="whitespace-nowrap"
                  />
                  <SortableHeader
                    field="facility"
                    label="Room Facility"
                    className="whitespace-nowrap"
                  />
                  <TableHead className="font-semibold whitespace-nowrap">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Loading rooms...
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
                    <TableRow key={room.room_type_code || room.id}>
                      <TableCell className="whitespace-nowrap">
                        {room.property_name}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {room.room_type}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {room.room_number}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {room.price}
                      </TableCell>
                      <TableCell>{room.facility}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link
                            href={`/tenant/room-management/edit/${room.room_type_code || room.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() =>
                              handleDeleteRoom(room.room_type_code || room.id)
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

        {totalPages > 1 && (
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
    </Card>
  );
}
