# Leavn App

This project is a React application built with [Vite](https://vitejs.dev/).

## Project Setup

1. Ensure you have **Node.js 18** or later installed.
2. Install dependencies:

```bash
npm install
```

All project files are located in the `horizons-export-*/` directory.

## Development Commands

Run the development server with hot reloading:

```bash
npm run dev
```

Create a production build in the `dist/` folder:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Environment Variables

Create a `.env.local` file in the project root to override default values. The following variables are commonly used:

```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

The `.env.local` file is ignored by Git.
