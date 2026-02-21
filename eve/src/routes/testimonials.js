/**
 * Testimonials Routes
 * Handles community reviews/testimonials
 */
import { Hono } from 'hono';
import { supabase } from '../lib/supabase.js';

const testimonials = new Hono();

// Get all approved testimonials
testimonials.get('/', async (c) => {
  try {
    const { limit } = c.req.query();
    
    let query = supabase
      .from('testimonials')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data, error } = await query;

    if (error) throw error;

    return c.json({ testimonials: data });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// Create a new testimonial
testimonials.post('/', async (c) => {
  try {
    const { name, role, quote, avatar, userId } = await c.req.json();

    if (!name || !role || !quote) {
      return c.json({ error: 'Name, role, and quote are required' }, 400);
    }

    const { data, error } = await supabase
      .from('testimonials')
      .insert({
        user_id: userId || null,
        name,
        role,
        quote,
        avatar,
        is_approved: false // Require approval before showing
      })
      .select()
      .single();

    if (error) throw error;

    return c.json({ success: true, testimonial: data });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

export default testimonials;
