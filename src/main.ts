import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { join } from 'path';

async function bootstrap() {
  var dotEnvPath = join(__dirname, '..', '..', 'environment', '.env')
  //load up dotenv
  var dotenvResult = dotenv.config({
    path: dotEnvPath
  });

  if(dotenvResult.error){
    throw dotenvResult.error;
  }

  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.NEST_PORT);
}
bootstrap();
