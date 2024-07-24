import { HttpService } from '@nestjs/axios';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class BasicAuthValidatorMiddleware implements NestMiddleware {
  constructor (private http: HttpService) {}

  use(req: any, res: any, next: () => void) {
    next();
  }

  private validateBaiscAuth () {
    
  }
}
