# WebUI Deployment

## Current Recommended Mode

According to the latest README, the recommended default is still Gateway-hosted WebUI:

```text
http://<host>:<port>/?token=<gateway.token>
```

So for most users, a separate frontend deployment is not required.

## Frontend Source Repository

If you do want to study or customize the frontend separately, the source repository is:

- [YspCoder/clawgo-web](https://github.com/YspCoder/clawgo-web)

## Local Development

```bash
git clone https://github.com/YspCoder/clawgo-web.git
cd clawgo-web
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

The build output is:

```text
dist/
```

## When A Separate Deployment Makes Sense

You usually only need to split the frontend out when:

- you want to customize UI style or routing
- you want the frontend on its own domain
- you need a custom reverse-proxy or static-hosting setup

Otherwise, the built-in Gateway entrypoint is simpler and closer to the current documentation baseline.
