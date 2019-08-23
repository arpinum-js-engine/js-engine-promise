import { AnyFunction } from '../types';
import { wrap } from './wrap';

interface Options {
  retryCount?: number;
  onTryError?: AnyFunction;
  onFinalError?: AnyFunction;
}

export function retryWithOptions(
  options: Options,
  func: AnyFunction
): AnyFunction {
  const {
    retryCount = 3,
    onTryError = () => undefined,
    onFinalError = () => undefined
  } = options;
  const wrappedFunc = wrap(func);
  return (...args: any[]) =>
    doRetry({ retryCount, onTryError, onFinalError }, wrappedFunc, ...args);
}

function doRetry(
  options: Required<Options>,
  func: AnyFunction,
  ...args: any[]
): Promise<any> {
  const { retryCount, onTryError, onFinalError } = options;
  return func(...args).catch((error: Error) => {
    const nextRetryCount = retryCount - 1;
    if (nextRetryCount < 0) {
      onFinalError(error);
      throw error;
    }
    onTryError(error);
    return doRetry(
      {
        retryCount: nextRetryCount,
        onTryError,
        onFinalError
      },
      func,
      ...args
    );
  });
}
