import { HttpError } from '@/lib/utils/errors';

describe('HttpError', () => {
  it('should set status and message', () => {
    const err = new HttpError(404, 'Not found');
    expect(err.status).toBe(404);
    expect(err.message).toBe('Not found');
    expect(err.name).toBe('HttpError');
    expect(err).toBeInstanceOf(Error);
  });

  it('should be instance of HttpError', () => {
    const err = new HttpError(500, 'Server error');
    expect(err).toBeInstanceOf(HttpError);
  });

  it('should preserve prototype for instanceof checks', () => {
    const err = new HttpError(400, 'Bad request');
    // Simulate cross-realm scenario by checking prototype chain
    expect(Object.getPrototypeOf(err)).toBe(HttpError.prototype);
    expect(err instanceof HttpError).toBe(true);
  });

  it('should allow custom error properties', () => {
    const err = new HttpError(418, 'I\'m a teapot') as any;
    err.extra = 'custom';
    expect(err.extra).toBe('custom');
  });
});
