// This is for avoiding repetitive try-catch block on async functions
module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next); // If Error -> proceed to global error handler
};
