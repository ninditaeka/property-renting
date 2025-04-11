'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, MapPin, Mail, ChevronDown, ChevronUp } from 'lucide-react';

export const Footer = () => {
  const [aboutUsOpen, setAboutUsOpen] = useState(false);
  const [otherLinksOpen, setOtherLinksOpen] = useState(false);

  return (
    <footer className="w-full mt-16 bg-gray-200 py-10 px-4 md:px-2">
      <div className="md:hidden container mx-auto">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image
              src="/rent_ease-removebg-preview.png"
              alt="Logo"
              width={260}
              height={100}
              className="w-[250px] h-auto"
            />
          </Link>
        </div>

        <div className="border-b border-gray-300 pb-3 mb-3">
          <button
            onClick={() => setAboutUsOpen(!aboutUsOpen)}
            className="w-full flex justify-between items-center py-2"
          >
            <h2 className="font-bold">About Us</h2>
            {aboutUsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {aboutUsOpen && (
            <div className="pl-4 py-2 flex flex-col gap-3">
              <Link
                className="hover:underline transition-all duration-200"
                href="/"
              >
                Home
              </Link>
              <Link
                className="hover:underline transition-all duration-200"
                href="/about-us"
              >
                About Us
              </Link>
            </div>
          )}
        </div>

        <div className="border-b border-gray-300 pb-3 mb-3">
          <button
            onClick={() => setOtherLinksOpen(!otherLinksOpen)}
            className="w-full flex justify-between items-center py-2"
          >
            <h2 className="font-bold">Other Links</h2>
            {otherLinksOpen ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>

          {otherLinksOpen && (
            <div className="pl-4 py-2 flex flex-col gap-3">
              <Link
                className="hover:underline transition-all duration-200"
                href="/help-center"
              >
                Help Center
              </Link>
              <Link
                className="hover:underline transition-all duration-200"
                href="/faq"
              >
                FAQ's
              </Link>
              <Link
                className="hover:underline transition-all duration-200"
                href="/terms-condition"
              >
                Terms and condition
              </Link>
              <Link
                className="hover:underline transition-all duration-200"
                href="/privacy-policy"
              >
                Privacy Policy
              </Link>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h2 className="font-bold mb-3">Contact Us</h2>
          <div className="flex flex-col gap-3 pl-4">
            <div className="flex items-center gap-2">
              <Phone size={18} className="text-gray-700" />
              <span>+62 234 567 890</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-gray-700" />
              <span>Jl. Diponegoro No.9, DKI Jakarta</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={18} className="text-gray-700" />
              <span>info@rentease.com</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:flex container mx-auto flex-wrap justify-between items-start gap-10">
        <div className="flex-shrink-0">
          <Link href="/">
            <Image
              src="/rent_ease-removebg-preview.png"
              alt="Logo"
              width={260}
              height={100}
              className="w-[250px] h-auto sm:w-[300px] md:w-[300px]"
            />
          </Link>
        </div>

        <div className="flex flex-1 justify-between gap-10 md:gap-16">
          <div className="flex flex-col gap-4">
            <h2 className="font-bold">About Us</h2>
            <Link
              className="hover:underline transition-all duration-200"
              href="/"
            >
              Home
            </Link>
            <Link
              className="hover:underline transition-all duration-200"
              href="/about-us"
            >
              About Us
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-bold">Other Links</h2>
            <Link
              className="hover:underline transition-all duration-200"
              href="/help-center"
            >
              Help Center
            </Link>
            <Link
              className="hover:underline transition-all duration-200"
              href="/faq"
            >
              FAQ's
            </Link>
            <Link
              className="hover:underline transition-all duration-200"
              href="/terms-condition"
            >
              Terms and condition
            </Link>
            <Link
              className="hover:underline transition-all duration-200"
              href="/privacy-policy"
            >
              Privacy Policy
            </Link>
          </div>

          <div className="flex flex-col gap-4 mr-10 md:mr-16">
            <h2 className="font-bold">Contact Us</h2>
            <div className="flex items-center gap-2">
              <Phone size={18} className="text-gray-700" />
              <span>+62 234 567 890</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-gray-700" />
              <span>Jl. Diponegoro No.9, DKI Jakarta</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={18} className="text-gray-700" />
              <span>info@rentease.com</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-400 mt-10">
        <div className="container mx-auto px-6 py-6 text-center text-black text-sm md:text-base font-medium">
          @ 2025 RentEase. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
