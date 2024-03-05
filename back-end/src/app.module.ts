import { Module } from '@nestjs/common';
import { EventService } from './service/event/event.service';
import { EventController } from './controller/event/event.controller';
import * as cors from 'cors';


@Module({
  imports: [],
  controllers: [EventController],
  providers: [EventService],
})
export class AppModule {
  configure(consumer: any) {
    consumer.apply(cors()).forRoutes('*');
  }
}