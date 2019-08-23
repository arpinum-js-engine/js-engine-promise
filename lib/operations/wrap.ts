export function wrap<F extends (...args: any[]) => any>(
  func: F
): (...args: Parameters<F>) => Promise<ReturnType<F>>;
export function wrap<F extends (...args: any[]) => Promise<any>>(
  func: F
): (...args: Parameters<F>) => ReturnType<F>;
export function wrap(func: Function): Function {
  return (...args: any[]) => {
    return new Promise((resolve, reject) => {
      try {
        const result = func(...args);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  };
}
