import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { join } from 'path';
import * as helmet from 'helmet';

async function bootstrap() {
  var dotEnvPath = join(__dirname, '..', 'environment', '.env')
  //load up dotenv
  var dotenvResult = dotenv.config({
    path: dotEnvPath
  });

  if(dotenvResult.error){
    throw dotenvResult.error;
  }



  const app = await NestFactory.create(AppModule);
  app.use(helmet());

  if(process.env.DEVELOPMENT == 'TRUE'){
   app.enableCors({origin: '*'})
  } else {
    app.enableCors();
  }


  await app.listen(process.env.NEST_PORT);
}
bootstrap();
