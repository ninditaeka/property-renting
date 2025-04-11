'use client';

import { useState } from 'react';
import { Search, Plus, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
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
import { ConfigurationRateDialog } from '@/components/Dashboard/ConfigureRateDialog';
// Update the allPrice data structure to include the new fields
const allPrice = [
  {
    id: '#01',
    propertyName: 'Property A',
    nameOfSale: 'Summer Sale',
    roomType: 'Deluxe',
    roomNumber: '101',
    startDate: '15 March 2025',
    endDate: '17 March 2025',
    discountType: 'Percentage',
    discountValue: '10%',
    basePrice: 'Rp 1.500.000',
    finalPrice: 'Rp 1.350.000',
    status: 'active',
  },
  {
    id: '#02',
    propertyName: 'Property B',
    nameOfSale: 'Summer Sale',
    roomType: 'Superior',
    roomNumber: '202',
    startDate: '01 March 2025',
    endDate: '03 March 2025',
    discountType: 'Nominal',
    discountValue: 'Rp 200.000',
    basePrice: 'Rp 2.500.000',
    finalPrice: 'Rp 2.300.000',
    status: 'disactive',
  },
  {
    id: '#03',
    propertyName: 'Property A',
    nameOfSale: 'Summer Sale',
    roomType: 'Standart',
    roomNumber: '105',
    startDate: '21 March 2025',
    endDate: '25 March 2025',
    discountType: 'Percentage',
    discountValue: '15%',
    basePrice: 'Rp 700.000',
    finalPrice: 'Rp 595.000',
    status: 'active',
  },
  {
    id: '#04',
    propertyName: 'Property C',
    nameOfSale: 'Summer Sale',
    roomType: 'Superior',
    roomNumber: '301',
    startDate: '09 April 2025',
    endDate: '12 April 2025',
    discountType: 'Nominal',
    discountValue: 'Rp 100.000',
    basePrice: 'Rp 800.000',
    finalPrice: 'Rp 700.000',
    status: 'active',
  },
  {
    id: '#05',
    propertyName: 'Property B',
    nameOfSale: 'Summer Sale',
    roomType: 'Standart',
    roomNumber: '205',
    startDate: '20 April 2025',
    endDate: '21 April 2025',
    discountType: 'Percentage',
    discountValue: '5%',
    basePrice: 'Rp 750.000',
    finalPrice: 'Rp 712.500',
    status: 'active',
  },
  {
    id: '#06',
    propertyName: 'Property C',
    nameOfSale: 'Summer Sale',
    roomType: 'Two Rooms',
    roomNumber: '310',
    startDate: '15 May 2025',
    endDate: '17 May 2025',
    discountType: 'Nominal',
    discountValue: 'Rp 90.000',
    basePrice: 'Rp 890.000',
    finalPrice: 'Rp 800.000',
    status: 'active',
  },
  {
    id: '#07',
    propertyName: 'Property A',
    nameOfSale: 'Summer Sale',
    roomType: 'Deluxe',
    roomNumber: '110',
    startDate: '15 March 2025',
    endDate: '17 March 2025',
    discountType: 'Percentage',
    discountValue: '20%',
    basePrice: 'Rp 950.000',
    finalPrice: 'Rp 760.000',
    status: 'active',
  },
  {
    id: '#08',
    propertyName: 'Property B',
    nameOfSale: 'Summer Sale',
    roomType: 'Deluxe',
    roomNumber: '210',
    startDate: '15 March 2025',
    endDate: '17 March 2025',
    discountType: 'Nominal',
    discountValue: 'Rp 50.000',
    basePrice: 'Rp 650.000',
    finalPrice: 'Rp 600.000',
    status: 'active',
  },
];

// Update the SortField type to include the new fields
type SortField =
  | 'id'
  | 'propertyName'
  | 'roomType'
  | 'roomNumber'
  | 'startDate'
  | 'endDate'
  | 'basePrice'
  | 'finalPrice'
  | 'status'
  | 'nameOfSale';

type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 5;

export default function PriceManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

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

  // Filter and sort prices
  const filteredAndSortedPrices = allPrice
    .filter(
      (price) =>
        price.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        price.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        price.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        price.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        price.finalPrice.toLowerCase().includes(searchTerm.toLowerCase()) ||
        price.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        price.nameOfSale.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      // Default string comparison
      const valueA = a[sortField].toString().toLowerCase();
      const valueB = b[sortField].toString().toLowerCase();

      return sortDirection === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });

  const totalPages = Math.ceil(filteredAndSortedPrices.length / ITEMS_PER_PAGE);

  const indexOfLastPrice = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstPrice = indexOfLastPrice - ITEMS_PER_PAGE;
  const currentPrices = filteredAndSortedPrices.slice(
    indexOfFirstPrice,
    indexOfLastPrice,
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

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
    <Card className="w-full mt-14">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">Price Management</CardTitle>
            <CardDescription>
              Manage and view all your property prices
            </CardDescription>
          </div>
          <Button
            className="bg-cyan-500 hover:bg-cyan-600"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Activate Rate
          </Button>
        </div>
        <div className="mt-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search prices..."
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
                    field="nameOfSale"
                    label="Name of Sale"
                    className="w-[150px] whitespace-nowrap"
                  />
                  <SortableHeader
                    field="propertyName"
                    label="Property Name"
                    className="w-[150px] whitespace-nowrap"
                  />
                  <SortableHeader
                    field="roomType"
                    label="Room Type"
                    className="w-[150px] whitespace-nowrap"
                  />
                  <SortableHeader
                    field="roomNumber"
                    label="Room Number"
                    className="w-[120px] whitespace-nowrap"
                  />
                  <SortableHeader field="startDate" label="Start Date" />
                  <SortableHeader field="endDate" label="End Date" />
                  <SortableHeader field="finalPrice" label="Final Price" />
                  <SortableHeader field="status" label="Status" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPrices.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No prices found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentPrices.map((price) => (
                    <TableRow key={price.id}>
                      <TableCell>{price.nameOfSale}</TableCell>
                      <TableCell>{price.propertyName}</TableCell>
                      <TableCell>{price.roomType}</TableCell>
                      <TableCell>{price.roomNumber}</TableCell>
                      <TableCell>{price.startDate}</TableCell>
                      <TableCell>{price.endDate}</TableCell>
                      <TableCell>{price.finalPrice}</TableCell>
                      <TableCell>{price.status}</TableCell>
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
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
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

      {/* Configuration Rate Dialog */}
      <ConfigurationRateDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </Card>
  );
}
