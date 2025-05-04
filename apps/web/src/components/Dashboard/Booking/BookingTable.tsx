'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChevronDown, ChevronUp } from 'lucide-react';

import type { Booking, SortState } from '../../../../types/booking.type';

interface BookingTableProps {
  bookings: Booking[];
  sortState: SortState;
  handleSort: (column: keyof Booking) => void;
}

export function BookingTable({
  bookings,
  sortState,
  handleSort,
}: BookingTableProps) {
  return (
    <div className="rounded-md border shadow">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead
                className="w-[120px] font-semibold cursor-pointer whitespace-nowrap"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center gap-1">
                  ID Booking
                  {sortState.column === 'id' &&
                    (sortState.direction === 'asc' ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : sortState.direction === 'desc' ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : null)}
                </div>
              </TableHead>
              <TableHead
                className="font-semibold cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  Name
                  {sortState.column === 'name' &&
                    (sortState.direction === 'asc' ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : sortState.direction === 'desc' ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : null)}
                </div>
              </TableHead>
              <TableHead
                className="font-semibold cursor-pointer"
                onClick={() => handleSort('property')}
              >
                <div className="flex items-center gap-1">
                  Property name
                  {sortState.column === 'property' &&
                    (sortState.direction === 'asc' ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : sortState.direction === 'desc' ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : null)}
                </div>
              </TableHead>
              <TableHead
                className="font-semibold cursor-pointer"
                onClick={() => handleSort('checkIn')}
              >
                <div className="flex items-center gap-1">
                  Check in
                  {sortState.column === 'checkIn' &&
                    (sortState.direction === 'asc' ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : sortState.direction === 'desc' ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : null)}
                </div>
              </TableHead>
              <TableHead
                className="font-semibold cursor-pointer"
                onClick={() => handleSort('checkOut')}
              >
                <div className="flex items-center gap-1">
                  Check out
                  {sortState.column === 'checkOut' &&
                    (sortState.direction === 'asc' ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : sortState.direction === 'desc' ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : null)}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>{booking.name}</TableCell>
                  <TableCell>{booking.property}</TableCell>
                  <TableCell>{booking.checkIn}</TableCell>
                  <TableCell>{booking.checkOut}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
