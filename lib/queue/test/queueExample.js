'use strict';

const {delay} = require('../../operations');
const QueueManager = require('../queueManager');

if (require.main === module) {
  example();
}

function example() {
  let queue = new QueueManager().queue('1', {capacity: 3});

  const min = 50;
  const max = 700;

  queue.enqueue(() => eventuallyLog('1'));

  delay(1000).then(() => {
    queue.enqueue(() => eventuallyLog('2'));
    queue.enqueue(() => eventuallyLog('3'));
    queue.enqueue(() => eventuallyLogThenFail('4'));
  });

  delay(1300).then(() => {
    queue.enqueue(() => eventuallyLog('5'));
  });

  delay(1800).then(() => {
    queue.enqueue(() => eventuallyLog('6'));
    queue.enqueue(() => eventuallyLog('7'));
    queue.enqueue(() => eventuallyLogThenFail('8'));
    queue.enqueue(() => eventuallyLog('9'));
    queue.enqueue(() => eventuallyLog('10'));
  });

  function eventuallyLogThenFail(message) {
    return eventuallyLog(message)
      .then(() => Promise.reject('bleh'));
  }

  function eventuallyLog(message) {
    return delay(random(min, max))
      .then(() => console.log(message));
  }

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }
}

