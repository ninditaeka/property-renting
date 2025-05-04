'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, User, LogOut } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { AuthState } from '../../types/auth.type';
import { logoutUser } from '@/store/authSlice';

export const Header = () => {
  const dispatch = useAppDispatch();

  // Fix: Access the auth property from state which contains the AuthState
  const { loading, error, isAuthenticated, user } = useAppSelector(
    (state: RootState) => state.auth,
  );

  const handleLogOut = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await dispatch(logoutUser()).unwrap();
    } catch (err) {
      // Error handling sudah ditangani di slice
      console.error('Login failed');
    }
  };

  return (
    <nav className="w-full p-4 md:px-8 flex items-center justify-between bg-white shadow-md z-50 fixed">
      <Link href="/" className="flex-shrink-0">
        <Image
          src="/logo_no_bg_no_yel.png"
          alt="Logo"
          width={200}
          height={40}
          className="h-10 w-auto"
        />
      </Link>

      <div className="hidden md:flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <p className="text-gray-700 hover:text-sky-500">{user?.name}</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="User"
                    />
                    <AvatarFallback>{user?.name.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link
                      href={user?.role === 'customer' ? '/customer' : '/tenant'}
                      className="text-gray-700 hover:text-sky-500"
                    >
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  <Button
                    variant="destructive"
                    className="mt-4"
                    onClick={handleLogOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Link
              href="/register"
              className="px-4 py-2 bg-sky-400 hover:bg-sky-500 text-white rounded-md transition-colors"
            >
              Register
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 bg-sky-400 hover:bg-sky-500 text-white rounded-md transition-colors"
            >
              Log In
            </Link>
          </>
        )}
      </div>

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col space-y-4 mt-8">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2 mb-4">
                    <Avatar>
                      <AvatarImage
                        src="/placeholder.svg?height=40&width=40"
                        alt="User"
                      />
                      <AvatarFallback>{user?.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user?.name}</span>
                  </div>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 hover:bg-gray-100 rounded-md"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="px-4 py-2 hover:bg-gray-100 rounded-md"
                  >
                    Profile
                  </Link>
                  <Button
                    variant="destructive"
                    className="mt-4"
                    onClick={handleLogOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-sky-400 hover:bg-sky-500 text-white rounded-md transition-colors text-center"
                  >
                    Register
                  </Link>
                  <Link
                    href="/login"
                    className="px-4 py-2 bg-sky-400 hover:bg-sky-500 text-white rounded-md transition-colors text-center"
                  >
                    Log In
                  </Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};
