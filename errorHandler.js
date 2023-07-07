const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    response.status(400).send({ error: 'malformatted id' })
  } if (error.name === 'ValidationError') {
    response.status(400).json({ error: error.message })
  } if (error.name === 'UpdateError') {
    response.status(400).json({ error: error.message})
  }

  next(error)
}

module.exports = errorHandler
