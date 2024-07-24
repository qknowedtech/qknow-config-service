import { BasicAuthValidatorMiddleware } from './basic-auth-validator.middleware';

describe('BasicAuthValidatorMiddleware', () => {
  it('should be defined', () => {
    expect(new BasicAuthValidatorMiddleware()).toBeDefined();
  });
});
