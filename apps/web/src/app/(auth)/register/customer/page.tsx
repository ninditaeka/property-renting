'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FcGoogle } from 'react-icons/fc';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useRouter } from 'next/navigation';

import { authStartRegister } from '@/service/auth.service';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';
import { registerStartSchema } from '../../../../../utils';
import { authVerifyToken } from '@/service/auth.service';

type RegisterInputs = z.infer<typeof registerStartSchema>;

export default function RegistrationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (token && email) {
      handleTokenVerification(email, token);
    }
  }, [searchParams]);

  // Function to handle token verification
  const handleTokenVerification = async (email: string, token: string) => {
    setIsLoading(true);
    try {
      await authVerifyToken({
        email,
        role: 'customer',
        token,
      });

      toast({
        description: 'Registration verified successfully',
      });

      router.push('/');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Verification Failed',
        description:
          error instanceof Error ? error.message : 'Token verification failed',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const form = useForm<RegisterInputs>({
    resolver: zodResolver(registerStartSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
    setIsLoading(true);
    try {
      await authStartRegister({
        email: data.email,
        role: 'customer',
      });

      toast({
        description: 'Verification email sent. Please check your inbox.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to start registration',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-sky-300 to-amber-100 md:bg-none md:flex">
      <div className="flex w-full flex-col items-center justify-center px-4 py-12 md:w-1/2 lg:px-8">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 mx-auto my-8 md:bg-transparent md:shadow-none md:rounded-none md:p-0">
          <div className="mb-8">
            <Link href="/" className="flex justify-center">
              <Image
                src="/logo_no_bg_no_yel.png"
                alt="Logo"
                width={200}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
          </div>

          <div className="mb-6 text-left">
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Create your customer account to rent properties
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="user@example.com"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-sky-400 hover:bg-sky-500 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Continue with email'}
              </Button>
            </form>
          </Form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white md:bg-transparent text-gray-500">
                Or
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => console.log('Continue with Google')}
          >
            <FcGoogle className="h-5 w-5 text-red-500" />
            Continue with Google
          </Button>

          <div className="mt-6 text-sm">
            Have account?
            <Link href="/login" className="ml-1 text-sky-600 hover:underline">
              Sign In
            </Link>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Rent property easily and conveniently
          </p>
        </div>
      </div>

      <div className="hidden md:block md:w-1/2">
        <Image
          src="/register.jpg"
          alt="Modern property with pool"
          width={800}
          height={900}
          className="h-full w-full object-cover"
          priority
        />
      </div>
    </div>
  );
}
