# Real Ones

A browser-based multiplayer party game inspired by the classic "How well do your friends really know you?" challenge.

## Run locally

```bash
npm install
npm start
```

Then open:

```text
http://localhost:3000
```

## Deploy to Render

1. Push this project to GitHub.
2. Import the repo in Render.
3. Use the included `render.yaml`.
4. Deploy.

Render will start the app with `npm start` and watch the `/health` endpoint.

## Multiplayer notes

- LAN play: use your machine's local IP, such as `http://192.168.1.20:3000`
- Internet play: deploy to Render, Railway, Fly.io, or use a tunnel such as `ngrok`

## Environment

The server listens on `0.0.0.0` and reads `PORT` from the environment automatically.
