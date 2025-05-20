# Leavn App

## Setup

1. Inside the project directory (`horizons-export-*`), copy `.env.example` to `.env` and provide your Supabase credentials.
2. Install dependencies with `npm install`.
3. Run the dev server using `npm run dev`.

The `populate_supabase.mjs` script uses the same environment variables. Run it with:

```bash
node populate_supabase.mjs
```

Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in your environment before running the script.
