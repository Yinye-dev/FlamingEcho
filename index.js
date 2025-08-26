// index.js

const express = require('express');
const path = require('path'); // Node.js module for working with file paths
const fs = require('fs'); // Node.js module for working with the file system
const { marked } = require('marked'); // For converting markdown to HTML
const matter = require('gray-matter'); // For parsing front-matter

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(express.static('public'));

// Homepage route
app.get('/', (req, res) => {
  // 1. Define the path to the posts directory
  const postsDir = path.join(__dirname, 'posts');

app.get('/about', (req, res) => {
    res.render('about'); // This tells Express to find and render views/about.ejs
  });

  // 2. Read all the files in the directory
  const files = fs.readdirSync(postsDir);

  // 3. Read and parse each file's content and front-matter
  const posts = files.map(filename => {
    const slug = filename.replace('.md', ''); // Create a URL-friendly slug
    const fileContent = fs.readFileSync(path.join(postsDir, filename), 'utf-8');
    const { data: frontMatter } = matter(fileContent);

    return {
      slug: slug,
      meta: frontMatter, // The front-matter data (title, author, etc.)
    };
  });

  // 4. Render the index page, passing the posts to it
  res.render('index', { title: 'Flaming Echo', posts: posts });
});

// Single post route
app.get('/posts/:slug', (req, res) => {
    const slug = req.params.slug;
    const filePath = path.join(__dirname, 'posts', `${slug}.md`);
  
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data: frontMatter, content } = matter(fileContent);
      
      // Convert markdown content to HTML
      const htmlContent = marked(content);
      
      res.render('post', { meta: frontMatter, content: htmlContent });
    } catch (error) {
      // If the file doesn't exist, send a 404 page
      res.status(404).send('Story not found!');
    }
  });
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
