type Promisified<T> = [T] extends [never]
  ? Promise<never>
  : T extends Promise<any>
  ? T
  : Promise<T>;

export function wrap<F extends (...args: any[]) => any>(
  func: F
): (...args: Parameters<F>) => Promisified<ReturnType<F>> {
  return (...args: any[]) => {
    return new Promise((resolve, reject) => {
      try {
        const result = func(...args);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }) as Promisified<ReturnType<F>>;
  };
}
