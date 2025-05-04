'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BookingFilters } from '.././Dashboard/Booking/BookingFillters';
import { BookingTable } from '.././Dashboard/Booking/BookingTable';
import { BookingPagination } from '.././Dashboard/Booking/BookingPagination';
import {
  allBookings,
  type Booking,
  type SortState,
  type FilterState,
  type DateRangeState,
} from '../../../types/booking.type';
import {
  filterAndSortBookings,
  generatePageNumbers,
  getUniqueValues,
} from '../../lib/booking-utils';

export function BookingListPage() {
  // Pagination state
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Sorting state
  const [sortState, setSortState] = useState<SortState>({
    column: null,
    direction: null,
  });

  // Filtering state
  const [filters, setFilters] = useState<FilterState>({
    name: null,
    property: null,
  });

  // Date range state
  const [dateRange, setDateRange] = useState<DateRangeState>({
    from: null,
    to: null,
  });

  // Reset current page when search, sort, or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortState, filters, dateRange, itemsPerPage]);

  // Get unique values for filters
  const uniqueNames = getUniqueValues(allBookings, 'name') as string[];
  const uniqueProperties = getUniqueValues(allBookings, 'property') as string[];

  // Handle sorting
  const handleSort = (column: keyof Booking) => {
    setSortState((prev) => ({
      column,
      direction:
        prev.column === column
          ? prev.direction === 'asc'
            ? 'desc'
            : prev.direction === 'desc'
              ? null
              : 'asc'
          : 'asc',
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setFilters({ name: null, property: null });
    setDateRange({ from: null, to: null });
    setSortState({ column: null, direction: null });
  };

  // Filter and sort bookings
  const filteredAndSortedBookings = filterAndSortBookings(
    allBookings,
    searchTerm,
    filters,
    dateRange,
    sortState,
  );

  // Calculate pagination
  const totalItems = filteredAndSortedBookings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSortedBookings.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  // Generate page numbers for pagination
  const pageNumbers = generatePageNumbers(currentPage, totalPages);

  return (
    <Card className="w-full mt-20">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Booking List</CardTitle>
        <CardDescription>
          Manage and view all your property bookings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters */}
        <BookingFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
          dateRange={dateRange}
          setDateRange={setDateRange}
          uniqueNames={uniqueNames}
          uniqueProperties={uniqueProperties}
          clearAllFilters={clearAllFilters}
        />

        {/* Table */}
        <BookingTable
          bookings={currentItems}
          sortState={sortState}
          handleSort={handleSort}
        />

        {/* Pagination */}
        <BookingPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          totalItems={totalItems}
          pageNumbers={pageNumbers}
          indexOfFirstItem={indexOfFirstItem}
          indexOfLastItem={indexOfLastItem}
        />
      </CardContent>
    </Card>
  );
}
