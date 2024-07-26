
import { MiddlewareConsumer, Module, NestModule, Logger, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import * as dotenv from 'dotenv';
import { BasicAuthValidatorMiddleware } from './middlewares/basic-auth-validator/basic-auth-validator.middleware';

dotenv.config();

@Module({

  imports: [HttpModule.register({ timeout: 5000, maxRedirects: 5 })],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {

    consumer.apply(BasicAuthValidatorMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
  constructor() {
    Logger.log(`PORT: ${process.env.PORT}`, 'AppModule');
  }
}
