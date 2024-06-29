const express = require('express');
const path = require('path')
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { checkAuthCookie } = require('./middlewares/auth');

const blog = require('./models/blog');

mongoose
.connect('mongodb://localhost:27017/blogify')
.then(() => console.log('MongoDB connected'))

const app = express();
const port = 8000;

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser())
app.use(checkAuthCookie('token'))
app.use(express.static(path.resolve("./public")))

app.use('/user', userRoute);
app.use('/blog',blogRoute);

app.get('/',async (req, res) => {
    const allBlogs = await blog.find({})
    res.render('home',{
        user: req.user,
        blogs: allBlogs,
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});