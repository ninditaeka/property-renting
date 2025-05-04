'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { authCustomerRegister, authVerifyToken } from '@/service/auth.service';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { registerCompleteCustomer } from '../../../../../../utils';

import { useSearchParams } from 'next/navigation';

type RegisterInputs = z.infer<typeof registerCompleteCustomer>;

export default function CompleteCustomerProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedFileName, setSelectedFileName] = useState<string>('');

  // Initialize form with Zod resolver
  const formCustomer = useForm<RegisterInputs>({
    resolver: zodResolver(registerCompleteCustomer),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      date_birth: '',
      phone: '',
      id_number: '',
      address: '',
      gender: undefined,
      // photo: undefined,
    },
  });

  const onSubmit = async (data: RegisterInputs) => {
    setIsLoading(true);
    try {
      await authCustomerRegister({
        email: data.email,
        name: data.name,
        password: data.password,
        date_birth: data.date_birth,
        phone: data.phone,
        id_number: data.id_number,
        gender: data.gender,
        role: 'customer',
        address: data.address,
        // photo: data.photo,
      });

      toast({
        description: 'Your Registration is Complete, Thank You!',
        variant: 'default',
      });

      // Optional: Redirect after successful registration
      router.push('/login');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to complete registration',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-sky-300 to-amber-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col items-center mb-6">
          <Link href="/" className="flex justify-center mb-4">
            <Image
              src="/logo_no_bg_no_yel.png"
              alt="Logo"
              width={200}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          <p className="text-sm text-gray-600 text-center">
            You're just one step away from experiencing our exceptional
            hospitality! Complete your registration by providing a few
            additional details.
          </p>
        </div>

        <Form {...formCustomer}>
          <form
            onSubmit={formCustomer.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={formCustomer.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formCustomer.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formCustomer.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formCustomer.control}
              name="date_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formCustomer.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Enter your phone number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formCustomer.control}
              name="id_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>KTP</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your KTP number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formCustomer.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={formCustomer.control}
              name="photo"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Profile Photo</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <Input
                        type="file"
                        accept=".jpg,.jpeg,.png,.gif"
                        {...field}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                            setSelectedFileName(file.name);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        id="photo"
                      />
                      <div className="w-full border p-2 rounded text-gray-500">
                        {selectedFileName || 'Choose a file  by click here'}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={formCustomer.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-sky-400 hover:bg-sky-500"
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Complete Registration'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
