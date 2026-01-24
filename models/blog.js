const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

,
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v

    return {
      url: returnedObject.url,
      title: returnedObject.title,
      author: returnedObject.author,
      user: returnedObject.user
        ? {
            username: returnedObject.user.username,
            name: returnedObject.user.name,
            id: returnedObject.user.id || returnedObject.user._id.toString()
          }
        : null,
      likes: returnedObject.likes,
      id: returnedObject.id
    }
  }
})



module.exports = mongoose.model('Blog', blogSchema)