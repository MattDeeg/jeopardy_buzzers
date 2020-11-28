const getDebouncer = (max = 30) => {
  let running = 0;
  const queued = [];
  const done = () => {
    if (queued.length > 0) {
      queued.shift()(done);
    } else {
      running -= 1;
    }
  };
  return () => {
    if (running < max) {
      running += 1;
      return done;
    }
    return new Promise((resolve) => {
      queued.push(resolve);
    });
  };
};

module.exports = { getDebouncer };
