'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function TestimonialSubmission({ onTestimonialSubmitted }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [quote, setQuote] = useState('');
  const [role, setRole] = useState('Citizen');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
      fetchProfile(session.user.id);
      checkExistingTestimonial(session.user.id);
    }
  };

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const checkExistingTestimonial = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (data) {
        setHasSubmitted(true);
      }
    } catch (err) {
      // No testimonial found, user can submit
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quote.trim()) {
      setError('Please write a review');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const displayName = profile?.full_name || profile?.username || user.email.split('@')[0];
      const avatarUrl = profile?.avatar_url;

      const { error: insertError } = await supabase
        .from('testimonials')
        .insert({
          user_id: user.id,
          name: displayName,
          role: role,
          quote: quote.trim(),
          avatar: avatarUrl || displayName.charAt(0).toUpperCase(),
          is_approved: true
        });

      if (insertError) throw insertError;

      setSuccess('Thank you for your review!');
      setHasSubmitted(true);
      setQuote('');
      if (onTestimonialSubmitted) {
        onTestimonialSubmitted();
      }
      setTimeout(() => setShowForm(false), 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  // If user is not logged in, show login prompt
  if (!user) {
    return (
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center',
        marginTop: '40px'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔒</div>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Sign in to Share Your Experience
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px' }}>
          Join our community and help others by sharing your experience with FixMyCity.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            background: 'var(--accent)',
            color: '#000',
            fontWeight: 700,
            padding: '12px 32px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Sign In
        </button>
      </div>
    );
  }

  // If user has already submitted a testimonial
  if (hasSubmitted && !showForm) {
    return (
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center',
        marginTop: '40px'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Thank You!
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          You've already shared your experience. We appreciate your feedback!
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      padding: '40px',
      marginTop: '40px'
    }}>
      {!showForm ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💬</div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Share Your Experience
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px' }}>
            Help others by sharing your experience with FixMyCity. Your feedback matters!
          </p>
          <button
            onClick={() => setShowForm(true)}
            style={{
              background: 'var(--accent)',
              color: '#000',
              fontWeight: 700,
              padding: '12px 32px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Write a Review
          </button>
        </div>
      ) : (
        <>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '24px', textAlign: 'center' }}>
            Write Your Review
          </h3>

          {error && (
            <div style={{
              background: 'rgba(255,51,102,0.1)',
              border: '1px solid var(--danger)',
              color: 'var(--danger)',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '0.85rem'
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Your Role *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'var(--bg-deep)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem'
                }}
              >
                <option value="Citizen">Citizen</option>
                <option value="Authority">Authority</option>
                <option value="Community Leader">Community Leader</option>
                <option value="Business Owner">Business Owner</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Your Review *
              </label>
              <textarea
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="Share your experience with FixMyCity..."
                required
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'var(--bg-deep)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: 600
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !quote.trim()}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  background: 'var(--accent)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#000',
                  cursor: loading || !quote.trim() ? 'not-allowed' : 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  opacity: loading || !quote.trim() ? 0.7 : 1
                }}
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
