const asyncWrapper = (fn) => {
  const fnWithCatch = (req, res, next) => {
    fn(req, res, next)
      .catch((err) => next(err));
  };
  return fnWithCatch;
};

module.exports = asyncWrapper;
