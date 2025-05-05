'use client';
import axios from 'axios';
import {
  RegistrationCustomer,
  RegistrationTenant,
  RegistrationRequest,
  LoginCredentials,
  User,
  AuthResponse,
} from '../../types/auth.type';

import Cookies from 'js-cookie';

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000';

// Helper function to safely access window object
const isBrowser = typeof window !== 'undefined';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(
        `${BASE_URL}/auth/login`,
        credentials,
      );

      if (response.status === 200) {
        const { id, name, email, role } = response.data.user;
        Cookies.set('token', response.data.token, {
          expires: 7, // 7 days expiration
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });

        Cookies.set(
          'user',
          JSON.stringify({
            id,
            name,
            email,
            role,
          }),
          {
            expires: 7, // 7 days expiration
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
          },
        );
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data?.message || 'Failed Login';
      }
      throw new Error('Failed Login');
    }
  },

  logout(): void {
    // Updated to use cookies instead of localStorage for consistency
    Cookies.remove('token');
    Cookies.remove('user');
  },

  // Function to check current user
  getCurrentUser(): User | null {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      try {
        return JSON.parse(userCookie) as User;
      } catch {
        return null;
      }
    }
    return null;
  },
};

export function getAuthenticatedUser() {
  const token = Cookies.get('token');
  const userCookie = Cookies.get('user');

  if (token && userCookie) {
    try {
      return JSON.parse(userCookie);
    } catch (error) {
      console.error('Error parsing user cookie');
      return null;
    }
  }

  return null;
}

export async function authStartRegister(data: RegistrationRequest) {
  const { email, role } = data;

  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      email,
      role,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(error.response?.data?.message || 'Registration failed');
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
}

export async function authCustomerRegister(data: RegistrationCustomer) {
  // Safely extract token from the URL
  let token = null;

  if (isBrowser) {
    const urlParams = new URLSearchParams(window.location.search);
    token = urlParams.get('token');
  }

  // Check if token exists
  if (!token) {
    throw new Error('Verification token is missing from the URL');
  }

  const {
    name,
    date_birth,
    role,
    address,
    gender,
    phone,
    id_number,
    password,
    photo,
  } = data;

  try {
    const response = await axios.post(
      `${BASE_URL}/auth/register/customer`,
      {
        name,
        date_birth,
        role,
        address,
        gender,
        phone,
        id_number,
        password,
        photo,
      },
      {
        params: {
          token,
        },
      },
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || 'Registration for Customer is failed',
      );
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
}

export async function authTenantRegister(data: RegistrationTenant) {
  // Safely extract token from the URL
  let token = null;

  if (isBrowser) {
    const urlParams = new URLSearchParams(window.location.search);
    token = urlParams.get('token');
  }

  // Check if token exists
  if (!token) {
    throw new Error('Verification token is missing from the URL');
  }

  const {
    name,
    date_birth,
    address,
    gender,
    phone,
    id_number,
    password,
    bank_account,
    bank_name,
    npwp,
    photo,
  } = data;

  try {
    const response = await axios.post(
      `${BASE_URL}/auth/register/tenant`,
      {
        name,
        date_birth,
        address,
        gender,
        phone,
        id_number,
        password,
        bank_account,
        bank_name,
        npwp,
        photo,
      },
      {
        params: {
          token,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || 'Registration for Tenant is failed',
      );
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
}
export async function authVerifyToken(data: {
  email: string;
  role: string;
  token: string;
}): Promise<any> {
  const { email, role, token } = data;

  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      email,
      role,
      token,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Token Verification Axios error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || 'Token verification failed',
      );
    } else {
      console.error('Unexpected token verification error:', error);
      throw new Error('An unexpected error occurred during token verification');
    }
  }
}
