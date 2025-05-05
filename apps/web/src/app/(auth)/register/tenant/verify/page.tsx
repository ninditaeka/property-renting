'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import { authTenantRegister } from '@/service/auth.service';
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
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

// Update Zod schema to remove email field
const registerCompleteTenant = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  date_birth: z.string().min(1, { message: 'Date of birth is required' }),
  phone: z.string().min(1, { message: 'Phone number is required' }),
  id_number: z.string().min(1, { message: 'KTP number is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  gender: z.enum(['male', 'female'], {
    required_error: 'Please select your gender',
  }),
  bank_account: z.string().min(1, { message: 'Bank account is required' }),
  bank_name: z.string().min(1, { message: 'Bank name is required' }),
  npwp: z.string().min(1, { message: 'NPWP is required' }),
});

type RegisterInputs = z.infer<typeof registerCompleteTenant>;

export default function CompleteTenantProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  // We don't need to extract the token here anymore as the service will handle it
  // But we'll still check if the token exists in the URL for early validation
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  // Redirect if no token is provided
  useEffect(() => {
    if (!token) {
      toast({
        variant: 'destructive',
        title: 'Missing Token',
        description:
          'No verification token provided. Please check your email link.',
      });
      router.push('/login');
    }
  }, [token, toast, router]);

  const formTenant = useForm<RegisterInputs>({
    resolver: zodResolver(registerCompleteTenant),
    defaultValues: {
      name: '',
      password: '',
      date_birth: '',
      phone: '',
      id_number: '',
      address: '',
      gender: undefined,
      bank_account: '',
      bank_name: '',
      npwp: '',
    },
  });

  const onSubmit = async (data: RegisterInputs) => {
    setIsLoading(true);
    try {
      // The service will extract the token from the URL
      await authTenantRegister({
        name: data.name,
        password: data.password,
        date_birth: data.date_birth,
        phone: data.phone,
        id_number: data.id_number,
        gender: data.gender,
        address: data.address,
        bank_account: data.bank_account,
        bank_name: data.bank_name,
        npwp: data.npwp,
      });

      toast({
        description: 'Your Registration is Complete, Thank You!',
        variant: 'default',
      });

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
    <div className="min-h-screen w-full">
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-b from-sky-300 to-amber-100">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 mx-auto my-8">
          <div className="flex flex-col items-center mb-6">
            <Link href="/" className="flex justify-center">
              <Image
                src="/logo_no_bg_no_yel.png"
                alt="Logo"
                width={200}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm text-gray-600 text-left">
              You're just one step away from listing your property and
              connecting with potential renters! Complete your registration by
              providing a few additional details.
            </p>
          </div>

          <Form {...formTenant}>
            <form
              onSubmit={formTenant.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={formTenant.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        {...field}
                        className="focus:ring-2 focus:ring-sky-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formTenant.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                        className="focus:ring-2 focus:ring-sky-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formTenant.control}
                name="date_birth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="focus:ring-2 focus:ring-sky-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formTenant.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Enter your phone number"
                        {...field}
                        className="focus:ring-2 focus:ring-sky-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formTenant.control}
                name="id_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>KTP</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your KTP number"
                        {...field}
                        className="focus:ring-2 focus:ring-sky-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formTenant.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full address"
                        {...field}
                        className="focus:ring-2 focus:ring-sky-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formTenant.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-4"
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

              <div className="border-t border-gray-200 pt-4 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Tenant Information
                </h3>

                <FormField
                  control={formTenant.control}
                  name="npwp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NPWP (Tax ID)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your Tax ID"
                          {...field}
                          className="focus:ring-2 focus:ring-sky-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formTenant.control}
                  name="bank_name"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Bank Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your bank name"
                          {...field}
                          className="focus:ring-2 focus:ring-sky-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formTenant.control}
                  name="bank_account"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Bank Account</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your bank account"
                          {...field}
                          className="focus:ring-2 focus:ring-sky-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full mt-6 bg-sky-400 hover:bg-sky-500"
                disabled={isLoading}
              >
                {isLoading ? 'Registering...' : 'Complete Registration'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
