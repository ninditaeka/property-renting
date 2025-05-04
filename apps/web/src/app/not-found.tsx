import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* Full width container for the image */}
      <div className="w-full mb-8">
        <div className="relative w-full" style={{ height: '50vh' }}>
          <Image
            src="/404.gif"
            alt="404 Not Found Illustration"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
      </div>

      {/* Content container */}
      <div className="max-w-lg w-full text-center px-4">
        {/* Error message */}
        <h1 className="text-6xl font-bold mb-2 text-gray-800">404</h1>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Looks Like You're Lost
        </h2>
        <p className="mb-8 text-gray-600 text-lg">
          The page you are looking for does not exist. It might have been moved
          or deleted.
        </p>

        {/* Back to home button */}
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-sky-400 text-white font-medium rounded-lg shadow-md hover:bg-sky-700 transition-colors duration-300"
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
  );
}
