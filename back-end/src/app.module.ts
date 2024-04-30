import { Module } from '@nestjs/common';
import { EventService } from './service/event/event.service';
import { EventController } from './controller/event/event.controller';
import * as cors from 'cors';
import { HttpModule } from '@nestjs/axios';
import { SerieController } from './controller/event/serie.controller';
import { SerieService } from './service/serie/serie.service';


@Module({
  imports: [HttpModule],
  controllers: [EventController, SerieController],
  providers: [EventService, SerieService],
})
export class AppModule {
  configure(consumer: any) {
    consumer.apply(cors()).forRoutes('*');
  }
}