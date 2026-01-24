const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((favorite, blog) => {
    return blog.likes > favorite.likes ? blog : favorite
  })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  // authors blog calculate
  const authorCounts = blogs.reduce((counts, blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
    return counts
  }, {})

  // Most blogs
  const topAuthor = Object.keys(authorCounts).reduce((a, b) =>
    authorCounts[a] > authorCounts[b] ? a : b
  )

  return {
    author: topAuthor,
    blogs: authorCounts[topAuthor],
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  // Sum of likes
  const authorLikes = blogs.reduce((likes, blog) => {
    likes[blog.author] = (likes[blog.author] || 0) + blog.likes
    return likes
  }, {})

  // Most like author
  const topAuthor = Object.keys(authorLikes).reduce((a, b) =>
    authorLikes[a] > authorLikes[b] ? a : b
  )

  return {
    author: topAuthor,
    likes: authorLikes[topAuthor],
  }
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
