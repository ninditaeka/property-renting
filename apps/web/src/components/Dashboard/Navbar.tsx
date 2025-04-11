'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Menu, Settings, User } from 'lucide-react';
import Image from 'next/image';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { AuthState } from '@/store/authSlice';
import { useRouter } from 'next/navigation';

interface DashboardNavbarProps {
  onMobileMenuToggle?: () => void;
}

export function DashboardNavbar({ onMobileMenuToggle }: DashboardNavbarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated, user } = useAppSelector<RootState>(
    (state) => state.auth,
  ) as AuthState;

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <header className="fixed z-50 flex h-16 w-full items-center border-b bg-cyan-900 px-6 shadow-sm md:px-8">
      <div className="flex flex-1 items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 text-primary-foreground hover:bg-primary/90 md:hidden"
          onClick={onMobileMenuToggle}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <Link href="/" className="flex items-center">
          <Image
            src="/logo_no_bg_no_yel.png"
            alt="Logo"
            width={200}
            height={40}
            className="h-10 w-auto"
          />
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden text-sm font-medium text-primary-foreground md:inline-block">
          {user?.name}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full border-2 border-primary-foreground/30 p-0 hover:bg-primary/90"
            >
              <Avatar className="h-7 w-7">
                <AvatarImage
                  src="/placeholder.svg?height=32&width=32"
                  alt="User"
                />
                <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground">
                  {user?.name?.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </div>
    </header>
  );
}
