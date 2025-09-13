// index.js

const express = require('express');
const path = require('path');
const fs = require('fs');
const { marked } = require('marked');
const matter = require('gray-matter');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views')); 
app.use(express.static(path.join(process.cwd(), 'public')));

// --- ROUTES ---

// Homepage route
app.get('/', (req, res) => {
  // Use process.cwd() for a reliable path in Vercel
  const postsDir = path.join(process.cwd(), 'posts');
  let files = fs.readdirSync(postsDir);
  files = files.filter(file => path.extname(file) === '.md');

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

// Contact page route
app.get('/contact', (req, res) => {
  res.render('contact', {
      title: 'Contact - Flaming Echo',
      page: 'contact'
  });
});

// Stories page route
app.get('/stories', (req, res) => {
  // Use process.cwd() for a reliable path in Vercel
  const postsDir = path.join(process.cwd(), 'posts');
  let files = fs.readdirSync(postsDir);
  files = files.filter(file => path.extname(file) === '.md');

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
    // Use process.cwd() for a reliable path in Vercel
    const filePath = path.join(process.cwd(), 'posts', `${slug}.md`);
  
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
      console.error("Error reading post file:", error);
      res.status(404).send('Story not found!');
    }
});

// This block allows the server to run locally for testing,
// but Vercel will ignore it and use the module.exports line.
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

// Export the app for Vercel
module.exports = app;