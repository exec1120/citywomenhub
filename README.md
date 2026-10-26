# City Women Hub — Next Step Starter

This is a Vercel-ready React/Vite project with:
- Search/filterable player directory
- Individual player profile view
- Supabase read integration (optional)
- SQL schema for player, match and match-stat records
- Mobile responsive design

## Run locally
Requires Node.js 20+:
```bash
npm install
npm run dev
```

## Deploy to Vercel
1. Create/import a GitHub repository and upload the contents of this folder.
2. Import that repository into Vercel.
3. Build command: `npm run build`; output directory: `dist` (Vercel/Vite normally auto-detect).
4. Deploy. Vercel gives a public `*.vercel.app` URL.

## Optional Supabase connection
1. Create a Supabase project.
2. Run `supabase/schema.sql` in SQL Editor.
3. Copy `.env.example` to `.env.local`, fill the Supabase Project URL and anon/public key.
4. In Vercel Project Settings → Environment Variables, set the same variables.
5. Redeploy.

The current in-file roster is starter/demo content and should be verified against official current squad lists before publication. The app only reads from Supabase; no private/service-role key belongs in frontend environment variables.

## Live scores / dynamic data
The project is prepared with match and stats tables but does not yet fetch from a football API or run scheduled syncs. For production live updates, choose a provider with confirmed women's football and academy coverage, store its API key in server-side Vercel environment variables, then implement a server-side sync endpoint and scheduled job. Never expose provider secret keys in browser code.
