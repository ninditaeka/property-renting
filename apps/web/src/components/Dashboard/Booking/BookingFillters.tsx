'use client';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Search, Filter, X } from 'lucide-react';
import type {
  FilterState,
  DateRangeState,
} from '../../../../types/booking.type';

interface BookingFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: FilterState;
  setFilters: (filters: (prevFilters: FilterState) => FilterState) => void;
  dateRange: DateRangeState;
  setDateRange: (
    dateRange: (prevDateRange: DateRangeState) => DateRangeState,
  ) => void;
  uniqueNames: string[];
  uniqueProperties: string[];
  clearAllFilters: () => void;
}

export function BookingFilters({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  dateRange,
  setDateRange,
  uniqueNames,
  uniqueProperties,
  clearAllFilters,
}: BookingFiltersProps) {
  // Check if any filters are active
  const hasActiveFilters =
    searchTerm !== '' ||
    filters.name !== null ||
    filters.property !== null ||
    dateRange.from !== null ||
    dateRange.to !== null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <CalendarIcon className="h-4 w-4" />
              {dateRange.from && dateRange.to ? (
                <span>
                  {format(dateRange.from, 'PP')} - {format(dateRange.to, 'PP')}
                </span>
              ) : (
                <span>Date Range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="range"
              selected={{
                from: dateRange.from || undefined,
                to: dateRange.to || undefined,
              }}
              onSelect={(range) =>
                setDateRange((prev) => ({
                  from: range?.from || null,
                  to: range?.to || null,
                }))
              }
              initialFocus
            />
            <div className="flex items-center justify-between p-3 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDateRange(() => ({ from: null, to: null }))}
              >
                Clear
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  // Close popover by clicking outside
                  document.body.click();
                }}
              >
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                Name
              </DropdownMenuLabel>
              {uniqueNames.map((name) => (
                <DropdownMenuItem
                  key={name}
                  onClick={() => setFilters((prev) => ({ ...prev, name }))}
                  className={filters.name === name ? 'bg-accent' : ''}
                >
                  {name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                Property
              </DropdownMenuLabel>
              {uniqueProperties.map((property) => (
                <DropdownMenuItem
                  key={property}
                  onClick={() => setFilters((prev) => ({ ...prev, property }))}
                  className={filters.property === property ? 'bg-accent' : ''}
                >
                  {property}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center"
              onClick={() => setFilters(() => ({ name: null, property: null }))}
            >
              Clear Filters
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search Input */}
        <div className="relative ">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-8 w-[200px] md:w-[250px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Clear All Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearAllFilters}
            title="Clear all filters"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Search: {searchTerm}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setSearchTerm('')}
              />
            </Badge>
          )}
          {filters.name && (
            <Badge variant="secondary" className="gap-1">
              Name: {filters.name}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setFilters((prev) => ({ ...prev, name: null }))}
              />
            </Badge>
          )}
          {filters.property && (
            <Badge variant="secondary" className="gap-1">
              Property: {filters.property}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, property: null }))
                }
              />
            </Badge>
          )}
          {dateRange.from && dateRange.to && (
            <Badge variant="secondary" className="gap-1">
              Date: {format(dateRange.from, 'PP')} -{' '}
              {format(dateRange.to, 'PP')}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setDateRange(() => ({ from: null, to: null }))}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
