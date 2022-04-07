import { CustomErrorInstance } from '~/plugins/error';

const CustomError = class CustomError extends Error {
  constructor(label: string, extra?: object) {
    super(label, extra);
    Object.defineProperty(this, 'name', {
      get: () => (this.constructor as any).name,
    });
    Object.defineProperty(this, 'label', {
      get: () => label,
    });
    Object.defineProperty(this, 'extra', {
      get: () => extra || {},
    });
    Error.captureStackTrace(this, this.constructor);
  }
} as any as CustomErrorInstance;

export default CustomError;
