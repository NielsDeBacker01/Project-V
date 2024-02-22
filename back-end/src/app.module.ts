import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventService } from './service/event/event.service';
import { EventController } from './controller/event/event.controller';

@Module({
  imports: [],
  controllers: [AppController, EventController],
  providers: [AppService, EventService],
})
export class AppModule {}
