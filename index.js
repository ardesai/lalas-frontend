
const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0';
// Backend URL the browser should call. If unset, the client falls back to
// the page's own hostname on BACKEND_PORT (i.e. assumes backend runs on the same host).
const BACKEND_URL = process.env.BACKEND_URL || '';
const BACKEND_PORT = process.env.BACKEND_PORT || 3000;

// Set EJS as the templating engine
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Runtime config for client-side scripts, so the backend location isn't
// hardcoded into any static JS file. Set BACKEND_URL to point at a
// backend on a different host; otherwise the client assumes same-host.
app.get('/config.js', (req, res) => {
    res.type('application/javascript');
    res.send(`window.APP_CONFIG = ${JSON.stringify({ backendUrl: BACKEND_URL, backendPort: BACKEND_PORT })};`);
});

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
app.listen(PORT, HOST, () => {
    console.log(`Lalas Frontend listening at http://${HOST}:${PORT}`);
});
