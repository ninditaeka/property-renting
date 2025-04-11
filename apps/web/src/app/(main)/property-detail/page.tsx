import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FormSearch from '@/components/LandingPage/FormSearch';

export default function PropertyDetail() {
  return (
    <div className="mt-24 ">
      <div className="max-w-4xl mx-auto mt-10 bg-white">
        <FormSearch />
        <div className="p-4">
          <h1 className="text-xl font-bold">The Gaia Hotel</h1>
          <div className="flex items-center text-gray-500 mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">Rush Bali, Bandung</span>
          </div>
        </div>

        <div className="relative w-full h-[300px] ">
          <Image
            src="/hotel1.jpg"
            alt="The Gaia Hotel Room"
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>

        <div className="p-4 border-t mt-4">
          <h2 className="font-semibold text-lg mb-2">Description</h2>
          <div className="border rounded-md p-4 text-sm text-gray-700">
            <p>
              Gaia Hotel Bandung, terletak di kawasan Rush Bali, Bandung,
              menawarkan pengalaman sempurna antara kenyamanan alam dan
              kemewahan modern. Hotel ini dirancang untuk memenuhi pengunjung
              menginap yang tak terlupakan dengan pemandangan indah, layanan
              yang ramah, dan fasilitas mewah.
            </p>
          </div>
        </div>

        <div className="p-4 border-t">
          <h2 className="font-semibold text-lg mb-4">Available Room Types</h2>

          <Card className="mb-4 border overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 h-[150px] relative">
                <Image
                  src="/room1.jpg"
                  alt="Standard Room"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col md:flex-row justify-between">
                <div>
                  <h3 className="font-semibold">Standart</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Room facilities: Air Conditioner, Wifi, extra bed and water
                    heater
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col items-end justify-between">
                  <div className="text-base font-bold">Rp 2.459.200</div>
                  <Button className="mt-2 bg-sky-400 hover:bg-sky-500">
                    Choose
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="mb-4 border overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 h-[150px] relative">
                <Image
                  src="/room2.jpg"
                  alt="Superior Room"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col md:flex-row justify-between">
                <div>
                  <h3 className="font-semibold">Superior</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Room facilities: Air Conditioner, Wifi, extra bed and water
                    heater
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col items-end justify-between">
                  <div className="text-base font-bold">Rp 4.459.200</div>
                  <Button className="mt-2 bg-sky-400 hover:bg-sky-500">
                    Choose
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
