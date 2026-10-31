# Hirafawy Admin Dashboard

React + Tailwind CSS (Vite) admin dashboard connected to
`https://el-hirfawy-backend.vercel.app`.

## Run
    npm install
    npm run dev          # http://localhost:5173

In development, requests to `/backend/*` are proxied to the real API (see `vite.config.mjs`).

## Production build
    npm run build
Create a `.env` file (see `.env.example`) with `VITE_API_URL`, and make sure the backend allows CORS
for the domain that hosts the dashboard.

## Pages
- Overview, Craftsmen, Users, Service requests

## What is real and what is demo
| Part | Source |
|---|---|
| Users, craftsmen, sign-ups, latest activity | Real: `GET /user/all-users` |
| Approve / reject craftsman | Saved in the browser only (backend has no endpoint yet) |
| Suspend / activate account | Saved in the browser only (backend has no endpoint yet) |
| Service requests + requests chart | Demo data in `src/mock.js` |

When the backend adds the missing endpoints, fill them in `src/config.js` (examples are in the file).
