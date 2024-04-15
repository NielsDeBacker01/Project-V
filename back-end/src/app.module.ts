import { Module } from '@nestjs/common';
import { EventService } from './service/event/event.service';
import { EventController } from './controller/event/event.controller';
import * as cors from 'cors';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports: [HttpModule],
  controllers: [EventController],
  providers: [EventService],
})
export class AppModule {
  configure(consumer: any) {
    consumer.apply(cors()).forRoutes('*');
  }
}