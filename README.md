# City Women Hub v2

A mobile-friendly, Chinese-language unofficial Manchester City Women database. Built from the user's original `main.jsx` with search, filters, profiles, comparison, match centre, standings, historical records, news and Supabase reads.

## Deploy on existing GitHub → Cloudflare Pages site

1. Replace `src/main.jsx` and `src/style.css` with the corresponding files in this ZIP. **Both files must be replaced** for the intended design. The other files are optional if your existing Vite project already builds.
2. For a fresh project, upload all files in the ZIP to the repository root. Cloudflare Pages: framework Vite, build command `npm run build`, output directory `dist`.
3. In Supabase, create a project and run `supabase/schema.sql` using the SQL editor. Then add **verified** data via the table editor. No fake matches or standings are seeded.
4. In Cloudflare Pages → Settings → Environment variables, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from Supabase Project Settings / API. Trigger a new deployment. Do not use `service_role` in client code.
5. Test the published site. In the browser, use the refresh button or wait five minutes to refetch Supabase. This is **periodic database refresh**, not a live sports feed.

## Source verification and status

- The original 26 entries remain **illustrative fallback rows**, explicitly marked unverified; their current club registration and shirt numbers have NOT been checked.
- `players` replaces fallback only when it has records. Matches, standings, news and history show empty states until verified records are added.
- A `verified` flag is a label set by the data curator, not an independent validation mechanism.
- Stats in the player profile are whatever the database contains; agree on a season/competition scope before comparing.
- The frontend **does not automatically scrape or retrieve** WSL, UWCL, FA Cup or League Cup results. Genuine automatic score ingestion requires a licensed source that explicitly covers the competition, credentials, server-side sync and scheduling. Avoid exposing private sports API keys in `VITE_*` variables.

## Suggested next phase: automatic sports data

1. Confirm with a provider that their paid/free tier actually supports the women's competitions and endpoints needed (fixtures, lineups, goals, assists, tables). Coverage differs by competition/season.
2. Create a Cloudflare Worker scheduled job or Supabase Edge Function to fetch the provider using a **server-side secret**, normalize and upsert records into Supabase.
3. Record `source_url`, `updated_at`, competition, season, and provider match/player IDs. Add unique constraints to avoid duplicate records.
4. Respect API rate limits, attribution and image rights. Display the source timestamp and errors; never treat stale cache as live.

## Development

`npm install` then `npm run dev`; production: `npm run build`.
