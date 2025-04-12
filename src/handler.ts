import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from 'aws-lambda';
import type { Express } from 'express';
import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@codegenie/serverless-express';
import { AppModule } from './app.module';

let appHandler: Handler;

async function createAppHandler() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  await app.init();
  const expressApp: Express = app.getHttpAdapter().getInstance();

  return serverlessExpress({ app: expressApp });
}

export const handler: Handler<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> = async (...params) => {
  if (!appHandler) {
    appHandler = await createAppHandler();
  }

  return appHandler(...params);
};
