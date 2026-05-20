# Vental User Site — Setup Guide

## Current Production Notes

- The Express backend starts with `npm start` from `fixed-user-site/backend`; this runs `node index.js`.
- Signup now goes through `POST /api/auth/signup` so the backend can create the matching Supabase `profiles` row safely.
- New user signup requests a Supabase email code first, then calls `POST /api/auth/signup/complete` after the code is verified.
- Payment confirmation rows are written by the backend, not directly by the browser.
- Run `backend/supabase/schema-and-policies.sql` once in the Supabase SQL editor to enable the required RLS policies.

## Email OTP Setup

The signup form expects the numeric code from Supabase. Your Supabase project may use the **Confirm signup** template for brand-new users and the **Magic link or OTP** template for existing users, so both templates should include `{{ .Token }}`.

### 1. Enable custom SMTP

Supabase Dashboard:

```
Authentication -> Emails -> SMTP Settings
```

For Gmail testing:

```
Sender email: your Gmail address
Sender name: Vental
Host: smtp.gmail.com
Port: 587
Username: your Gmail address
Password: your 16-character Google App Password
```

### 2. Update Confirm signup

Supabase Dashboard:

```
Authentication -> Emails -> Templates -> Confirm signup
```

Use this body:

```html
<h2>Confirm your Vental signup</h2>
<p>Enter this code to finish creating your account:</p>
<h1>{{ .Token }}</h1>
<p>This code expires soon. If you did not request it, you can ignore this email.</p>
```

### 3. Update Magic link or OTP

Supabase Dashboard:

```
Authentication -> Emails -> Templates -> Magic link or OTP
```

Use this body:

```html
<h2>Your Vental verification code</h2>
<p>Enter this code to finish creating your account:</p>
<h1>{{ .Token }}</h1>
<p>This code expires soon. If you did not request it, you can ignore this email.</p>
```

If either template only contains `{{ .ConfirmationURL }}`, users will receive a clickable link instead of the numeric code that the signup form asks for.

## What Was Fixed

| # | Issue | Fix |
|---|-------|-----|
| 1 | `server/index.js` (Express code) inside the React project root caused webpack to bundle Node.js-only modules (`cors`, `express`, `dotenv`, `fs`, `zlib`, etc.) → build crash | Deleted `server/` folder. Express backend lives in `backend/` only |
| 2 | `src/lib/supabase.js` had a stray circular self-export line | Removed the duplicate export |
| 3 | Supabase env vars were hardcoded as fallbacks | Now read cleanly from `.env`; a warning is logged if missing |
| 4 | `services/userService.js` imported from `supabaseClient` inconsistently | Unified to use `lib/supabase` |
| 5 | `pages/bookingService.js` was a dead stub with no exports | Now re-exports from `services/bookingService.js` |
| 6 | `KhaltiButton.jsx` lacked a React import (lint warning) | Added clean module header comment |

---

## Project Structure

```
fixed-user-site/
├── .env                         ← React env vars (REACT_APP_* only)
├── package.json                 ← React dependencies only (no express/cors here)
├── public/
├── src/
│   ├── index.js                 ← React entry point
│   ├── App.js
│   ├── supabaseClient.js        ← Re-exports from lib/supabase
│   ├── lib/
│   │   └── supabase.js          ← Single Supabase client instance
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── css/
└── backend/                     ← Node.js/Express — runs separately
    ├── .env                     ← Backend env vars (no REACT_APP_ prefix)
    ├── package.json
    ├── index.js
    ├── server.js
    └── routes/
        └── khalti.js
```

> ⚠️ **Golden Rule**: `src/` is for React only. Never import `express`, `cors`, `dotenv`,
> `fs`, `path`, or any Node.js module from inside `src/`. Those belong in `backend/`.

---

## Running the App

### 1. Frontend (React)

```bash
cd fixed-user-site
npm install
npm start
# → http://localhost:3000
```

### 2. Backend (Express — separate terminal)

```bash
cd fixed-user-site/backend
npm install
npm start
# → http://localhost:5000
```

Both must be running simultaneously for Khalti payments to work.

---

## Environment Variables

### `fixed-user-site/.env` (Frontend)
```
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_ADMIN_URL=http://localhost:5173
```

### `fixed-user-site/backend/.env` (Backend)
```
PORT=5000
FRONTEND_URL=http://localhost:3000
KHALTI_SECRET_KEY=your_khalti_secret_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

> Never put `SUPABASE_SERVICE_ROLE_KEY` or `KHALTI_SECRET_KEY` in the frontend `.env`.
> They would be visible in the browser bundle.

---

## Verify Fix

Run this before `npm start` to confirm no server code leaked into `src/`:

```bash
grep -r "require('express')\|from 'express'\|require('cors')\|from 'cors'" src/
# Expected: (no output)
```
