'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

export default function Navbar({ user }) {
    const [profile, setProfile] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            const fetchProfile = async () => {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('username, full_name, avatar_url')
                    .eq('id', user.id)
                    .single();

                if (data) setProfile(data);
            };
            fetchProfile();
        }
    }, [user]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    return (
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: 'rgba(2,8,20,0.92)', backdropFilter: 'blur(14px)', borderBottom: '1px solid var(--border)', height: '60px', display: 'flex', alignItems: 'center', padding: '0 24px', gap: '16px' }}>
            <div
                onClick={() => router.push('/')}
                style={{ fontFamily: 'Poppins,sans-serif', fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '2px', cursor: 'pointer', textShadow: '0 0 18px var(--accent-glow)' }}
            >
                FIXMYCITY
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '20px' }}>
                {user ? (
                    <div style={{ position: 'relative' }}>
                        <div
                            onClick={() => setIsOpen(!isOpen)}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '4px 8px', borderRadius: '8px', transition: 'all 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <div style={{ textAlign: 'right', display: 'none', sm: 'block' }}>
                                <div style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600 }}>{profile?.username || user.email.split('@')[0]}</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>{profile?.full_name || 'Citizen'}</div>
                            </div>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #10d9a0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700, color: '#000' }}>
                                {profile?.full_name?.[0] || profile?.username?.[0] || user.email[0].toUpperCase()}
                            </div>
                        </div>

                        {isOpen && (
                            <>
                                <div style={{ position: 'fixed', inset: 0, zIndex: -1 }} onClick={() => setIsOpen(false)} />
                                <div style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 10px)',
                                    right: 0,
                                    background: 'var(--bg-panel)',
                                    border: '1px solid var(--border-bright)',
                                    borderRadius: '12px',
                                    padding: '8px',
                                    minWidth: '200px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                    animation: 'dropdownFadeIn 0.2s ease-out'
                                }}>
                                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', marginBottom: '4px' }}>
                                        <div style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}>{profile?.full_name || 'User'}</div>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{user.email}</div>
                                    </div>

                                    <button
                                        onClick={() => { router.push('/profile'); setIsOpen(false); }}
                                        style={{ width: '100%', padding: '10px 16px', background: 'transparent', border: 'none', color: 'var(--text-primary)', textAlign: 'left', cursor: 'pointer', borderRadius: '6px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px' }}
                                        onMouseEnter={(e) => e.target.style.background = 'var(--bg-card)'}
                                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                    >
                                        <span>👤</span> View Profile
                                    </button>

                                    <button
                                        onClick={() => { router.push('/citizen'); setIsOpen(false); }}
                                        style={{ width: '100%', padding: '10px 16px', background: 'transparent', border: 'none', color: 'var(--text-primary)', textAlign: 'left', cursor: 'pointer', borderRadius: '6px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px' }}
                                        onMouseEnter={(e) => e.target.style.background = 'var(--bg-card)'}
                                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                    >
                                        <span>📊</span> Dashboard
                                    </button>

                                    <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />

                                    <button
                                        onClick={handleSignOut}
                                        style={{ width: '100%', padding: '10px 16px', background: 'transparent', border: 'none', color: 'var(--danger)', textAlign: 'left', cursor: 'pointer', borderRadius: '6px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px' }}
                                        onMouseEnter={(e) => e.target.style.background = 'rgba(255,51,102,0.1)'}
                                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                    >
                                        <span>🚪</span> Sign Out
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={() => router.push('/')}
                        className="btn-primary"
                        style={{ padding: '8px 20px', fontSize: '0.85rem' }}
                    >
                        Sign In
                    </button>
                )}
            </div>
        </nav>
    );
}
