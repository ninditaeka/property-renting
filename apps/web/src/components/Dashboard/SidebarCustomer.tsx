'use client';

import { SidebarHeader } from '@/components/ui/sidebar';
import { Home, List, LogOut, User } from 'lucide-react';
import Link from 'next/link';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

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
  {
    title: 'Sign Out',
    url: '/signout',
    icon: LogOut,
    isActive: false,
  },
];

interface DashboardSidebarCustomerProps {
  onMobileItemClick?: () => void;
  isMobile?: boolean;
}

export function DashboardSidebarCustomer({
  onMobileItemClick,
  isMobile = false,
}: DashboardSidebarCustomerProps) {
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
