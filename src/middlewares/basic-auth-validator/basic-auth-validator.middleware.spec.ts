import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { BasicAuthValidatorMiddleware } from './basic-auth-validator.middleware';
import { Request, Response, NextFunction } from 'express';
import { of, throwError } from 'rxjs';
import { UnauthorizedException } from '@nestjs/common';

const mockHttpService = {
  get: jest.fn(),
};

describe('BasicAuthValidatorMiddleware', () => {
  let middleware: BasicAuthValidatorMiddleware;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BasicAuthValidatorMiddleware,
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    middleware = module.get<BasicAuthValidatorMiddleware>(BasicAuthValidatorMiddleware);

    req = {
      get: jest.fn(),
    };
    res = {};
    next = jest.fn();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should reject invalid auth', async () => {
    const authorizationHeader = 'Basic dXNlcjpwYXNzd29yZA==';
    req.get = jest.fn().mockReturnValue(authorizationHeader);

    mockHttpService.get = jest.fn().mockReturnValue(of({
      data: { status: 'failed' },
    }));

    await expect(middleware.use(req as Request, res as Response, next)).rejects.toThrowError('Invalid authorization token');
  });

  it('should handle errors during auth verification', async () => {
    const authorizationHeader = 'Basic dXNlcjpwYXNzd29yZA==';
    req.get = jest.fn().mockReturnValue(authorizationHeader);

    mockHttpService.get = jest.fn().mockReturnValue(throwError(() => new Error('Network error')));

    await expect(middleware.use(req as Request, res as Response, next)).rejects.toThrowError('Error during authorization verification');
  });

  it('should throw UnauthorizedException for invalid auth', async () => {
    const authorizationHeader = 'Basic InvalidToken';
    req.get = jest.fn().mockReturnValue(authorizationHeader);

    mockHttpService.get = jest.fn().mockReturnValue(of({
      data: { status: 'failed' },
    }));

    try {
      await middleware.use(req as Request, res as Response, next);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toBe('Invalid authorization token');
    }

    expect(next).not.toHaveBeenCalled(); 
  });

  it('should throw unauthorized exception if no authorization header', async () => {
    req.get = jest.fn().mockReturnValue(null);

    await expect(middleware.use(req as Request, res as Response, next)).rejects.toThrowError('Missing or invalid authorization header');
  });

  it('should throw unauthorized exception if authorization header is invalid', async () => {
    const authorizationHeader = 'Bearer token';
    req.get = jest.fn().mockReturnValue(authorizationHeader);

    await expect(middleware.use(req as Request, res as Response, next)).rejects.toThrowError('Missing or invalid authorization header');
  });
});
