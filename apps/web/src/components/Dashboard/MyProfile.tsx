'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, Mail, MapPin, Phone, User } from 'lucide-react';

export default function ProfilePage() {
  // This would normally come from your database
  const customer = {
    id: 'CUS12345',
    name: 'Nindita Eka Setyahandani',
    email: 'nindita.eka@example.com',
    phone: '+62 123 456 7890',
    dob: '1990-05-15',
    address: 'Jl. Sudirman No. 123, RT 05/RW 07',
    city: 'Jakarta',
    province: 'DKI Jakarta',
    postalCode: '12930',
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl">Customer Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Profile Photo and Name - Centered */}
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <Avatar className="h-32 w-32 border-2 border-muted">
              <AvatarImage
                src="/placeholder.svg?height=128&width=128"
                alt="Profile picture"
              />
              <AvatarFallback className="bg-primary/10">
                <User className="h-16 w-16 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-medium">{customer.name}</h2>
            </div>
          </div>

          <Separator />

          {/* Personal Information */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Full Name
                </p>
                <p>{customer.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email Address
                </p>
                <p>{customer.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Phone Number
                </p>
                <p>{customer.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Date of Birth
                </p>
                <p>{new Date(customer.dob).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-md font-medium">Address</h3>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Full Address
                </p>
                <p>{customer.address}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
