# CutLog Setup

## 1. Run Database Migration

Go to your Supabase Dashboard:
https://supabase.com/dashboard/project/aobzsonuemamitlrakqs/sql/new

Paste the contents of `supabase/migrations/001_initial_schema.sql` and click "Run".
Then paste `supabase/migrations/002_seed_materials.sql` and click "Run".

Or run them combined from: `supabase/migrations/PASTE_THIS.sql`

## 2. Enable Email Auth

In Supabase Dashboard → Authentication → Providers:
- Email should already be enabled (it's the default)
- For testing, disable "Confirm email" under Authentication → Settings → Email Auth
  (so you don't need to verify emails during beta)

## 3. Run the Dev Server

```bash
cd /mnt/localssd/laser_log/app
npx next dev
```

Open http://localhost:3000

## 4. Deploy (when ready)

Push to GitHub, connect to Vercel, done. Or:

```bash
npx vercel
```
