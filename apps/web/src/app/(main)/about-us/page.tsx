import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building, Home, Users, Clock, Shield, ThumbsUp } from 'lucide-react';

export default function AboutUs() {
  return (
    <main className="min-h-screen bg-white">
      <section className="py-20 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Story</h2>
            <div className="h-1 w-20 bg-sky-500 mb-8"></div>
            <p className="text-gray-600 mb-4">
              Rent Ease was founded in 2025 by a group of real estate
              professionals and tech enthusiasts who experienced firsthand the
              challenges of the traditional rental process.
            </p>
            <p className="text-gray-600 mb-4">
              Frustrated by the paperwork, delays, and lack of transparency in
              the rental market, our founders set out to create a platform that
              would revolutionize how people rent properties.
            </p>
            <p className="text-gray-600 mb-4">
              Starting with just a handful of properties in one city, we've now
              expanded to serve thousands of landlords and tenants across the
              country, making the rental process easier for everyone involved.
            </p>
            <p className="text-gray-600 font-medium">
              Today, Rent Ease continues to innovate and improve the rental
              experience, staying true to our original mission: to make renting
              property easy and convenient.
            </p>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/team.jpeg"
              alt="Rent Ease team"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Our Mission & Values
            </h2>
            <div className="h-1 w-20 bg-sky-500 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              At Rent Ease, we're guided by a set of core values that shape
              everything we do, from how we build our platform to how we
              interact with our customers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-sky-100 p-3 rounded-full w-fit mb-6">
                  <Users className="h-6 w-6 text-sky-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  Customer First
                </h3>
                <p className="text-gray-600">
                  We prioritize the needs of landlords and tenants in every
                  decision we make, ensuring our platform serves them
                  effectively.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-sky-100 p-3 rounded-full w-fit mb-6">
                  <Shield className="h-6 w-6 text-sky-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  Trust & Transparency
                </h3>
                <p className="text-gray-600">
                  We believe in honest communication and transparent processes
                  that build trust with our users.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-sky-100 p-3 rounded-full w-fit mb-6">
                  <ThumbsUp className="h-6 w-6 text-sky-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  Continuous Improvement
                </h3>
                <p className="text-gray-600">
                  We're constantly evolving our platform based on user feedback
                  to provide the best possible experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Why Choose Rent Ease
          </h2>
          <div className="h-1 w-20 bg-sky-500 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform offers unique advantages that make the rental process
            smoother for both property owners and tenants.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="bg-sky-100 p-3 rounded-full">
                <Clock className="h-5 w-5 text-sky-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Time-Saving
              </h3>
              <p className="text-gray-600">
                Our streamlined process reduces the time it takes to list, find,
                and rent properties.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="bg-sky-100 p-3 rounded-full">
                <Building className="h-5 w-5 text-sky-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Quality Listings
              </h3>
              <p className="text-gray-600">
                We verify all properties to ensure high-quality, accurate
                listings for our users.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="bg-sky-100 p-3 rounded-full">
                <Home className="h-5 w-5 text-sky-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Personalized Matching
              </h3>
              <p className="text-gray-600">
                Our smart algorithms help match tenants with their ideal
                properties.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
