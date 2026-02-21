'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

import Navbar from '../../components/Navbar';

// Local Nav removed

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState({
        username: '',
        full_name: '',
        bio: '',
        phone: '',
        location: '',
        avatar_url: '',
        user_type: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchUserAndProfile = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/');
                return;
            }
            setUser(session.user);

            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (profileData) {
                setProfile({
                    username: profileData.username || '',
                    full_name: profileData.full_name || '',
                    bio: profileData.bio || '',
                    phone: profileData.phone || '',
                    location: profileData.location || '',
                    avatar_url: profileData.avatar_url || '',
                    user_type: profileData.user_type || 'citizen'
                });
            }
            setLoading(false);
        };

        fetchUserAndProfile();
    }, [router]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const { error: updateError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    username: profile.username,
                    full_name: profile.full_name,
                    bio: profile.bio,
                    phone: profile.phone,
                    location: profile.location,
                    avatar_url: profile.avatar_url,
                    user_type: profile.user_type,
                    updated_at: new Date().toISOString()
                });

            if (updateError) throw updateError;
            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg-void)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Loading profile...</p>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-void)', paddingTop: '80px', paddingBottom: '40px' }}>
            <Navbar user={user} />

            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.9rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        ← Back
                    </button>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>User Profile</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your personal information and public identity</p>
                </div>

                <div className="glass-card" style={{ padding: '40px' }}>
                    <form onSubmit={handleUpdateProfile}>
                        {error && (
                            <div style={{ background: 'rgba(255,51,102,0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '24px' }}>
                                {error}
                            </div>
                        )}
                        {success && (
                            <div style={{ background: 'rgba(16,217,160,0.1)', border: '1px solid #10d9a0', color: '#10d9a0', padding: '12px', borderRadius: '8px', marginBottom: '24px' }}>
                                {success}
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Username</label>
                                <input
                                    type="text"
                                    value={profile.username}
                                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                    placeholder="Choose a unique username"
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Full Name</label>
                                <input
                                    type="text"
                                    value={profile.full_name}
                                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                    placeholder="Your display name"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Phone Number</label>
                                <input
                                    type="tel"
                                    value={profile.phone}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    placeholder="For emergency contact"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Location</label>
                                <input
                                    type="text"
                                    value={profile.location}
                                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                    placeholder="Area or Ward"
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Bio</label>
                            <textarea
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                placeholder="Tell us about yourself..."
                                rows={4}
                            />
                        </div>

                        <div style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
                            <button type="submit" className="btn-primary" disabled={saving} style={{ flex: 1 }}>
                                {saving ? 'Saving Changes...' : 'Save Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
