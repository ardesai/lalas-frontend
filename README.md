# lalas-frontend

A small Node.js/Express + EJS web UI for viewing and managing a server via
[`lalas-backend`](../lalas-backend). Provides pages to view running apps,
restart them, and check machine (CPU/memory/disk) status.

## Requirements

- Node.js 20+ (uses the built-in `--env-file` flag; see below)
- A running instance of `lalas-backend`, reachable from this server (not
  necessarily from the browser — see Architecture below)

## Install

```bash
npm install
```

## Architecture: backend stays private

`lalas-backend` is never called directly from the browser. Instead,
`lalas-frontend`'s server proxies `/api/*` requests to it server-side (see
`index.js`), and the browser only ever talks to `lalas-frontend`'s own
origin. This means `lalas-backend` can bind to `localhost` or an internal/VPN
address and never needs a public route (e.g. no Cloudflare Tunnel ingress for
it) — important since it can restart services and run shell commands on the
host.

```
Browser --(https, public)--> lalas-frontend --(http, private)--> lalas-backend
```

## Configure

The server binds to `0.0.0.0` by default, so it works on any host/network
without edits.

| Variable      | Default                   | Description                                                                 |
|---------------|---------------------------|-------------------------------------------------------------------------------|
| `HOST`        | `0.0.0.0`                 | Interface to bind to                                                          |
| `PORT`        | `4000`                    | Port to listen on                                                             |
| `BACKEND_URL` | `http://localhost:3000`   | Where `lalas-backend` is reachable *from this server*. Only used server-side — never sent to the browser. Change this if the backend runs on a different host/port on your private network. |

You can set these inline, export them in your shell, or put them in a `.env`
file and run with Node's built-in env file support:

```bash
# .env
HOST=0.0.0.0
PORT=4000
BACKEND_URL=http://localhost:3000
```

```bash
node --env-file=.env index.js
```

## Run

```bash
npm start
# or
node index.js
```

## Deploying behind a public tunnel (e.g. Cloudflare Tunnel)

Only point your tunnel's ingress at `lalas-frontend` (e.g. `PORT`, default
`4000`). Do **not** add a public ingress rule for `lalas-backend` — it should
stay reachable only from `lalas-frontend` on the same host or private
network.

## Pages

| Route       | Description                                             |
|-------------|-----------------------------------------------------------|
| `/`         | Home page                                                  |
| `/admin`    | Lists Node.js app services from the backend and lets you restart them |
| `/status`   | Shows machine CPU/memory/disk usage and deployed app status |
| `/personal` | Static personal page                                       |

## API (proxied to lalas-backend)

| Method | Path                       | Proxies to lalas-backend      |
|--------|----------------------------|--------------------------------|
| GET    | `/api/services`             | `GET /api/services`            |
| GET    | `/api/apps`                 | `GET /api/apps`                |
| GET    | `/api/machine-status`       | `GET /api/machine-status`      |
| GET    | `/api/deployed-apps-status` | `GET /api/deployed-apps-status`|
| POST   | `/api/restart/:appName`     | `POST /api/restart/:appName`   |
