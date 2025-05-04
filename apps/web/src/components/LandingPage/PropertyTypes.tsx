'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const propertyTypes = [
  { id: 1, name: 'Hotels', image: '/hotels.jpg' },
  { id: 2, name: 'Apartments', image: '/apartements.jpg' },
  { id: 3, name: 'Villas', image: '/villas.jpg' },
  { id: 4, name: 'Resorts', image: '/resorts.jpeg' },
  { id: 5, name: 'Hostels', image: '/hostels.jpg' },
  { id: 6, name: 'Guest House', image: '/guest-house.jpg' },
];

export default function PropertyTypes() {
  return (
    <section className="py-10 px-4 md:px-8 lg:px-20 xl:px-80">
      <h2 className="font-bold text-2xl mb-6">Property Types</h2>

      <Carousel opts={{ align: 'start' }} className="w-full relative">
        <CarouselContent>
          {propertyTypes.map((property) => (
            <CarouselItem
              key={property.id}
              className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 pl-4"
            >
              <Card
                className="border-0 shadow-md overflow-hidden rounded-lg 
                              transition-all duration-300 hover:shadow-lg hover:-translate-y-1 
                              hover:cursor-pointer group"
              >
                <CardContent className="p-0">
                  <div className="relative h-[180px] w-full overflow-hidden">
                    <Image
                      src={
                        property.image ||
                        '/placeholder.svg?height=180&width=280'
                      }
                      alt={property.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4 transition-colors duration-300 group-hover:bg-sky-50">
                    <h3 className="font-semibold text-lg">{property.name}</h3>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious
          className="absolute left-0 top-[90px] z-10 rounded-full w-10 h-10 
                    bg-white/90 shadow-md border-0 -translate-x-1/2
                    hover:bg-white hover:scale-110 transition-all duration-200"
        />

        <CarouselNext
          className="absolute right-0 top-[90px] z-10 rounded-full w-10 h-10 
                    bg-white/90 shadow-md border-0 translate-x-1/2
                    hover:bg-white hover:scale-110 transition-all duration-200"
        />
      </Carousel>
    </section>
  );
}
