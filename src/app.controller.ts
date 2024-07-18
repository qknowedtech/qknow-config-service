import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   *  This returns an applications configuration
   * @param applicationName
   * @param env
   * @returns
   */

  @Get('config/:application')
  getApplicationConfiguration(
    @Param('application') applicationName: string,
    @Query('env') env: string,
  ) {
    return this.appService.getConfiguration(applicationName, env);
  }
}
