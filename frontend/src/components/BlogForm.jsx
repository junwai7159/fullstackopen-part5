const BlogForm = ({ 
    addBlog,
    handleTitleChange,
    handleAuthorChange,
    handleUrlChange,
    title,
    author,
    url
 }) => (
  <form onSubmit={addBlog}>
    <div>
      title: 
        <input
        type="text"
        value={title}
        name="Title"
        onChange={({ target }) => handleTitleChange(target.value)}
        />
    </div>
    <div>
      author: 
        <input
        type="text"
        value={author}
        name="Author"
        onChange={({ target }) => handleAuthorChange(target.value)}
        />
    </div>
    <div>
      url: 
        <input
        type="text"
        value={url}
        name="Url"
        onChange={({ target }) => handleUrlChange(target.value)}
        />
    </div>
    <button type="submit">create</button>
  </form>
)

export default BlogForm