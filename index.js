
const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const app = express();
const PORT = 4000;

// Set EJS as the templating engine
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

app.get('/admin', (req, res) => {
    res.render('admin', { title: 'Admin' });
});

app.get('/status', (req, res) => {
    res.render('status', { title: 'Status' });
});

app.get('/personal', (req, res) => {
    res.render('personal', { title: 'Personal' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Lalas Frontend listening on port ${PORT}`);
});
