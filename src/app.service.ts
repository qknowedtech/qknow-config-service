import { Injectable, Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import path, { join } from 'path';

@Injectable()
export class AppService {
  getConfiguration(name: string, env?: string) {
    // resolve path
    const resolvedPath = this.resolveConfigPath(name, env ?? 'dev');
    return this.readConfigurationFile(resolvedPath);
  }

  private resolveConfigPath(applicationName: string, env: string) {
    return join(__dirname, 'config', `${applicationName}.${env}.json`);
  }

  private readConfigurationFile(path: string) {
    try {
      const content = readFileSync(path, { encoding: 'utf-8' });
      return JSON.parse(content);
    } catch (error) {
      // Log the error
      Logger.log(error);

      // return an empth object
      return {};
    }
  }
}
