const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const api = supertest(app)

let token
let testUserId

beforeAll(async () => {
  await User.deleteMany({})

  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'password123'
  }
  const userResponse = await api.post('/api/users').send(newUser)
  testUserId = userResponse.body.id || userResponse.body._id

  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'testuser', password: 'password123' })

  token = loginResponse.body.token
  console.log('Token in tests:', token) 
})



beforeEach(async () => {
  await Blog.deleteMany({})

  const initialBlogs = [
    { title: 'Blog A', author: 'Author A', url: 'urlA', likes: 7, user: testUserId },
    { title: 'Blog B', author: 'Author B', url: 'urlB', likes: 5, user: testUserId },
  ]

  await Blog.insertMany(initialBlogs)
})


describe('GET /api/blogs', () => {
  test('returns the correct amount of blog posts in JSON format', async () => {
    const response = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(2)
  })
})


describe('unique identifier property', () => {
  test('is named id instead of _id', async () => {
    const response = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogs = response.body
    blogs.forEach(blog => {
      expect(blog.id).toBeDefined()
      expect(blog._id).toBeUndefined()
    })
  })
})

test('a valid blog can be added with token', async () => {
  const newBlog = {
    title: 'Token Protected Blog',
    author: 'AreInch',
    url: 'http://example.com',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)   
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.find({})
  expect(blogsAtEnd).toHaveLength(3) 
  expect(blogsAtEnd.map(b => b.title)).toContain('Token Protected Blog')
})

test('adding a blog fails with 401 if token is not provided', async () => {
  const newBlog = {
    title: 'Unauthorized Blog',
    author: 'Anonim',
    url: 'http://example.com',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)   
    .expect(401)

  const blogsAtEnd = await Blog.find({})
  expect(blogsAtEnd).toHaveLength(2) 
})


describe('PUT /api/blogs/:id', () => {
  test('successfully updates the likes of a blog post', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToUpdate = blogsAtStart[0]

    const updatedData = { likes: blogToUpdate.likes + 10 }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBe(blogToUpdate.likes + 10)

    const blogInDb = await Blog.findById(blogToUpdate.id)
    expect(blogInDb.likes).toBe(blogToUpdate.likes + 10)
  })
})

test('a blog can be deleted by its creator', async () => {
  // blogs
  const blogsAtStart = await Blog.find({})
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete._id}`)
    .set('Authorization', `Bearer ${token}`)   // creator token
    .expect(204)

  const blogsAtEnd = await Blog.find({})
  expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
  expect(blogsAtEnd.map(b => b.title)).not.toContain(blogToDelete.title)
})

test('deleting a blog fails with 401 if token is not provided', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete._id}`)
    .expect(401)

  const blogsAtEnd = await Blog.find({})
  expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
})

test('deleting a blog fails with 403 if token belongs to another user', async () => {
  // new user
  const anotherUser = {
    username: 'otheruser',
    name: 'Other User',
    password: 'password456'
  }
  await api.post('/api/users').send(anotherUser)

  // Login token
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'otheruser', password: 'password456' })

  const otherToken = loginResponse.body.token

  const blogsAtStart = await Blog.find({})
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete._id}`)
    .set('Authorization', `Bearer ${otherToken}`)  
    .expect(403)

  const blogsAtEnd = await Blog.find({})
  expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
})

afterAll(async () => {
  await mongoose.connection.close()
})