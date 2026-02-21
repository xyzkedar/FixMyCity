
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/Navbar';

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user || null);
        });
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const res = await fetch(`${apiUrl}/api/reports/leaderboard/top`);
            const data = await res.json();
            if (data.leaderboard) {
                setLeaderboard(data.leaderboard);
            }
        } catch (err) {
            console.error('Leaderboard fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-void)', color: 'var(--text-primary)', paddingTop: '80px' }}>
            <Navbar user={user} />

            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 212, 255, 0.1)', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 700, padding: '8px 16px', borderRadius: '30px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        🏆 Top Performers
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '16px', background: 'linear-gradient(135deg, var(--accent), #10d9a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Authority Leaderboard</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Ranking city officials based on their dedication to resolving citizen reports.</p>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-secondary)' }}>
                        <div className="loader" style={{ margin: '0 auto 20px' }}></div>
                        Fetching latest rankings...
                    </div>
                ) : leaderboard.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px', background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '3rem', display: 'block', marginBottom: '20px' }}>⏳</span>
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>The race hasn't started yet.</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Resolutions will appear here as they are processed.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {leaderboard.map((officer, index) => (
                            <div
                                key={officer.id}
                                style={{
                                    background: index === 0 ? 'rgba(0, 212, 255, 0.05)' : 'var(--bg-card)',
                                    border: index === 0 ? '1px solid var(--accent)' : '1px solid var(--border)',
                                    borderRadius: '16px',
                                    padding: '20px 32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '24px',
                                    transition: 'all 0.3s',
                                    boxShadow: index === 0 ? '0 8px 32px rgba(0, 212, 255, 0.1)' : 'none'
                                }}
                            >
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: index === 0 ? 'var(--gold)' : (index === 1 ? '#C0C0C0' : (index === 2 ? '#CD7F32' : 'var(--text-muted)')), minWidth: '40px' }}>
                                    #{index + 1}
                                </div>

                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--accent), #10d9a0)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    color: '#000',
                                    flexShrink: 0
                                }}>
                                    {officer.name.charAt(0)}
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '2px', color: 'var(--text-primary)' }}>
                                        {officer.name} {index === 0 && '👑'}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                                        @{officer.username}
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: index === 0 ? 'var(--accent)' : 'var(--text-primary)' }}>
                                        {officer.resolvedCount}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        Resolved
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ marginTop: '80px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <p>Leaderboard updates in real-time. Want to rank higher? Resolve more citizen reports effectively!</p>
                </div>
            </div>

            <style jsx>{`
                .loader {
                    border: 3px solid rgba(255,255,255,0.1);
                    border-top: 3px solid var(--accent);
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

