const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (req, res, next) => {
  try {
    const { username, name, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'username and password are required' })
    }

    if (username.length < 3) {
      return res.status(400).json({ error: 'username must be at least 3 characters long' })
    }
    if (password.length < 3) {
      return res.status(400).json({ error: 'password must be at least 3 characters long' })
    }

    // password hash
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash
    })

    const savedUser = await user.save()
    res.status(201).json(savedUser)
  } catch (error) {
    // duplicate username
    if (error.code === 11000) {
      return res.status(400).json({ error: 'username must be unique' })
    }
    next(error)
  }
})


usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', { title: 1, url: 1, likes: 1 })
  res.json(users)
})



module.exports = usersRouter