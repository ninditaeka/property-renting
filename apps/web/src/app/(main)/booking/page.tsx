'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

export default function BookingPage() {
  const [countryCode, setCountryCode] = useState('+62');

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6 mt-20">
      <h1 className="text-lg md:text-xl font-bold mb-2">
        Your Accommodation Booking
      </h1>
      <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-6">
        Please ensure all details on this page are correct before proceeding to
        payment.
      </p>

      <div className="space-y-4 md:space-y-6">
        <Card className="overflow-hidden">
          <CardContent className="p-4 md:p-5">
            <h2 className="font-medium text-sm md:text-base mb-3 md:mb-4">
              Enter your details
            </h2>

            <div className="space-y-3 md:space-y-4">
              <div className="space-y-1.5 md:space-y-2">
                <Label htmlFor="fullName" className="text-sm">
                  Full Name (as in Official ID Card)
                </Label>
                <Input id="fullName" className="h-9 md:h-10" />
              </div>

              {/* <div className="space-y-1.5 md:space-y-2">
                <Label htmlFor="email" className="text-sm">
                  Email
                </Label>
                <Input id="email" type="email" className="h-9 md:h-10" />
              </div> */}

              <div className="space-y-1.5 md:space-y-2">
                <Label htmlFor="phone" className="text-sm">
                  Phone Number
                </Label>
                <div className="flex">
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger className="w-[70px] md:w-[80px] rounded-r-none border-r-0 h-9 md:h-10">
                      <SelectValue placeholder="+62" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+62">+62</SelectItem>
                      <SelectItem value="+1">+1</SelectItem>
                      <SelectItem value="+44">+44</SelectItem>
                      <SelectItem value="+61">+61</SelectItem>
                      <SelectItem value="+49">+49</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="phone"
                    className="rounded-l-none h-9 md:h-10"
                    placeholder="490 033"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-4 md:p-5">
            <h2 className="font-medium text-sm md:text-base mb-3 md:mb-4">
              Your Booking Details
            </h2>

            <div className="space-y-3 md:space-y-4">
              <div>
                <h3 className="font-medium text-sm md:text-base">
                  The Gaia Hotel
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Bandung, Indonesia
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                <div>
                  <p className="text-xs md:text-sm font-medium">Check-in</p>
                  <div className="flex items-center text-xs md:text-sm mt-0.5 md:mt-1">
                    <span>Sat, 25 March 2023</span>
                  </div>
                </div>

                <div className="mt-2 md:mt-0">
                  <p className="text-xs md:text-sm font-medium">Check-out</p>
                  <div className="flex items-center text-xs md:text-sm mt-0.5 md:mt-1">
                    <span>Sun, 26 March 2023</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs md:text-sm">1 Deluxe Room</p>
              </div>

              <Separator className="my-1 md:my-2" />

              <div className="flex justify-between items-center">
                <p className="font-medium text-sm md:text-base">Total Price</p>
                <p className="font-bold text-sm md:text-base">Rp 2,499,200</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button className="bg-sky-400 hover:bg-sky-500 text-white w-full">
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}
