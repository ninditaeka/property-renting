import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
  Router,
} from 'express';
import cors from 'cors';
import { PORT } from './config';
// import { SampleRouter } from './routers/sample.router';
import authRoutes from '../src/routers/auth.router';
import PropertyCategory from '../src/routers/propertyCategory.router';
import Room from '../src/routers/room.router';
import Property from '../src/routers/property.router';
import PriceSeason from '../src/routers/priceSeason.router';
import Customer from '../src/routers/customer.router';
import Booking from '../src/routers/booking.router';
import PropertyFacility from '../src/routers/propertyFacility.router';
import PropertyDetail from '../src/routers/propertyDetail.router';

import RoomFacility from '../src/routers/roomFacility.router';

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  private handleError(): void {
    // not found
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes('/api/')) {
        res.status(404).send('Not found !');
      } else {
        next();
      }
    });

    // error
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (req.path.includes('/api/')) {
          console.error('Error : ', err.stack);
          res.status(500).send('Error !');
        } else {
          next();
        }
      },
    );
  }

  private routes(): void {
    // const sampleRouter = new SampleRouter();

    // this.app.get('/api', (req: Request, res: Response) => {
    //   res.send(`Hello, Purwadhika Student API!`);
    // });

    // this.app.use('/api/samples', sampleRouter.getRouter());
    this.app.use('/auth', authRoutes);
    this.app.use('/property-categories', PropertyCategory);
    this.app.use('/property-lists', Property);
    this.app.use('/rooms', Room);
    this.app.use('/price-seasons', PriceSeason);
    this.app.use('/customers', Customer);
    this.app.use('/bookings', Booking);
    this.app.use('/property-facility', PropertyFacility);
    this.app.use('/room-facility', RoomFacility);
    this.app.use('/property-detail', PropertyDetail);
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
