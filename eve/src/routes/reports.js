/**
 * Report Routes
 * Handles civic issue report submission and retrieval
 */
import { Hono } from 'hono';
import { supabase } from '../lib/supabase.js';
import { verifyImage } from '../lib/ai.js';

const reports = new Hono();

// Submit a new report
reports.post('/submit', async (c) => {
  try {
    const formData = await c.req.parseBody();

    const {
      image,
      latitude,
      longitude,
      description,
      category,
      userId
    } = formData;

    // Validate required fields
    if (!latitude || !longitude) {
      return c.json({ error: 'Location required' }, 400);
    }

    // Handle image upload to Supabase Storage
    let imageUrl = null;

    if (image && typeof image !== 'string') {
      // Upload image to Supabase Storage
      const fileBuffer = await image.arrayBuffer();
      const fileName = `reports/${Date.now()}-${image.name}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('reports')
        .upload(fileName, fileBuffer, {
          contentType: image.type,
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return c.json({ error: 'Failed to upload image' }, 500);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('reports')
        .getPublicUrl(fileName);

      imageUrl = publicUrl;
    } else if (typeof image === 'string') {
      // Image already uploaded (URL passed)
      imageUrl = image;
    }

    // Run AI verification
    console.log('');
    const verification = await verifyImage(imageUrl || '');

    if (!verification.valid) {
      return c.json({
        error: 'Report rejected: Image does not appear to show a civic issue',
        verification
      }, 403);
    }

    // Determine category (AI-assigned or user-provided)
    const finalCategory = verification.category || category || 'other';

    // Insert report into database
    const { data: report, error: dbError } = await supabase
      .from('reports')
      .insert({
        user_id: userId || null,
        title: description?.substring(0, 100) || 'Civic Issue',
        description,
        category: finalCategory,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        image_url: imageUrl,
        status: 'pending',
        ai_confidence: verification.confidence,
        ai_label: verification.label
      })
      .select()
      .single();

    if (dbError) {
      console.error('DB error:', dbError);
      return c.json({ error: dbError.message }, 500);
    }

    console.log('');

    return c.json({
      success: true,
      report,
      verification
    });

  } catch (err) {
    console.error('');
    return c.json({ error: err.message }, 500);
  }
});

// Get all reports (with optional filters)
reports.get('/', async (c) => {
  try {
    const { lat, lng, radius, category, status, limit } = c.req.query();

    let query = supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data: reports, error } = await query;

    if (error) {
      return c.json({ error: error.message }, 500);
    }

    // If location filter provided, filter by distance (simple calculation)
    let filtered = reports;
    if (lat && lng && radius) {
      const radiusKm = parseFloat(radius);
      filtered = reports.filter(r => {
        const dist = getDistanceFromLatLonInKm(
          parseFloat(lat), parseFloat(lng),
          r.latitude, r.longitude
        );
        return dist <= radiusKm;
      });
    }

    return c.json({ reports: filtered });

  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// Get single report
reports.get('/:id', async (c) => {
  try {
    const { id } = c.req.param();

    const { data: report, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return c.json({ error: error.message }, 404);
    }

    return c.json({ report });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// Update report status (authority only)
reports.patch('/:id/status', async (c) => {
  try {
    const { id } = c.req.param();
    const { status, notes, resolvedBy } = await c.req.json();

    const updateData = {
      status,
      notes,
      updated_at: new Date().toISOString()
    };

    if (status === 'resolved') {
      updateData.resolved_at = new Date().toISOString();
      if (resolvedBy) updateData.resolved_by = resolvedBy;
    }

    const { data: report, error } = await supabase
      .from('reports')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return c.json({ error: error.message }, 500);
    }

    return c.json({ success: true, report });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// Get authority leaderboard
reports.get('/leaderboard/top', async (c) => {
  try {
    // We want to join reports and profiles
    // But since it's a count, we can do it in two steps or use a join
    const { data, error } = await supabase
      .from('reports')
      .select('resolved_by, profiles(full_name, avatar_url, username)')
      .eq('status', 'resolved')
      .not('resolved_by', 'is', null);

    if (error) throw error;

    // Grouping by authority
    const leaderboard = {};
    data.forEach(item => {
      const id = item.resolved_by;
      if (!leaderboard[id]) {
        const displayName = (item.profiles?.full_name && item.profiles.full_name.trim() !== '')
          ? item.profiles.full_name
          : (item.profiles?.username || 'Officer');

        leaderboard[id] = {
          id,
          name: displayName,
          username: item.profiles?.username || 'officer',
          avatar: item.profiles?.avatar_url || null,
          resolvedCount: 0
        };
      }
      leaderboard[id].resolvedCount++;
    });

    // Convert to sorted array
    const sortedLeaderboard = Object.values(leaderboard).sort((a, b) => b.resolvedCount - a.resolvedCount);

    return c.json({ leaderboard: sortedLeaderboard });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// Get dashboard stats
reports.get('/stats/summary', async (c) => {
  try {
    const { data: reports, error } = await supabase
      .from('reports')
      .select('category, status, created_at');

    if (error) throw error;

    const stats = {
      total: reports.length,
      pending: reports.filter(r => r.status === 'pending').length,
      resolved: reports.filter(r => r.status === 'resolved').length,
      rejected: reports.filter(r => r.status === 'rejected').length,
      byCategory: {}
    };

    // Count by category
    reports.forEach(r => {
      stats.byCategory[r.category] = (stats.byCategory[r.category] || 0) + 1;
    });

    return c.json({ stats });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// Helper: Distance calculation
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export default reports;
