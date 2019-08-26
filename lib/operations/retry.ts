import { AnyFunction, PromisifiedFunction } from '../types';
import { wrap } from './wrap';

interface Options {
  retryCount?: number;
  onTryError?: AnyFunction;
  onFinalError?: AnyFunction;
}

export function retryWithOptions<F extends AnyFunction>(
  options: Options,
  func: F
): PromisifiedFunction<F> {
  const {
    retryCount = 3,
    onTryError = () => undefined,
    onFinalError = () => undefined
  } = options;
  const wrappedFunc = wrap(func);
  return (...args: Parameters<F>) => {
    return wrappedFunc(...args).catch((error: Error) => {
      const nextRetryCount = retryCount - 1;
      if (nextRetryCount < 0) {
        onFinalError(error);
        throw error;
      }
      onTryError(error);
      return retryWithOptions(
        {
          retryCount: nextRetryCount,
          onTryError,
          onFinalError
        },
        wrappedFunc
      )(...args);
    });
  };
}
