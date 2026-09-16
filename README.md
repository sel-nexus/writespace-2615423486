# WriteSpace

A local-first plain-text blogging SPA built with Vite, React, React Router and Tailwind CSS. Posts, managed accounts and sessions persist only in this browser through localStorage.

## Run

```bash
cd frontend
npm install
node node_modules/vite/bin/vite.js
```

## Test and build

```bash
cd frontend
node node_modules/vitest/vitest.mjs run
node node_modules/vite/bin/vite.js build
```

## Default administrator

Use `admin` / `admin` for the permanent local administrator. This MVP intentionally stores passwords as plaintext in localStorage. Do not use real passwords or sensitive data.

## Deployment

`vercel.json` provides the SPA rewrite needed for direct routes. A production nginx image is also available in `frontend/Dockerfile`.

## License

Private and proprietary.