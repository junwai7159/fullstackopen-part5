const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

const isValidToken = request => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  return decodedToken
};

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, _id: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.get('/:id', async (request, response) => {
  console.log(request.params.id)
  const blog = await Blog.findById(request.params.id)
  response.json(blog.toJSON())
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const blog = new Blog({...request.body, user: user._id})

  if (typeof blog.likes === 'undefined' || blog.likes === null) {
    blog.likes = 0
  }

  if (typeof blog.title === 'undefined' || blog.title === null || typeof blog.url === 'undefined' || blog.url === null) {
    response.status(400).end()
  } else {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog.toJSON())
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user
  
  try {
    const blog = await Blog.findById(request.params.id)
    if (blog.user.toString() === user.id) {
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end()    
    } else {
      response.status(400).end()
    }
  } catch (error) {
    response.status(400).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = {
    likes: request.body.likes
  }
  try {
    const result = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(result.toJSON())
  } catch (error) {
    response.status(400).end()
  }
})

module.exports = blogsRouter