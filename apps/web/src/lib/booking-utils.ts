import { parse, isWithinInterval } from 'date-fns';
import type {
  Booking,
  SortState,
  FilterState,
  DateRangeState,
} from '../../types/booking.type';

// Parse date string to Date object
export const parseDate = (dateString: string) => {
  return parse(dateString, 'd MMMM yyyy', new Date());
};

// Helper to safely convert values to string for comparison
const safeToString = (value: any): string => {
  if (value === null || value === undefined) return '';
  return String(value).toLowerCase();
};

export const filterAndSortBookings = (
  bookings: Booking[] | undefined,
  searchTerm: string,
  filters: FilterState,
  dateRange: DateRangeState,
  sortState: SortState,
): Booking[] => {
  // Return an empty array if bookings is undefined or null
  if (!bookings) return [];

  return (
    bookings
      .filter((booking) => {
        // Search filter
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          return (
            safeToString(booking.id).includes(searchLower) ||
            safeToString(booking.full_name).includes(searchLower) ||
            safeToString(booking.property_id).includes(searchLower) ||
            safeToString(booking['check-in']).includes(searchLower) ||
            safeToString(booking['check-out']).includes(searchLower)
          );
        }
        return true;
      })
      // ... rest of your function remains the same
      .filter((booking) => {
        // Name filter
        if (filters.name) {
          return booking.full_name === filters.name;
        }
        return true;
      })
      .filter((booking) => {
        // Property filter
        if (filters.property) {
          return String(booking.property_id) === filters.property;
        }
        return true;
      })
      .filter((booking) => {
        // Date range filter
        if (dateRange.from && dateRange.to) {
          const checkInDate = parseDate(booking['check-in']);
          const checkOutDate = parseDate(booking['check-out']);

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

          if (column === 'check-in' || column === 'check-out') {
            const dateA = parseDate(a[column]);
            const dateB = parseDate(b[column]);
            return direction === 'asc'
              ? dateA.getTime() - dateB.getTime()
              : dateB.getTime() - dateA.getTime();
          }

          // Handle numeric columns
          if (typeof a[column] === 'number' && typeof b[column] === 'number') {
            return direction === 'asc'
              ? (a[column] as number) - (b[column] as number)
              : (b[column] as number) - (a[column] as number);
          }

          // Handle string columns
          const valueA = safeToString(a[column]);
          const valueB = safeToString(b[column]);

          if (direction === 'asc') {
            return valueA.localeCompare(valueB);
          } else {
            return valueB.localeCompare(valueA);
          }
        }
        return 0;
      })
  );
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

// Update the function to accept potentially undefined bookings
export const getUniqueValues = (
  bookings: Booking[] | undefined,
  field: keyof Booking,
) => {
  // Return an empty array if bookings is undefined or null
  if (!bookings) return [];

  // Only run the map function if bookings exists
  return Array.from(new Set(bookings.map((booking) => booking[field])));
};
