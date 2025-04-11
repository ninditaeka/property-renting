'use client';

import { SidebarHeader } from '@/components/ui/sidebar';
import {
  Home,
  List,
  LogOut,
  Rows3,
  CircleDollarSign,
  BedDouble,
} from 'lucide-react';
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
    title: 'Property List',
    url: '/tenant',
    icon: Rows3,
    isActive: false,
  },
  {
    title: 'Category Management',
    url: '/tenant/category-management',
    icon: List,
    isActive: true,
  },
  {
    title: 'Room Management',
    url: '/tenant/room-management',
    icon: BedDouble,
    isActive: false,
  },
  {
    title: 'Price Management',
    url: '/tenant/price-management',
    icon: CircleDollarSign,
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

export function DashboardSidebarTenant({
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
