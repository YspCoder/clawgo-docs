# WebUI Deployment

## Repository And Positioning

The standalone frontend repository is:

- [YspCoder/clawgo-web](https://github.com/YspCoder/clawgo-web)

It no longer depends on the older `/webui` mount style and does not need to be served from the Gateway binary.

## Local Development

```bash
git clone https://github.com/YspCoder/clawgo-web.git
cd clawgo-web
npm install
npm run dev
```

Common commands:

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

## Production Build

```bash
npm install
npm run build
```

The build output is:

```text
dist/
```

That can be deployed to static hosting platforms such as Cloudflare Pages, Vercel, Netlify, or your own Nginx.

## Login And Connection Flow

Recent `clawgo-web` versions no longer recommend a `?token=` deep link.

The current flow is:

1. open the WebUI
2. enter the Gateway address and `gateway.token` on the login page
3. the frontend calls `POST /api/auth/session` with `Authorization: Bearer <gateway.token>`
4. Gateway writes a session cookie
5. later `fetch('/api/*')` and websocket connections reuse that cookie

This is also why HTTPS is preferred for cross-origin production deployments.

## What The Frontend Stores

The frontend stores these two values in browser local storage:

- `clawgo.api_base_url`
- `clawgo.api_token`

Meaning:

- `api_base_url`: Gateway base URL
- `api_token`: Gateway access token

## API Address Shape

If the login page is given:

```text
https://gateway.example.com
```

the frontend rewrites local `/api/*` requests to:

```text
https://gateway.example.com/api/*
```

WebSocket URLs are rewritten as well, for example:

- `wss://gateway.example.com/api/runtime`
- `wss://gateway.example.com/api/chat/live`
- `wss://gateway.example.com/api/logs/live`

## Minimal Connectivity Check

Assume:

- WebUI: `https://ui.example.com`
- Gateway: `https://gateway.example.com`

First verify Gateway directly:

```bash
curl -H 'Authorization: Bearer YOUR_GATEWAY_TOKEN' \
  https://gateway.example.com/api/version
```

Then fill the WebUI login page with:

- API Address: `https://gateway.example.com`
- Token: `YOUR_GATEWAY_TOKEN`

After login, the frontend should at least be able to read:

- `/api/version`
- `/api/config`
- `/api/runtime`

## Cross-Origin Notes

Gateway now enables permissive CORS by default, but two rules still matter:

- the origin must be a valid `http/https` origin
- cross-origin realtime features depend on cookies, so production should use HTTPS

Otherwise the common failure mode is:

- login looks successful, but websocket connections fail
- cross-site cookies are dropped by the browser

## Minimal Page To API Mapping

- Dashboard: `/api/runtime`, `/api/nodes`, `/api/world`
- Chat: `/api/chat`, `/api/chat/history`, `/api/chat/live`
- Config: `/api/config`, `/api/config?mode=normalized`
- Providers: `/api/provider/models`, `/api/provider/runtime`
- Logs: `/api/logs/live`, `/api/logs/recent`

## Common Deployment Patterns

### 1. Pure Static Hosting

Good for:

- Cloudflare Pages
- Vercel
- Netlify

The only requirement is that the frontend can reach Gateway directly.

### 2. Separate Frontend And Gateway Domains

For example:

- `https://clawgo.dev`
- `https://api.clawgo.dev`

This is the clearest model and matches the current implementation well.

### 3. Same-Domain Reverse Proxy

You can also reverse-proxy both the static frontend and Gateway API behind one domain, for example:

- `/` -> WebUI static files
- `/api/` -> Gateway

That reduces cross-origin cookie issues.

## Recommendations

- in development, use the login page to set `api_base_url` and token
- in production, prefer HTTPS
- if cross-origin websockets fail, check cookies, origin, and reverse-proxy headers first
