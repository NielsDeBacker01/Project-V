import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';

declare const module: any;

async function bootstrap() {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });

  const app = await NestFactory.create(AppModule);
  await app.listen(3200);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();