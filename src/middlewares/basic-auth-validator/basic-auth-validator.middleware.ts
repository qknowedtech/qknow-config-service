import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Request, Response, NextFunction } from 'express';


@Injectable()
export class BasicAuthValidatorMiddleware implements NestMiddleware {

  constructor(private http: HttpService) { }


  async use(req: Request, res: Response, next: NextFunction) {

    const authorization = req.get('authorization');


    if (!authorization || !authorization.startsWith('Basic ')) {

      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const response = await this.verifyBasicAuth(authorization);

    if (response.data.status === 'success') {

      next();
    } else {

      throw new UnauthorizedException('Invalid authorization token');
    }
  }

  private async verifyBasicAuth(authorization: string) {
    try {

      const response: AxiosResponse = await new Promise((resolve, reject) =>
        this.http
          .get<{ status: string }>(
            'https://qknow-exams-gateway-czp9f0ks.uc.gateway.dev/auth/tokens/basic/verify',
            {
              headers: { Authorization: authorization },
              timeout: 200000,
            },
          )
          .subscribe({
            next: (response) => {

              resolve(response);
            },
            error: (error) => {

              reject(error);
            },
          }),
      );

      return response;
    } catch (error) {

      throw new UnauthorizedException('Error during authorization verification');
    }
  }
}
