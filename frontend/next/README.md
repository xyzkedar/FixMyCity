# FixMyCity Frontend

Next.js 15 application with glassmorphic UI for civic reporting.

## Quick Start

```bash
cd frontend/next
npm install
npm run dev
```

Open http://localhost:3000

## Deployment to Vercel

1. Push your code to GitHub
2. Go to Vercel.com and import the project
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## Configuration

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_API_URL=http://localhost:3001
```

For production, set `NEXT_PUBLIC_API_URL` to your backend URL.

## Features

- Glassmorphic UI design
- Real-time report feed
- AI-powered image verification
- Dashboard with statistics
- Category filtering
- Location-based reporting
- Responsive design
