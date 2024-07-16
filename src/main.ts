import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

  const logger = new Logger('Payments-Main')

  const app = await NestFactory.create(AppModule, {
    rawBody: true
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true
    }
  }))


  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: envs.natsServers
    },
  },

  )

  app.setGlobalPrefix('api');

  await app.startAllMicroservices();
  await app.listen(envs.port);

  logger.log(`Server is running on ${await app.getUrl()}`);
}
bootstrap();
