
const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0';
// Internal address of lalas-backend. Only ever called server-side from here —
// the backend is never exposed directly to the browser or the public internet.
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

// Set EJS as the templating engine
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Proxy the backend's API server-side so the browser only ever talks to
// lalas-frontend; lalas-backend can stay on a private/internal address.
function proxyGet(backendPath) {
    return async (req, res) => {
        try {
            const { data } = await axios.get(`${BACKEND_URL}${backendPath}`);
            res.json(data);
        } catch (error) {
            console.error(`Error proxying GET ${backendPath}:`, error.message);
            res.status(502).json({ error: 'Failed to reach lalas-backend' });
        }
    };
}

app.get('/api/services', proxyGet('/api/services'));
app.get('/api/apps', proxyGet('/api/apps'));
app.get('/api/machine-status', proxyGet('/api/machine-status'));
app.get('/api/deployed-apps-status', proxyGet('/api/deployed-apps-status'));

app.post('/api/restart/:appName', async (req, res) => {
    try {
        const { data } = await axios.post(`${BACKEND_URL}/api/restart/${encodeURIComponent(req.params.appName)}`, {});
        res.json(data);
    } catch (error) {
        console.error(`Error proxying restart for ${req.params.appName}:`, error.message);
        res.status(502).json({ error: 'Failed to reach lalas-backend' });
    }
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
