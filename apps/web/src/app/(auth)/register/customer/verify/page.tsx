'use client';

import { useEffect, useState } from 'react';
import { authCustomerRegister } from '@/service/auth.service';
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
import { useSearchParams } from 'next/navigation';

// Define schema without email (email comes from token)
const registerCompleteCustomer = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  date_birth: z.string().min(1, { message: 'Date of birth is required' }),
  phone: z.string().min(5, { message: 'Valid phone number is required' }),
  id_number: z.string().min(1, { message: 'KTP number is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  gender: z.enum(['male', 'female'], {
    required_error: 'Please select your gender',
  }),
  role: z.literal('customer').optional(), // Optional as it's hardcoded in the submission
});

type RegisterInputs = z.infer<typeof registerCompleteCustomer>;

export default function CompleteCustomerProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [tokenEmail, setTokenEmail] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get token from URL
  const token = searchParams.get('token');

  // Form initialization with Zod resolver
  const formCustomer = useForm<RegisterInputs>({
    resolver: zodResolver(registerCompleteCustomer),
    defaultValues: {
      name: '',
      password: '',
      date_birth: '',
      phone: '',
      id_number: '',
      address: '',
      gender: undefined,
      role: 'customer',
    },
  });

  // Check for token on component mount
  useEffect(() => {
    if (!token) {
      toast({
        variant: 'destructive',
        title: 'Missing Token',
        description:
          'Verification token is missing. Please use the link sent to your email.',
      });
      router.push('/login');
    }
  }, [token, toast, router]);

  const onSubmit = async (data: RegisterInputs) => {
    if (!token) {
      toast({
        variant: 'destructive',
        title: 'Missing Token',
        description: 'Verification token is missing',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Use the existing authCustomerRegister function
      // The token is automatically extracted from the URL by the function
      await authCustomerRegister({
        name: data.name,
        password: data.password,
        date_birth: data.date_birth,
        phone: data.phone,
        id_number: data.id_number,
        gender: data.gender,
        address: data.address,
        role: 'customer', // Explicitly set role
      });

      toast({
        description: 'Your Registration is Complete, Thank You!',
        variant: 'default',
      });

      // Redirect after successful registration
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

          {tokenEmail && (
            <div className="mt-2 p-2 bg-blue-50 rounded-md w-full text-center">
              <p className="text-sm text-blue-600">
                Registering with email: <strong>{tokenEmail}</strong>
              </p>
            </div>
          )}
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
