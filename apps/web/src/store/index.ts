import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import authReducer from './authSlice';
import propertyCategoryReducer from './propertyCategory.slice';
import propertyListReducer from './propertyList.slice';
import propertyFacilitiesReducer from './propertyfacility.slice';
import PropertyDetailReducer from './propertyDetail.slice';
import roomReducer from './room.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    propertyCategories: propertyCategoryReducer,
    propertyList: propertyListReducer,
    propertyFacilities: propertyFacilitiesReducer,
    propertyDetail: PropertyDetailReducer,
    room: roomReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hooks untuk type-safe Redux
export const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useAppSelector = useSelector;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
