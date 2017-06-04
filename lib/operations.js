'use strict';

function promisify(func) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      func(...args, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };
}

function asyncTry(func) {
  return new Promise((resolve, reject) => {
    try {
      let result = func();
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

function map(values, func, options) {
  let opts = Object.assign({}, {concurrency: 3}, options);
  let resolvers = [];
  let wrappedRuns = [];
  for (let value of values) {
    let wrappedRun = new Promise(resolve => resolvers.push(resolve))
      .then(() => func(value))
      .then(result => {
        runNextPromise();
        return result;
      });
    wrappedRuns.push(wrappedRun);
  }
  new Array(opts.concurrency).fill().forEach(runNextPromise);
  return Promise.all(wrappedRuns);

  function runNextPromise() {
    if (resolvers.length > 0) {
      resolvers[0]();
      resolvers.shift();
    }
  }
}

function mapSeries(values, func) {
  return map(values, func, {concurrency: 1});
}

function delay(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function flow(functions = []) {
  return result => {
    if (functions.length === 0) {
      return Promise.resolve(result);
    }
    let [current, ...next] = functions;
    return asyncTry(() => current(result)).then(flow(next));
  };
}

module.exports = {
  promisify,
  try: asyncTry,
  map,
  mapSeries,
  delay,
  flow
};
