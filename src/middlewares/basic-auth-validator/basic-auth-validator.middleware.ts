import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class BasicAuthValidatorMiddleware implements NestMiddleware {
  constructor(private http: HttpService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const response = await this.verifyBasicAuth(
      this.getAuthorizationToken(req),
    );

    if (response.valid) {
      next();
    } else {
      throw new UnauthorizedException('Invalid authorization token');
    }
  }

  private getAuthorizationToken(req: Request) {
    return `Basic ${req.get('authorization')}`;
  }

  private async verifyBasicAuth(authorization: string) {
    try {
      const response: AxiosResponse<{ status: string }> = await new Promise(
        (resolve, reject) =>
          this.http
            .get<{
              status: string;
            }>(`${process.env.AUTHORIZATION_SERVER}/tokens/basic/verify`, {
              headers: { Authorization: authorization },
            })
            .subscribe({
              next: (response) => resolve(response),
              error: (error) => reject(error),
            }),
      );

      return {
        valid: response.data.status === 'success',
      };
    } catch (error) {
      Logger.log(error, BasicAuthValidatorMiddleware.name);
      return { valid: false };
    }
  }
}
