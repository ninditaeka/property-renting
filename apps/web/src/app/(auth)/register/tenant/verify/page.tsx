'use client';

import type React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { registerCompleteTenant } from '../../../../../../utils';

type RegisterInputs = z.infer<typeof registerCompleteTenant>;

export default function CompleteTenantProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [selectedFileName, setSelectedFileName] = useState<string>('');

  const formTenant = useForm<RegisterInputs>({
    resolver: zodResolver(registerCompleteTenant),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      date_birth: '',
      phone: '',
      id_number: '',
      address: '',
      gender: undefined,
      photo: undefined,
      bank_account: '',
      bank_name: '',
      npwp: '',
    },
  });

  const onSubmit = async (data: RegisterInputs) => {
    setIsLoading(true);
    try {
      await authTenantRegister({
        email: data.email,
        name: data.name,
        password: data.password,
        date_birth: data.date_birth,
        phone: data.phone,
        id_number: data.id_number,
        gender: data.gender,
        role: 'tenant',
        address: data.address,
        photo: data.photo,
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
      <div className="flex items-center justify-center min-h-screen p-4  bg-gradient-to-b from-sky-300 to-amber-100">
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
                          {selectedFileName || 'Choose a file by clicking here'}
                        </div>
                      </div>
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
                className="w-full mt-6  bg-sky-400 hover:bg-sky-500"
                disabled={isLoading}
              >
                {isLoading ? 'Registering...' : 'Complete Registration'}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* Desktop version - similar structure but with md:flex */}
      {/* <div className="hidden md:flex md:flex-col md:items-center md:justify-center md:min-h-screen bg-white">
        <div className="w-full max-w-md p-6 border border-sky-200 rounded-lg">
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
              <Button
                type="submit"
                className="w-full mt-6"
                disabled={isLoading}
              >
                {isLoading ? 'Registering...' : 'Complete Registration'}
              </Button>
            </form>
          </Form>
        </div>
      </div> */}
    </div>
  );
}
