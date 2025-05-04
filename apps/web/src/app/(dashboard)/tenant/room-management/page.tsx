'use client';

import { useState } from 'react';

import { DashboardSidebarTenant } from '@/components/Dashboard/SideBarTenant';
import { DashboardNavbar } from '@/components/Dashboard/Navbar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { PropertyListPage } from '@/components/Dashboard/PropertyList';
import { RoomManagementPage } from '@/components/Dashboard/RoomManagement';

export default function RoomManagement() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardNavbar
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64 md:hidden">
          <SidebarProvider>
            <DashboardSidebarTenant
              onMobileItemClick={closeMobileMenu}
              isMobile={true}
            />
          </SidebarProvider>
        </SheetContent>
      </Sheet>

      <div className="flex flex-1">
        <SidebarProvider>
          <div className="hidden md:block">
            <DashboardSidebarTenant />
          </div>

          <SidebarInset className="flex-1">
            <div className="p-4 md:p-6">
              <RoomManagementPage />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
}
