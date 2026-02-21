'use client';
import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { supabase } from '../lib/supabase';
import './CardNav.css';

const ArrowIcon = () => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.25 15.5a.75.75 0 0 1-.75-.75V7.56L7.53 17.53a.75.75 0 0 1-1.06-1.06L16.44 6.5H9.25a.75.75 0 0 1 0-1.5h9a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-.75.75z"></path>
    </svg>
);

export default function Navbar({ user }) {
    const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [profile, setProfile] = useState(null);
    const navRef = useRef(null);
    const cardsRef = useRef([]);
    const tlRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            const fetchProfile = async () => {
                const { data } = await supabase
                    .from('profiles')
                    .select('username, full_name, user_type, avatar_url')
                    .eq('id', user.id)
                    .single();
                if (data) setProfile(data);
            };
            fetchProfile();
        }
    }, [user]);

    const navItems = [
        {
            label: 'PORTAL',
            bgColor: 'rgba(0, 212, 255, 0.1)',
            textColor: 'var(--accent)',
            links: [
                { label: 'My Dashboard', href: profile?.user_type === 'authority' ? '/authority' : '/citizen' },
                { label: 'Public Leaderboard', href: '/leaderboard' }
            ]
        },
        {
            label: 'ACCOUNT',
            bgColor: 'rgba(255, 255, 255, 0.05)',
            textColor: 'var(--text-primary)',
            links: [
                { label: 'View Profile', href: '/profile' },
                { label: 'Account Settings', href: '/profile' }
            ]
        },
        {
            label: 'CONTROL',
            bgColor: 'rgba(255, 51, 102, 0.05)',
            textColor: 'var(--danger)',
            links: [
                {
                    label: 'Sign Out',
                    href: '#',
                    onClick: async () => {
                        await supabase.auth.signOut();
                        router.push('/');
                    }
                }
            ]
        }
    ];

    const calculateHeight = () => {
        const navEl = navRef.current;
        if (!navEl) return 260;
        const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
        if (isMobile) return 500;
        return 260;
    };

    const createTimeline = () => {
        const navEl = navRef.current;
        if (!navEl) return null;
        gsap.set(navEl, { height: 60, overflow: 'hidden' });
        gsap.set(cardsRef.current, { y: 30, opacity: 0 });
        const tl = gsap.timeline({ paused: true });
        tl.to(navEl, { height: calculateHeight(), duration: 0.4, ease: 'power3.out' });
        tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', stagger: 0.08, display: 'flex' }, '-=0.1');
        return tl;
    };

    useLayoutEffect(() => {
        const tl = createTimeline();
        tlRef.current = tl;
        return () => tl?.kill();
    }, [user, profile]);

    const toggleMenu = () => {
        if (!tlRef.current) return;
        if (!isExpanded) {
            setIsHamburgerOpen(true);
            setIsExpanded(true);
            tlRef.current.play(0);
        } else {
            setIsHamburgerOpen(false);
            tlRef.current.eventCallback('onReverseComplete', () => setIsExpanded(false));
            tlRef.current.reverse();
        }
    };

    return (
        <div className="card-nav-container">
            <nav ref={navRef} className={`card-nav ${isExpanded ? 'open' : ''}`} style={{ backgroundColor: 'rgba(2, 8, 20, 0.95)', backdropFilter: 'blur(20px)' }}>
                <div className="card-nav-top">
                    {user ? (
                        <div
                            className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''}`}
                            onClick={toggleMenu}
                            style={{ color: 'var(--accent)' }}
                        >
                            <div className="hamburger-line" />
                            <div className="hamburger-line" />
                        </div>
                    ) : <div style={{ width: 30 }} />}

                    <div className="logo-container" onClick={() => router.push('/')}>
                        <div className="logo-text">FIXMYCITY</div>
                    </div>

                    {!user ? (
                        <button
                            onClick={() => router.push('/')}
                            className="card-nav-cta-button"
                            style={{ backgroundColor: 'var(--accent)', color: '#000' }}
                        >
                            Portal Login
                        </button>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{profile?.username || 'User'}</span>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #10d9a0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, color: '#000' }}>
                                {profile?.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                        </div>
                    )}
                </div>

                <div className="card-nav-content" style={{ display: isExpanded ? 'flex' : 'none' }}>
                    {navItems.map((item, idx) => (
                        <div
                            key={idx}
                            className="nav-card"
                            ref={el => cardsRef.current[idx] = el}
                            style={{ backgroundColor: item.bgColor, color: item.textColor }}
                        >
                            <div className="nav-card-label">{item.label}</div>
                            <div className="nav-card-links">
                                {item.links.map((lnk, i) => (
                                    <a
                                        key={i}
                                        className="nav-card-link"
                                        href={lnk.href}
                                        onClick={(e) => {
                                            if (lnk.onClick) {
                                                e.preventDefault();
                                                lnk.onClick();
                                            }
                                            toggleMenu();
                                        }}
                                    >
                                        <ArrowIcon />
                                        {lnk.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </nav>
        </div>
    );
}
