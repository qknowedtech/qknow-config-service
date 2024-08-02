import { HttpModule } from '@nestjs/axios';
import {
  Module
} from '@nestjs/common';
import * as dotenv from 'dotenv';
import { AppController } from './app.controller';
import { AppService } from './app.service';

dotenv.config();

@Module({
  imports: [HttpModule.register({ timeout: 5000, maxRedirects: 5 })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
