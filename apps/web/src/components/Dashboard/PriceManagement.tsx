'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { fetchPriceManagement } from '../../store/tenant.slice';
import { AppDispatch, RootState } from '@/store';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  PriceManagementItem,
  PriceManagementQueryParams,
} from '../../../types/tenant.type';

// Interface for processed price data with additional fields
interface ProcessedPriceItem extends Omit<PriceManagementItem, 'end_date'> {
  status: 'Active' | 'Inactive';
  displayStartDate: string;
  displayEndDate: string;
  end_date: string | null;
}

// Type for sort fields
type SortField =
  | 'price_id'
  | 'property_name'
  | 'room_type_name'
  | 'room_number'
  | 'start_date'
  | 'end_date'
  | 'base_price'
  | 'final_price'
  | 'status'
  | 'name_of_sale';

type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 5;

export default function PriceManagementPage() {
  const dispatch = useDispatch<AppDispatch>();
  const priceData = useSelector(
    (state: RootState) => state.tenant.priceManagement.items,
  );
  const loading = useSelector(
    (state: RootState) => state.tenant.priceManagement.isLoading,
  );

  // Get price season status to detect when a new price is added
  const priceSeasonStatus = useSelector(
    (state: RootState) => state.priceSeason.status,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('price_id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filters, setFilters] = useState<PriceManagementQueryParams>({});
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState<number>(
    Date.now(),
  );

  // Fetch price management data on component mount and when dependencies change
  useEffect(() => {
    dispatch(fetchPriceManagement(filters));
  }, [dispatch, filters, lastUpdateTimestamp]);

  // Watch for price season status changes to refresh data
  useEffect(() => {
    if (priceSeasonStatus === 'succeeded') {
      // Trigger data refresh by updating the timestamp
      setLastUpdateTimestamp(Date.now());
    }
  }, [priceSeasonStatus]);

  // Handle dialog close event
  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);

    // If dialog is closing, refresh the data
    if (!open) {
      setLastUpdateTimestamp(Date.now());
    }
  };

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

  // Format date for display
  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) {
      return 'No End Date';
    }

    try {
      // Check if the date string is in the format "DD Month YYYY"
      if (/^\d{2} [A-Za-z]+ \d{4}$/.test(dateStr)) {
        return dateStr;
      }
      // Otherwise, assume it's an ISO date and format it
      return format(parseISO(dateStr), 'dd MMMM yyyy');
    } catch (error) {
      return dateStr; // Return the original string if parsing fails
    }
  };

  // Determine if a price is active based on date
  const isActivePrice = (
    startDate: string,
    endDate: string | null,
  ): boolean => {
    const today = new Date();
    try {
      let start: Date;

      // Handle both date formats (from mock data and API)
      if (/^\d{2} [A-Za-z]+ \d{4}$/.test(startDate)) {
        // Parse "DD Month YYYY" format
        start = new Date(startDate);
      } else {
        // Parse ISO format
        start = parseISO(startDate);
      }

      // If endDate is null, consider it as far in the future
      if (!endDate) {
        return today >= start;
      }

      let end: Date;
      if (/^\d{2} [A-Za-z]+ \d{4}$/.test(endDate)) {
        end = new Date(endDate);
      } else {
        end = parseISO(endDate);
      }

      // Set times to start of day to avoid time-of-day comparison issues
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999); // End of day for end date

      // A price is active if today is on or after the start date AND on or before the end date
      return today >= start && today <= end;
    } catch (error) {
      console.error('Date parsing error:', error);
      return false;
    }
  };

  // Process and transform the data
  const processedPriceData: ProcessedPriceItem[] = priceData.map(
    (item: PriceManagementItem) => {
      // Determine if the price is active based on dates
      const active = isActivePrice(item.start_date, item.end_date);

      return {
        ...item,
        status: active ? 'Active' : 'Inactive',
        // Format dates for display if they're ISO dates
        displayStartDate: formatDate(item.start_date),
        displayEndDate: formatDate(item.end_date),
      };
    },
  );

  // Filter and sort prices
  const filteredAndSortedPrices = processedPriceData
    .filter((price) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        price.price_id.toString().toLowerCase().includes(searchTermLower) ||
        price.property_name.toLowerCase().includes(searchTermLower) ||
        price.room_type_name.toLowerCase().includes(searchTermLower) ||
        price.room_number.toLowerCase().includes(searchTermLower) ||
        price.final_price.toString().toLowerCase().includes(searchTermLower) ||
        price.status.toLowerCase().includes(searchTermLower) ||
        price.name_of_sale.toLowerCase().includes(searchTermLower)
      );
    })
    .sort((a, b) => {
      // Get values for comparison, safely handle different types
      const valueA = String(a[sortField] || '').toLowerCase();
      const valueB = String(b[sortField] || '').toLowerCase();

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
                    field="name_of_sale"
                    label="Name of Sale"
                    className="w-[150px] whitespace-nowrap"
                  />
                  <SortableHeader
                    field="property_name"
                    label="Property Name"
                    className="w-[150px] whitespace-nowrap"
                  />
                  <SortableHeader
                    field="room_type_name"
                    label="Room Type"
                    className="w-[150px] whitespace-nowrap"
                  />
                  <SortableHeader
                    field="room_number"
                    label="Room Number"
                    className="w-[120px] whitespace-nowrap"
                  />
                  <SortableHeader field="start_date" label="Start Date" />
                  <SortableHeader field="end_date" label="End Date" />
                  <SortableHeader field="final_price" label="Final Price" />
                  <SortableHeader field="status" label="Status" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Loading price data...
                    </TableCell>
                  </TableRow>
                ) : currentPrices.length === 0 ? (
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
                    <TableRow key={price.price_id}>
                      <TableCell>{price.name_of_sale}</TableCell>
                      <TableCell>{price.property_name}</TableCell>
                      <TableCell>{price.room_type_name}</TableCell>
                      <TableCell>{price.room_number}</TableCell>
                      <TableCell>{price.displayStartDate}</TableCell>
                      <TableCell>{price.displayEndDate}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0,
                        }).format(price.final_price)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'px-2 py-1 rounded-full text-xs font-semibold',
                            price.status === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800',
                          )}
                        >
                          {price.status}
                        </span>
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
      <ConfigurationRateDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
      />
    </Card>
  );
}
