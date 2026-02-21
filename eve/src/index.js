/**
 * FixMyCity Backend - EVE
 * Hono.js API Server
 */
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import reportRoutes from './routes/reports.js';
import authRoutes from './routes/auth.js';
import testimonialRoutes from './routes/testimonials.js';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', async (c, next) => {
  console.log(`[${c.req.method}] ${c.req.path}`);
  await next();
});

// Routes
app.get('/', (c) => c.json({ 
  service: 'FixMyCity EVE', 
  version: '1.0.0',
  status: 'running' 
}));

app.route('/api/auth', authRoutes);
app.route('/api/reports', reportRoutes);
app.route('/api/testimonials', testimonialRoutes);

// Health check
app.get('/health', (c) => c.json({ ok: true }));

// Start server
const port = process.env.PORT || 3001;
console.log(`EVE running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port
});
