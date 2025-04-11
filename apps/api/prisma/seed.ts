import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const roomFacilities = [
  'Single bed',
  'Twin bed',
  'Extra bed',
  'AC',
  'TV',
  'Wi-Fi',
  'Work desk',
  'Mini bar',
  'Balcony',
  'Room services',
  'Fully equipped kitchen',
  'Living room',
  'Private swimming pool',
  'BBQ area',
  'Locker strorage',
  'Breakfast',
  'One bedroom',
  'Two bedroom',
  'Three bedroom',
  'One bathroom',
  'Two bathroom',
];

const propertyFacilities = [
  '24-hours security',
  'Gym and fitness center',
  'Sauna & Spa',
  'Swimming pool',
  'Restaurant',
  'Parking area',
  'Children Playground',
  'Meeting room',
  'Laundry services',
  'Lounge',
  'Restaurant',
  'Minimarket',
  'Green Space',
  'Nearby Mall',
  'Shuttle Service',
  'Airport Transport',
  'Vehicle Rental',
];

async function main() {
  // Insert room facilities
  for (const room_facility_name of roomFacilities) {
    await prisma.roomFacility.create({
      data: { room_facility_name },
    });
  }

  // Insert property facilities
  for (const property_facility_name of propertyFacilities) {
    await prisma.propertyFacility.create({
      data: { property_facility_name },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
