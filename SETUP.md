# Vental Admin Panel - Setup Guide

## Prerequisites
- Node.js 18+
- npm

## Installation
```bash
npm install
npm run dev
```

## Environment Variables
Update `.env`:
- `VITE_SUPABASE_URL` — your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — your Supabase anon key

## Demo Login (no Supabase needed)
- Email: `admin@vehiclerental.com`
- Password: `admin123`

## Supabase Login
Admin users need a row in the `profiles` table with `role = 'admin'`.

## Bugs Fixed
1. **VehicleForm.jsx** — Form fields used wrong names (`type`, `price`, `category`) instead of DB column names (`vehicle_type`, `fuel_type`, `price_per_day`). Vehicles couldn't be saved correctly.
2. **Payments.jsx** — JSX return was completely empty (`// your existing JSX below`); payments page showed nothing.
3. **AuthPageComponents.jsx** — Imported non-existent `../supabaseClient`; fixed to `../lib/supabase`.
4. **Navbar.jsx** — Imported non-existent `../supabaseClient`; component is unused in admin anyway.
5. **ChatPage.jsx** — Imported non-existent `Navbar` and `Footer` components; rewritten for admin layout.
6. **App.jsx** — ChatPage route not registered; added `/chat` route.
7. **Sidebar.jsx** — Chat not in navigation; added Chat link.
