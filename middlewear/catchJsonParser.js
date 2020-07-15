module.exports = (err, req, res, next) => {
    if (err) {
      console.log('Invalid Request data: Failed to parse JSON'); //TODO change to winston logger
      res.send(`Invalid Request data: ${err.message}`)
    } else {
      next()
    }
  }