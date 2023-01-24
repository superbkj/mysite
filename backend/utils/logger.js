const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params);
  }
};

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params);
  }
};

const obj = (object) => {
  if (process.env.NODE_ENV !== 'test') {
    console.dir(object);
  }
};

module.exports = { info, error, obj };
