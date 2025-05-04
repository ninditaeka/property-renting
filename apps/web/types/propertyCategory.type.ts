export interface PropertyCategory {
  id?: number;
  property_category_name: string;
  property_category_code?: string;
  description: string;
  created_by?: number;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted?: boolean;
}

export interface PropertyCategoriesResponse {
  status: string;
  message: string;
  data: PropertyCategory[];
}
// Interface for API responses
export interface ApiResponse<T> {
  status: string;
  message: string;
  data?: T;
  error?: string;
}

export interface PropertyCategoryState {
  propertyCategories: PropertyCategory[];
  currentPropertyCategory: PropertyCategory | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Initial state
const initialState: PropertyCategoryState = {
  propertyCategories: [],
  currentPropertyCategory: null,
  loading: false,
  error: null,
  success: false,
};
