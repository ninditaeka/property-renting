'use client';

import { useState } from 'react';

import { DashboardSidebarTenant } from '@/components/Dashboard/SideBarTenant';
import { DashboardNavbar } from '@/components/Dashboard/Navbar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import RoomManagementFormPage from '@/components/Dashboard/RegisterRoomForm';

export default function TenantRegisterRoomForm() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <div className="fixed top-0 left-0 right-0 z-50">
        <DashboardNavbar
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
      </div>

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
      <div className="flex flex-1 pt-20 h-full overflow-hidden">
        <SidebarProvider>
          <div className="hidden md:block h-full overflow-y-auto fixed left-0 top-20 bottom-0">
            <DashboardSidebarTenant />
          </div>

          <div className="w-full md:pl-64 h-full overflow-hidden">
            <SidebarInset className="h-full overflow-auto">
              <div className="p-4 md:p-6 h-full mb-20">
                <RoomManagementFormPage />
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}
