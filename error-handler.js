const updateErrorMessage = 'Update failed: object was already deleted from the database. Fetch current data by refreshing the page.'

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    response.status(400).send({ error: 'malformatted id' })
  } if (error.name === 'ValidationError') {
    response.status(400).json({ error: error.message })
  } if (error.message === updateErrorMessage) {
    response.status(400).json({ error: error.message })
  } if (error.message.includes('duplicate key error')) {
    response.status(409).json({ error: 'Conflict: name is already in database. Try refreshing the page.' })
  }

  next(error)
}

module.exports = { errorHandler, updateErrorMessage }
