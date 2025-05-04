'use client';

import { SidebarHeader } from '@/components/ui/sidebar';
import { Home, List, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { logoutUser } from '@/store/authSlice';
import { Button } from '@/components/ui/button';

interface DashboardSidebarCustomerProps {
  onMobileItemClick?: () => void;
  isMobile?: boolean;
}

export function DashboardSidebarCustomer({
  onMobileItemClick,
  isMobile = false,
}: DashboardSidebarCustomerProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Get authentication state from Redux store
  const { isAuthenticated, user } = useAppSelector(
    (state: RootState) => state.auth,
  );

  // Handle logout function
  const handleLogOut = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      await dispatch(logoutUser()).unwrap();
      router.push('/'); // Redirect to login page after logout
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  // Define menu items without the logout item
  const items = [
    {
      title: 'My booking list',
      url: '/customer',
      icon: List,
      isActive: true,
    },
    {
      title: 'Profile',
      url: '/customer/profile',
      icon: User,
      isActive: false,
    },
    {
      title: 'Home',
      url: '/',
      icon: Home,
      isActive: false,
    },
  ];

  return (
    <Sidebar className={`border-r ${isMobile ? 'mt-0' : 'mt-14'}`}>
      {isMobile && (
        <SidebarHeader className="h-16 border-b">
          <div className="flex h-full items-center px-6">
            <span className="text-lg font-semibold">Menu</span>
          </div>
        </SidebarHeader>
      )}
      <SidebarContent className={isMobile ? 'pt-0' : 'pt-2'}>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <Link
                      href={item.url}
                      className="flex items-center gap-3 py-3 px-6"
                      onClick={() => onMobileItemClick && onMobileItemClick()}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Logout button with proper handling */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={false}>
                  <Button
                    variant="ghost"
                    className="flex w-full items-center gap-3 py-3 px-6 justify-start hover:bg-gray-100 hover:text-red-600"
                    onClick={handleLogOut}
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Sign Out</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
