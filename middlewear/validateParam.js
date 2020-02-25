module.exports = (validator, paramPath) => {
  return (req, res, next) => {
    const { error } = validator(req.params[paramPath]);
    if (error) return res.status(400).send(error.details[0].message);
    next();
  };
};