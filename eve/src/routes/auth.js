/**
 * Authentication Routes
 * Handles citizen and authority login/signup
 */
import { Hono } from 'hono';
import { supabase } from '../lib/supabase.js';

const auth = new Hono();

// Sign up new user
auth.post('/signup', async (c) => {
  try {
    const { email, password, userType } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: 'Email and password required' }, 400);
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: userType || 'citizen'
        }
      }
    });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      success: true, 
      user: data.user,
      message: 'Check email for verification link'
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// Login
auth.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: 'Email and password required' }, 400);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return c.json({ error: error.message }, 401);
    }

    // Get user metadata
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return c.json({ 
      success: true, 
      session: data.session,
      user: data.user,
      profile
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// Logout
auth.post('/logout', async (c) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return c.json({ success: true });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// Get current user
auth.get('/me', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ user: null }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (error) throw error;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return c.json({ user, profile });
  } catch (err) {
    return c.json({ error: err.message }, 401);
  }
});

export default auth;
