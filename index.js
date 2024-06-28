const express = require('express');
const path = require('path')


const app = express();
const port = 8000;

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.get('/', (req, res) => {
    return res.render('home');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});