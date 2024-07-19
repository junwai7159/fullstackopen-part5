import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const [message, setMessage] = useState({
    message: null,
    isError: false
  })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({ 
        username, password
      }) // { token, username, name}
      
      // save login detials to local storage
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)

      setUser(user) 
      setUsername('')
      setPassword('')
    } catch (err) {
      setMessage({
        message: 'wrong username or password',
        isError: true
      })
      setTimeout(() => {
        setMessage({ message: null, isError: false })
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null) 
    setUsername('')
    setPassword('')
    window.location.reload()
  }

  const addBlog = async (event) => {
    event.preventDefault()

    try {
      const blogObject = {
        title,
        author, 
        url
      }

      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      setMessage({
        message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        isError: false
      })
      setTimeout(() => {
        setMessage({ message: null, isError: false })
      }, 5000)
    } catch (err) {
      setMessage({
        message: 'the title and url are required in a valid format',
        isError: true
      })
      setTimeout(() => {
        setMessage({ message: null, isError: false })
      }, 5000)
    }
  }

  return (
    <div>      
      <Notification message={message.message} isError={message.isError} />

      {user === null 
        ? <LoginForm handleLogin={handleLogin} handleUsernameChange={setUsername} handlePasswordChange={setPassword} username={username} password={password} />
        : <div>
            <h2>blogs</h2>
            <p>
              {user.name} logged-in
              <button type="button" onClick={handleLogout}>
                logout
              </button>
            </p>
            <h2>create new</h2>
            <BlogForm  addBlog={addBlog} handleTitleChange={setTitle} handleAuthorChange={setAuthor} handleUrlChange={setUrl} title={title} author={author} url={url} />
            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} />
            )}
          </div>
      }
    </div>
  )
}

export default App