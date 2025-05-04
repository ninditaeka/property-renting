import { parse, isWithinInterval } from 'date-fns';
import type {
  Booking,
  SortState,
  FilterState,
  DateRangeState,
} from '../types/booking.type';

// Parse date string to Date object
export const parseDate = (dateString: string) => {
  return parse(dateString, 'd MMMM yyyy', new Date());
};

// Filter and sort bookings
export const filterAndSortBookings = (
  bookings: Booking[],
  searchTerm: string,
  filters: FilterState,
  dateRange: DateRangeState,
  sortState: SortState,
): Booking[] => {
  return bookings
    .filter((booking) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          booking.id.toLowerCase().includes(searchLower) ||
          booking.name.toLowerCase().includes(searchLower) ||
          booking.property.toLowerCase().includes(searchLower) ||
          booking.checkIn.toLowerCase().includes(searchLower) ||
          booking.checkOut.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .filter((booking) => {
      // Name filter
      if (filters.name) {
        return booking.name === filters.name;
      }
      return true;
    })
    .filter((booking) => {
      // Property filter
      if (filters.property) {
        return booking.property === filters.property;
      }
      return true;
    })
    .filter((booking) => {
      // Date range filter
      if (dateRange.from && dateRange.to) {
        const checkInDate = parseDate(booking.checkIn);
        const checkOutDate = parseDate(booking.checkOut);

        // Check if either check-in or check-out date falls within the selected range
        return (
          isWithinInterval(checkInDate, {
            start: dateRange.from,
            end: dateRange.to,
          }) ||
          isWithinInterval(checkOutDate, {
            start: dateRange.from,
            end: dateRange.to,
          }) ||
          (checkInDate <= dateRange.from && checkOutDate >= dateRange.to)
        );
      }
      return true;
    })
    .sort((a, b) => {
      // Sorting
      if (sortState.column && sortState.direction) {
        const column = sortState.column;
        const direction = sortState.direction;

        if (column === 'checkIn' || column === 'checkOut') {
          const dateA = parseDate(a[column]);
          const dateB = parseDate(b[column]);
          return direction === 'asc'
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        }

        const valueA = a[column].toLowerCase();
        const valueB = b[column].toLowerCase();

        if (direction === 'asc') {
          return valueA.localeCompare(valueB);
        } else {
          return valueB.localeCompare(valueA);
        }
      }
      return 0;
    });
};

// Generate page numbers for pagination
export const generatePageNumbers = (
  currentPage: number,
  totalPages: number,
) => {
  const pageNumbers = [];
  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    // Show all pages if total pages are less than max visible
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // Always show first page
    pageNumbers.push(1);

    // Calculate start and end of middle pages
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Adjust if we're near the beginning
    if (currentPage <= 3) {
      endPage = Math.min(totalPages - 1, 4);
    }

    // Adjust if we're near the end
    if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - 3);
    }

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pageNumbers.push('ellipsis-start');
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pageNumbers.push('ellipsis-end');
    }

    // Always show last page
    pageNumbers.push(totalPages);
  }

  return pageNumbers;
};

// Get unique values for filters
export const getUniqueValues = (bookings: Booking[], field: keyof Booking) => {
  return Array.from(new Set(bookings.map((booking) => booking[field])));
};
