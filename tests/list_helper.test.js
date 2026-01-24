const listHelper = require('../utils/list_helper')

describe('dummy', () => {
  test('returns one', () => {
    const blogs = []
    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
  })
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const listWithOneBlog = [
      {
        title: 'Test Blog',
        author: 'AreInch',
        url: 'http://example.com',
        likes: 5,
      },
    ]

    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const blogs = [
      { title: 'Blog A', author: 'Author A', url: 'urlA', likes: 7 },
      { title: 'Blog B', author: 'Author B', url: 'urlB', likes: 5 },
      { title: 'Blog C', author: 'Author C', url: 'urlC', likes: 12 },
    ]

    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(24)
  })
})

describe('favorite blog', () => {
  test('of empty list is null', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toBe(null)
  })

  test('when list has only one blog equals that blog', () => {
    const listWithOneBlog = [
      { title: 'Single Blog', author: 'AreInch', url: 'http://example.com', likes: 10 },
    ]
    const result = listHelper.favoriteBlog(listWithOneBlog)
    expect(result).toEqual(listWithOneBlog[0])
  })

  test('of a bigger list returns the one with most likes', () => {
    const blogs = [
      { title: 'Blog A', author: 'Author A', url: 'urlA', likes: 7 },
      { title: 'Blog B', author: 'Author B', url: 'urlB', likes: 15 },
      { title: 'Blog C', author: 'Author C', url: 'urlC', likes: 12 },
    ]
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual(blogs[1]) // Blog B has 15 likes
  })
})

describe('most blogs', () => {
  test('of empty list is null', () => {
    const result = listHelper.mostBlogs([])
    expect(result).toBe(null)
  })

  test('when list has only one blog equals that author with count 1', () => {
    const blogs = [
      { title: 'Single Blog', author: 'AreInch', url: 'http://example.com', likes: 10 },
    ]
    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual({ author: 'AreInch', blogs: 1 })
  })

  test('of a bigger list returns the author with most blogs', () => {
    const blogs = [
      { title: 'Blog A', author: 'Author A', url: 'urlA', likes: 7 },
      { title: 'Blog B', author: 'Author B', url: 'urlB', likes: 5 },
      { title: 'Blog C', author: 'Author A', url: 'urlC', likes: 12 },
      { title: 'Blog D', author: 'Author A', url: 'urlD', likes: 3 },
      { title: 'Blog E', author: 'Author B', url: 'urlE', likes: 8 },
    ]
    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual({ author: 'Author A', blogs: 3 })
  })
})

describe('most likes', () => {
  test('of empty list is null', () => {
    const result = listHelper.mostLikes([])
    expect(result).toBe(null)
  })

  test('when list has only one blog equals that author with likes', () => {
    const blogs = [
      { title: 'Single Blog', author: 'AreInch', url: 'http://example.com', likes: 10 },
    ]
    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual({ author: 'AreInch', likes: 10 })
  })

  test('of a bigger list returns the author with most total likes', () => {
    const blogs = [
      { title: 'Blog A', author: 'Author A', url: 'urlA', likes: 7 },
      { title: 'Blog B', author: 'Author B', url: 'urlB', likes: 15 },
      { title: 'Blog C', author: 'Author A', url: 'urlC', likes: 12 },
      { title: 'Blog D', author: 'Author C', url: 'urlD', likes: 20 },
      { title: 'Blog E', author: 'Author A', url: 'urlE', likes: 5 },
    ]
    const result = listHelper.mostLikes(blogs)
    // Author A toplam 24 likes, Author B 15, Author C 20 → en çok Author A
    expect(result).toEqual({ author: 'Author A', likes: 24 })
  })
})
