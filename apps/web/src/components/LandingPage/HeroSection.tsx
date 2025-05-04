'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';

export default function HeroSection() {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const images = [
    {
      src: '/carousel1.jpg',
      text: 'Welcome to Our Service',
      position: 'top-center',
    },
    {
      src: '/carousel2.jpg',
      text: 'Experience Comfort & Style',
      position: 'center-left',
    },
    {
      src: '/carousel3.jpg',
      text: 'Best Deals for You',
      position: 'center-right',
    },
  ];

  const loopImages = [...images, images[0]];

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });

    const interval = setInterval(() => {
      if (current === count - 1) {
        api.scrollTo(0, true);
      } else {
        api.scrollNext();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [api, current, count]);

  const getPositionClasses = (position: any) => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-8 left-8';
      case 'top-center':
        return 'top-8 left-1/2 -translate-x-1/2';
      case 'center-right':
        return 'top-1/2 -translate-y-1/2 right-8';
      default:
        return 'bottom-8 left-8';
    }
  };

  return (
    <main className="relative pt-20">
      <div className="w-screen overflow-hidden">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent className="flex">
            {loopImages.map((item, index) => (
              <CarouselItem key={index} className="w-full basis-full relative">
                <Card className="w-full relative overflow-hidden">
                  <CardContent className="p-0 relative">
                    <img
                      src={item.src}
                      alt={`Carousel ${index + 1}`}
                      className="w-full h-screen object-cover brightness-75 contrast-100"
                    />

                    <h2
                      className={`absolute ${getPositionClasses(item.position)} text-white text-4xl md:text-2xlxl font-bold p-4 bg-blend-lighten shadow-2xl rounded-xl`}
                    >
                      {item.text}
                    </h2>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full" />
        </Carousel>
      </div>
    </main>
  );
}
