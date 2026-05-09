# CinPulse

Movie discovery app built with React + Vite, powered by TMDB.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
cp .env.example .env
```

3. Add your TMDB key in `.env`:

```env
VITE_API_KEY=your_tmdb_api_key_here
```

4. Start dev server:

```bash
npm run dev
```

## Scripts

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run lint` - eslint
- `npm run preview` - preview production build

## Notes

- If `VITE_API_KEY` is missing or invalid, app now shows a clear message instead of silently showing empty movie lists.
- Get TMDB API key from: https://www.themoviedb.org/settings/api
