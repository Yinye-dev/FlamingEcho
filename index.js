// index.js

const express = require('express');
const path = require('path');
const fs = require('fs');
const { marked } = require('marked');
const matter = require('gray-matter');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// --- ROUTES ---

// Homepage route
app.get('/', (req, res) => {
  const postsDir = path.join(__dirname, 'posts');
  const files = fs.readdirSync(postsDir);

  const allPosts = files.map(filename => {
    const slug = filename.replace('.md', '');
    const fileContent = fs.readFileSync(path.join(postsDir, filename), 'utf-8');
    const { data: frontMatter } = matter(fileContent);

    return { slug, meta: frontMatter };
  });

  const featuredPosts = allPosts
    .sort((a, b) => new Date(b.meta.date) - new Date(a.meta.date))
    .slice(0, 3);

  res.render('index', { 
    title: 'Flaming Echo', 
    tagline: 'Words that burn. Stories that linger.<br>— Yinye',
    page: 'home', 
    posts: featuredPosts
  });
});

// About page route 
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Yinye',
        page: 'about'
    });
});

// Stories page route 
app.get('/stories', (req, res) => {
  const postsDir = path.join(__dirname, 'posts');
  const files = fs.readdirSync(postsDir);

  const posts = files.map(filename => {
    const slug = filename.replace('.md', '');
    const fileContent = fs.readFileSync(path.join(postsDir, filename), 'utf-8');
    const { data: frontMatter } = matter(fileContent);

    return {
      slug: slug,
      meta: frontMatter,
    };
  });

  
  res.render('stories', { 
      title: 'All Stories', 
      posts: posts, 
      page: 'stories'
  });
});

// Single post route 
app.get('/posts/:slug', (req, res) => {
  const slug = req.params.slug;
  const filePath = path.join(__dirname, 'posts', `${slug}.md`);

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data: frontMatter, content } = matter(fileContent);
    const htmlContent = marked(content);
    
    res.render('post', { 
        title: frontMatter.title, 
        meta: frontMatter, 
        content: htmlContent,
        page: 'post'
    });
  } catch (error) {
    // Log the error to the console to help debug in the future
    console.error("Error reading post file:", error);
    res.status(404).send('Story not found!');
  }
});

// Export the app for Vercel
module.exports = app;