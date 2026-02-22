const express = require('express')
const app = express()
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')


mongoose.connect(config.MONGODB_URI, { family: 4 })
  .then(() => logger.info('Connected to MongoDB Atlas'))
  .catch(err => logger.error('Error connecting to MongoDB:', err))

app.use(express.json())
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}
console.log('NODE_ENV:', process.env.NODE_ENV)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app