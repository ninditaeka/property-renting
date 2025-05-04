import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-300 to-amber-100 md:bg-none md:flex">
      <div className="flex items-center justify-center min-h-screen p-4 md:w-1/2 md:justify-start md:px-8 md:py-12 lg:px-12">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 mx-auto my-8 md:bg-transparent md:shadow-none">
          <div className=" md:block mb-8 mt-8">
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

          <div className="mb-6 text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Register
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please register to create a new account and enjoy our services.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2 mb-6">
              <h3 className="text-sm font-medium text-gray-700 text-center md:text-left">
                Choose your role
              </h3>
              <p className="text-xs text-gray-500 text-center md:text-left">
                Select whether you want to list properties or rent them
              </p>
            </div>

            <div className="space-y-4">
              <Link href="/register/tenant" className="block">
                <button className="w-full flex items-center justify-center md:justify-between border border-gray-300 rounded-md px-4 py-3 hover:border-gray-400 transition-colors bg-white">
                  <div className="flex flex-col md:flex-row items-center text-center md:text-left">
                    <div className="mb-2 md:mb-0 md:mr-3 bg-gray-100 rounded-full p-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-600"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Become a tenant</div>
                      <div className="text-xs text-gray-500">
                        I want to list my properties
                      </div>
                    </div>
                  </div>
                </button>
              </Link>

              <Link href="/register/customer" className="block">
                <button className="w-full flex items-center justify-center md:justify-between border border-gray-300 rounded-md px-4 py-3 hover:border-gray-400 transition-colors bg-white">
                  <div className="flex flex-col md:flex-row items-center text-center md:text-left">
                    <div className="mb-2 md:mb-0 md:mr-3 bg-gray-100 rounded-full p-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-600"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Become a customer</div>
                      <div className="text-xs text-gray-500">
                        I want to rent property
                      </div>
                    </div>
                  </div>
                </button>
              </Link>
            </div>

            <div className="mt-6 text-sm md:block">
              Have account?
              <Link href="/login" className="ml-1 text-sky-600 hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block md:w-1/2">
        <Image
          src="/register.jpg"
          alt="Cozy interior of a rental property"
          width={800}
          height={900}
          className="h-full w-full object-cover"
          priority
        />
      </div>
    </div>
  );
}
