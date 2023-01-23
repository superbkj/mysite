const info = (...params) => {
  console.log(...params);
};

const error = (...params) => {
  console.error(...params);
};

const obj = (object) => {
  console.dir(object);
};

module.exports = { info, error, obj };
