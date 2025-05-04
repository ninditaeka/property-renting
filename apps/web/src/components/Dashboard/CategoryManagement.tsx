'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { useAppDispatch, useAppSelector, RootState } from '../../store';
import {
  fetchPropertyCategories,
  createPropertyCategory,
  updatePropertyCategory,
  deletePropertyCategory,
  resetSuccess,
  resetError,
} from '../../store/propertyCategory.slice';

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

import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import {
  PropertyCategory,
  PropertyCategoryState,
} from '../../../types/propertyCategory.type';

// Form validation schema
const categoryFormSchema = z.object({
  property_category_name: z.string().min(2, {
    message: 'Category name must be at least 2 characters.',
  }),
  property_category_description: z.string().min(5, {
    message: 'Description must be at least 5 characters.',
  }),
});

// Define type for form values
type CategoryFormValues = z.infer<typeof categoryFormSchema>;

// Type for sort fields
type SortField =
  | 'id'
  | 'property_category_name'
  | 'property_category_description';
type SortDirection = 'asc' | 'desc';

// Define type for Redux state

const ITEMS_PER_PAGE = 4;

export function CategoryManagementPage() {
  const { toast } = useToast();

  // Redux hooks with proper type
  const dispatch = useAppDispatch();
  const { propertyCategories, loading, error, success } = useAppSelector(
    (state: RootState) => state.propertyCategories,
  );

  // Local state
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [editingCategory, setEditingCategory] =
    useState<PropertyCategory | null>(null);
  const [deletingCategory, setDeletingCategory] =
    useState<PropertyCategory | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Create form
  const createForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      property_category_name: '',
      property_category_description: '',
    },
  });

  // Edit form
  const editForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      property_category_name: '',
      property_category_description: '',
    },
  });

  // Fetch categories on component mount and when forceUpdate changes
  useEffect(() => {
    dispatch(fetchPropertyCategories());
  }, [dispatch, forceUpdate]);

  // Handle success and error states
  useEffect(() => {
    if (success) {
      toast({
        title: 'Success',
        description: 'Operation completed successfully',
      });
      dispatch(resetSuccess());

      // Close all dialogs
      setIsCreateDialogOpen(false);
      setIsEditDialogOpen(false);
      setIsDeleteDialogOpen(false);

      // Reset forms
      createForm.reset();
      editForm.reset();

      // Force a refresh of the data
      setForceUpdate((prev) => prev + 1);
    }

    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
      dispatch(resetError());
    }
  }, [success, error, dispatch, createForm, editForm, toast]);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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

  // Filter and sort categories
  const filteredAndSortedCategories = propertyCategories
    .filter((category: PropertyCategory) => {
      const searchTermLower = searchTerm.toLowerCase();
      const categoryId = category.id?.toString() || '';
      const categoryCode = category.property_category_code?.toString() || '';
      const categoryName = category.property_category_name?.toLowerCase() || '';
      const categoryDesc = category.description?.toLowerCase() || '';

      return (
        categoryId.includes(searchTermLower) ||
        categoryCode.includes(searchTermLower) ||
        categoryName.includes(searchTermLower) ||
        categoryDesc.includes(searchTermLower)
      );
    })
    .sort((a: PropertyCategory, b: PropertyCategory) => {
      if (sortField === 'id') {
        // Add null checks for id property
        const idA = a.id ?? 0; // Use nullish coalescing
        const idB = b.id ?? 0;
        return sortDirection === 'asc' ? idA - idB : idB - idA;
      } else {
        const fieldA =
          sortField === 'property_category_name'
            ? a.property_category_name
            : a.description;

        const fieldB =
          sortField === 'property_category_name'
            ? b.property_category_name
            : b.description;

        const valueA = (fieldA || '').toLowerCase();
        const valueB = (fieldB || '').toLowerCase();

        return sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
    });

  const totalPages = Math.ceil(
    filteredAndSortedCategories.length / ITEMS_PER_PAGE,
  );

  // Reset to first page when search or sort changes or if the current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages, filteredAndSortedCategories.length]);

  const indexOfLastCategory = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstCategory = indexOfLastCategory - ITEMS_PER_PAGE;
  const currentCategories = filteredAndSortedCategories.slice(
    indexOfFirstCategory,
    indexOfLastCategory,
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const pageNumbers: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Handle create form submission
  const handleCreateCategory = (values: CategoryFormValues) => {
    const newCategory: Omit<PropertyCategory, 'id'> = {
      property_category_name: values.property_category_name,
      description: values.property_category_description,
    };

    dispatch(createPropertyCategory(newCategory));
  };

  // Handle edit category click
  const handleEditClick = (category: PropertyCategory) => {
    setEditingCategory(category);
    editForm.reset({
      property_category_name: category.property_category_name || '',
      property_category_description: category.description || '',
    });
    setIsEditDialogOpen(true);
  };

  // Handle edit form submission
  const handleSaveEdit = async (values: CategoryFormValues) => {
    if (!editingCategory || !editingCategory.property_category_code) return;

    // Ensure consistent type conversion
    const code = String(editingCategory.property_category_code);
    console.log(`Updating category with code: ${code}`);

    try {
      await dispatch(
        updatePropertyCategory({
          code,
          data: {
            property_category_name: values.property_category_name,
            description: values.property_category_description,
          },
        }),
      ).unwrap();
    } catch (error) {
      console.error(
        'Update failed:',
        error instanceof Error ? error.message : String(error),
      );
    }
  };

  // Handle delete click
  const handleDeleteClick = (category: PropertyCategory) => {
    if (!category || !category.property_category_code) return;
    setDeletingCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingCategory && deletingCategory.property_category_code) {
      const code = String(deletingCategory.property_category_code);

      try {
        await dispatch(deletePropertyCategory(code)).unwrap();

        // Close dialog and reset state
        setIsDeleteDialogOpen(false);
        setDeletingCategory(null);

        // Important: Force data refresh after successful deletion
        dispatch(fetchPropertyCategories());

        toast({
          title: 'Success',
          description: 'Category deleted successfully',
        });
      } catch (error) {
        console.error(
          'Delete failed:',
          error instanceof Error ? error.message : String(error),
        );
        toast({
          title: 'Error',
          description: 'Failed to delete category',
          variant: 'destructive',
        });
      }
    }
  };
  // Create sortable header component
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

  // Debug log
  useEffect(() => {
    console.log('PropertyCategories length:', propertyCategories.length);
    console.log('Current page items:', currentCategories.length);
  }, [propertyCategories.length, currentCategories.length]);

  return (
    <Card className="w-full mt-14">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">
              Property Category Management
            </CardTitle>
            <CardDescription>
              Manage and view all your property categories
            </CardDescription>
          </div>
          <Button
            className="bg-cyan-500 hover:bg-cyan-600"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> New Category
          </Button>
        </div>
        <div className="mt-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search categories..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="text-center py-4">Loading categories...</div>
        )}

        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <SortableHeader field="id" label="ID" className="w-[100px]" />
                  <SortableHeader
                    field="property_category_name"
                    label="Category Name"
                    className="whitespace-nowrap"
                  />
                  <SortableHeader
                    field="property_category_description"
                    label="Description"
                  />
                  <TableHead className="font-semibold text-center">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCategories.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {loading
                        ? 'Loading...'
                        : 'No categories found matching your search.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  currentCategories.map(
                    (category: PropertyCategory, index: number) => (
                      <TableRow
                        key={`category-${forceUpdate}-${category.property_category_code}-${index}`}
                      >
                        <TableCell className="font-medium">
                          {category.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{category.property_category_name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <div className="truncate">{category.description}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            onClick={() => handleEditClick(category)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            onClick={() => handleDeleteClick(category)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ),
                  )
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

      {/* Create Category Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
          </DialogHeader>
          <Form {...createForm}>
            <form
              onSubmit={createForm.handleSubmit(handleCreateCategory)}
              className="space-y-4 py-2"
            >
              <FormField
                control={createForm.control}
                name="property_category_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="property_category_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter category description"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="sm:justify-end mt-4">
                <DialogClose asChild>
                  <Button variant="outline" className="mr-2" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-900"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Category'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(handleSaveEdit)}
              className="space-y-4 py-2"
            >
              <FormField
                control={editForm.control}
                name="property_category_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="property_category_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter category description"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="sm:justify-end mt-4">
                <DialogClose asChild>
                  <Button variant="outline" className="mr-2" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-900"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete this category? This action cannot
              be undone.
            </p>
            {deletingCategory && (
              <p className="mt-2 font-medium">
                Category: {deletingCategory.property_category_name}
              </p>
            )}
          </div>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button variant="outline" className="mr-2">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
