const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()
})

describe('user creation restrictions', () => {
  test('fails with status code 400 if username is missing', async () => {
    const newUser = { name: 'NoUsername', password: 'secret' }

    await api.post('/api/users').send(newUser).expect(400)
  })

  test('fails with status code 400 if password is missing', async () => {
    const newUser = { username: 'nopass', name: 'NoPassword' }

    await api.post('/api/users').send(newUser).expect(400)
  })

  test('fails with status code 400 if username is shorter than 3 chars', async () => {
    const newUser = { username: 'ab', name: 'ShortUser', password: 'secret' }

    await api.post('/api/users').send(newUser).expect(400)
  })

  test('fails with status code 400 if password is shorter than 3 chars', async () => {
    const newUser = { username: 'validuser', name: 'ShortPass', password: '12' }

    await api.post('/api/users').send(newUser).expect(400)
  })

  test('fails with status code 400 if username already exists', async () => {
    const newUser = { username: 'root', name: 'Duplicate', password: 'secret' }

    await api.post('/api/users').send(newUser).expect(400)
  })
})

describe('GET /api/users', () => {
  test('returns all users in JSON format', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    
    const usersAtStart = await User.find({})
    expect(response.body).toHaveLength(usersAtStart.length)

    
    response.body.forEach(user => {
      expect(user.passwordHash).toBeUndefined()
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})