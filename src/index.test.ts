import { describe, it, expect } from 'vitest';
import { greet, farewell } from './index';

describe('greet', () => {
  it('should return greeting with name', () => {
    expect(greet('World')).toBe('Hello, World!!');
  });
});

describe('farewell', () => {
  it('should return farewell with name', () => {
    expect(farewell('World')).toBe('Goodbye, World!');
  });
});
