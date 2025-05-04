'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Unauthorized() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* Full width container for the image */}
      <div className="w-full mb-8">
        <div className="relative w-full" style={{ height: '50vh' }}>
          <Image
            src="/401.jpg" // P
            alt="401 Unauthorized Access"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
      </div>
      {/* Content container */}
      <div className="max-w-lg w-full text-center px-4">
        {/* Error message */}
        <h1 className="text-6xl font-bold mb-2 text-red-600">401</h1>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Access Denied
        </h2>
        <p className="mb-4 text-gray-600 text-lg">
          Sorry, you don&apos;t have permission to access this page.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {/* Back to home button */}
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-sky-200 text-gray-800 font-medium rounded-lg shadow-md hover:bg-sky-300 transition-colors duration-300"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
