'use client';

import type React from 'react';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { loginUser } from '@/store/authSlice';
import { AuthState } from '../../../../types/auth.type';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

// Zod validation schema
const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

export default function LoginPage() {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const router = useRouter();

  // Create form with Zod validation
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Handle login submission
  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const result = await dispatch(
        loginUser({
          email: values.email,
          password: values.password,
        }),
      ).unwrap();

      // Redirect after successful login
      if (result.token) {
        toast({
          title: 'Login Successful',
          description: 'You have been logged in successfully.',
        });
        router.push('/');
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid email or password. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-300 to-amber-100 md:bg-none md:flex">
      <div className="flex items-center justify-center min-h-screen p-4 md:hidden">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 mx-auto my-8">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-gray-900">Sign In</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to access your account and enjoy our services
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="user@example.com"
                        {...field}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-sky-400 hover:bg-sky-500 text-white font-medium rounded-md transition-colors"
              >
                {loading ? 'Loading...' : 'Login'}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-black hover:bg-slate-900 text-white font-medium rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="currentColor"
                >
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
                Sign in with Google
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm">
            Don&apos;t have account?
            <Link
              href="/register"
              className="ml-1 text-sky-600 hover:underline"
            >
              register
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop version (similar modifications) */}
      <div className="hidden md:flex md:w-1/2 md:flex-row md:items-start md:justify-center md:px-8 md:py-12 lg:px-12">
        <div className="w-full max-w-md">
          <div className="mb-8 mt-16">
            <Link href="/" className="flex justify-center">
              <Image
                src="/logo_no_bg_no_yel.png"
                alt="RentEase Logo"
                width={200}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
          </div>

          <div className="mb-6 text-left">
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to access your account and enjoy our services
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="user@example.com"
                        {...field}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-sky-400 hover:bg-sky-500 text-white font-medium rounded-md transition-colors"
              >
                {loading ? 'Loading...' : 'Login'}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-black hover:bg-slate-900 text-white font-medium rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="currentColor"
                >
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
                Sign in with Google
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-sm">
            Don't have account?
            <Link
              href="/register"
              className="ml-1 text-sky-600 hover:underline"
            >
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* Existing image section remains the same */}
      <div className="hidden md:block md:w-1/2">
        <Image
          src="/login.jpg"
          alt="Colorful house"
          width={800}
          height={900}
          className="h-full w-full object-cover"
          priority
        />
      </div>
    </div>
  );
}
