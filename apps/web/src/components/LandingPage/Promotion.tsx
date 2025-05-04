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

const promotionRent = [
  { id: 1, image: '/promosi1.jpg' },
  { id: 2, image: '/promosi2.jpg' },
  { id: 3, image: '/promosi3.jpg' },
  { id: 4, image: '/promosi4.jpg' },
  { id: 5, image: '/promosi5.jpg' },
  { id: 6, image: '/promosi6.jpg' },
];

export default function Promotion() {
  return (
    <section className="py-10 px-4 md:px-8 lg:px-20 xl:px-80">
      <h2 className="font-bold text-2xl mb-6">Promotion</h2>

      <Carousel opts={{ align: 'start' }} className="w-full relative">
        <CarouselContent>
          {promotionRent.map((promotion) => (
            <CarouselItem
              key={promotion.id}
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
                        promotion.image ||
                        '/placeholder.svg?height=180&width=280'
                      }
                      alt="promotion"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  {/* <div className="p-4 transition-colors duration-300 group-hover:bg-sky-50"></div> */}
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
