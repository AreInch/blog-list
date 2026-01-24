const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

blogsRouter.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (blog) {
      res.json(blog)
    } else {
      res.status(404).json({ error: 'Blog not found' })
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid ID format' })
  }
})

blogsRouter.post('/', middleware.userExtractor, async (req, res) => {
  const { title, url, author, likes } = req.body
  const user = req.user

  if (!user) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = new Blog({
    title,
    url,
    author,
    likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.status(201).json(savedBlog)
})


blogsRouter.put('/:id', async (req, res) => {
  const { likes } = req.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    { likes },
    { new: true, runValidators: true, context: 'query' }
  )

  if (updatedBlog) {
    res.json(updatedBlog)
  } else {
    res.status(404).end()
  }
})


blogsRouter.delete('/:id', middleware.userExtractor, async (req, res, next) => {
  try {
    const user = req.user
    if (!user) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = await Blog.findById(req.params.id)
    if (!blog) {
      return res.status(404).json({ error: 'blog not found' })
    }

    if (blog.user.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'only the creator can delete this blog' })
    }

    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})



module.exports = blogsRouter