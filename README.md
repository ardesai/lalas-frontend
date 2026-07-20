# lalas-frontend

A small Node.js/Express + EJS web UI for viewing and managing a server via
[`lalas-backend`](../lalas-backend). Provides pages to view running apps,
restart them, and check machine (CPU/memory/disk) status.

## Requirements

- Node.js 20+ (uses the built-in `--env-file` flag; see below)
- A running instance of `lalas-backend`, reachable from the browser

## Install

```bash
npm install
```

## Configure

The server binds to `0.0.0.0` by default, so it works on any host/network
without edits. The browser-side pages (Admin/Status) need to know where
`lalas-backend` lives; this is served at runtime via `/config.js` rather than
hardcoded into any JS file.

| Variable       | Default                                             | Description                                                                 |
|----------------|------------------------------------------------------|-------------------------------------------------------------------------------|
| `HOST`         | `0.0.0.0`                                             | Interface to bind to                                                          |
| `PORT`         | `4000`                                                | Port to listen on                                                             |
| `BACKEND_URL`  | *(empty)*                                             | Full URL of `lalas-backend`, e.g. `http://backend-host:3000`. Set this if the backend runs on a different host than the frontend. |
| `BACKEND_PORT` | `3000`                                                | Used only when `BACKEND_URL` is unset — the browser assumes the backend is on the same host as the page it loaded, on this port. |

You can set these inline, export them in your shell, or put them in a `.env`
file and run with Node's built-in env file support:

```bash
# .env
HOST=0.0.0.0
PORT=4000
BACKEND_URL=http://your-backend-host:3000
```

```bash
node --env-file=.env index.js
```

If `BACKEND_URL` is left unset, the client falls back to
`${page protocol}//${page hostname}:${BACKEND_PORT}` — i.e. it assumes the
backend is reachable on the same host the frontend page was loaded from.
Set `BACKEND_URL` explicitly whenever the backend lives elsewhere (different
host, different Tailscale node, etc.).

## Run

```bash
npm start
# or
node index.js
```

## Pages

| Route       | Description                                             |
|-------------|-----------------------------------------------------------|
| `/`         | Home page                                                  |
| `/admin`    | Lists Node.js app services from the backend and lets you restart them |
| `/status`   | Shows machine CPU/memory/disk usage and deployed app status |
| `/personal` | Static personal page                                       |
