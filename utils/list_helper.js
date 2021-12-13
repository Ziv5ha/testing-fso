const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  let totalLikes = 0;
  blogs.forEach((blog) => {
    totalLikes += Number(blog.likes);
  });
  return totalLikes;
};

const favoriteBlog = (blogs) => {
  let mostLikesNum = 0;
  blogs.forEach((blog) => {
    if (blog.likes > mostLikesNum) mostLikesNum = blog.likes;
  });
  const favoriteBlog = blogs.find((blog) => blog.likes === mostLikesNum);
  return {
    title: favoriteBlog.title,
    author: favoriteBlog.author,
    likes: favoriteBlog.likes,
  };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return 'no blogs were given';

  const BlogsForAuthors = getBlogsForAuthors(blogs);
  let mostBlogsNum = 0;
  BlogsForAuthors.forEach((author) => {
    if (author.blogs > mostBlogsNum) mostBlogsNum = author.blogs;
  });
  const mostBlogsByAuthor = BlogsForAuthors.find(
    (author) => author.blogs === mostBlogsNum
  );
  return {
    author: mostBlogsByAuthor.author,
    blogs: mostBlogsByAuthor.blogs,
  };
};
const mostLikes = (blogs) => {
  if (blogs.length === 0) return 'no blogs were given';

  const BlogsForAuthors = getBlogsForAuthors(blogs);
  let mostlikesNum = 0;
  BlogsForAuthors.forEach((author) => {
    if (author.likes > mostlikesNum) mostlikesNum = author.likes;
  });
  const mostBlogsByAuthor = BlogsForAuthors.find(
    (author) => author.likes === mostlikesNum
  );
  return {
    author: mostBlogsByAuthor.author,
    likes: mostBlogsByAuthor.likes,
  };
};

const getAuthors = (blogs) => {
  const authors = [];
  blogs.forEach((blog) => {
    if (!authors.includes(blog.author)) {
      authors.push(blog.author);
    }
  });
  return authors;
};
const getBlogsForAuthors = (blogs) => {
  const authorsArr = getAuthors(blogs);
  const BlogsForAuthors = authorsArr.map((author) => {
    const AuthorsBlogs = blogs.filter((blog) => blog.author === author);
    const totalLokesForAuthor = totalLikes(AuthorsBlogs);
    return {
      author,
      blogs: AuthorsBlogs.length,
      likes: totalLokesForAuthor,
    };
  });
  return BlogsForAuthors;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
