'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function LoginDropdown({ onAuthClick }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className='login-dropdown-container' style={{ position: 'relative', marginLeft: 'auto' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='login-dropdown-btn'
        style={{
          background: '#10d9a0',
          color: '#000',
          fontWeight: 700,
          padding: '7px 18px',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s'
        }}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      >
        Sign In
        <span style={{ fontSize: '0.7rem', transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
      </button>
      {isOpen && (
        <div className='login-dropdown-menu' style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-bright)',
          borderRadius: '12px',
          padding: '8px',
          minWidth: '200px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          zIndex: 1001,
          animation: 'dropdownFadeIn 0.2s ease-out'
        }}>
          <button
            onClick={() => { onAuthClick('citizen'); setIsOpen(false); }}
            className='dropdown-item'
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              textAlign: 'left',
              cursor: 'pointer',
              borderRadius: '8px',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.target.style.background = 'var(--bg-card)'; }}
            onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
          >
            <span style={{ fontSize: '1.1rem' }}>👤</span>
            <div>
              <div style={{ fontWeight: 600 }}>Citizen Login</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Report city issues</div>
            </div>
          </button>
          <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />
          <button
            onClick={() => { onAuthClick('authority'); setIsOpen(false); }}
            className='dropdown-item'
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              textAlign: 'left',
              cursor: 'pointer',
              borderRadius: '8px',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.target.style.background = 'var(--bg-card)'; }}
            onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
          >
            <span style={{ fontSize: '1.1rem' }}>🛡️</span>
            <div>
              <div style={{ fontWeight: 600 }}>Authority Login</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Manage reports</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

import Navbar from '../components/Navbar';

function Nav({ user, setUser, onAuthClick }) {
  if (user) return <Navbar user={user} />;
  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: 'rgba(2,8,20,0.92)', backdropFilter: 'blur(14px)', borderBottom: '1px solid var(--border)', height: '60px', display: 'flex', alignItems: 'center', padding: '0 24px', gap: '16px' }}>
      <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '2px', cursor: 'pointer', textShadow: '0 0 18px var(--accent-glow)' }}>FIXMYCITY</div>
      <LoginDropdown onAuthClick={onAuthClick} />
    </nav>
  );
}
function HeroCTAButton({ onAuthClick }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: '#10d9a0',
          color: '#000',
          fontWeight: 700,
          padding: '12px 32px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.1rem',
          transition: 'all 0.3s',
          boxShadow: '0 4px 12px rgba(16,217,160,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 16px rgba(16,217,160,0.4)'; }}
        onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 12px rgba(16,217,160,0.3)'; }}
      >
        Get Started
        <span style={{ fontSize: '0.7rem', transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
      </button>
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 12px)',
          left: 0,
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-bright)',
          borderRadius: '12px',
          padding: '8px',
          minWidth: '240px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          zIndex: 1001,
          animation: 'dropdownFadeIn 0.2s ease-out'
        }}>
          <button
            onClick={() => { onAuthClick('citizen'); setIsOpen(false); }}
            style={{
              width: '100%',
              padding: '14px 18px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              textAlign: 'left',
              cursor: 'pointer',
              borderRadius: '8px',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.target.style.background = 'var(--bg-card)'; }}
            onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
          >
            <span style={{ fontSize: '1.3rem' }}>👤</span>
            <div>
              <div style={{ fontWeight: 600, marginBottom: '2px' }}>Citizen Login</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Report city issues & track progress</div>
            </div>
          </button>
          <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />
          <button
            onClick={() => { onAuthClick('authority'); setIsOpen(false); }}
            style={{
              width: '100%',
              padding: '14px 18px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              textAlign: 'left',
              cursor: 'pointer',
              borderRadius: '8px',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.target.style.background = 'var(--bg-card)'; }}
            onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
          >
            <span style={{ fontSize: '1.3rem' }}>🛡️</span>
            <div>
              <div style={{ fontWeight: 600, marginBottom: '2px' }}>Authority Login</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Manage & resolve reports</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}


function StatsCounter({ stats }) {
  const [counts, setCounts] = useState({ reports: 0, resolved: 0, satisfaction: 0 });

  useEffect(() => {
    if (!stats) return;
    const targets = {
      reports: stats.total || 0,
      resolved: stats.resolved || 0,
      satisfaction: stats.resolved && stats.total ? Math.round((stats.resolved / stats.total) * 100) : 0
    };
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounts({
        reports: Math.floor(targets.reports * progress),
        resolved: Math.floor(targets.resolved * progress),
        satisfaction: Math.min(100, Math.floor(targets.satisfaction * progress))
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, [stats]);

  return (
    <div style={{ marginTop: '80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '32px', maxWidth: '900px', width: '100%', padding: '0 24px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '8px', fontFamily: 'Orbitron,sans-serif' }}>{counts.reports.toLocaleString()}+</div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Reports Submitted</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', fontWeight: 800, color: '#10d9a0', marginBottom: '8px', fontFamily: 'Orbitron,sans-serif' }}>{counts.resolved.toLocaleString()}+</div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Issues Resolved</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--gold)', marginBottom: '8px', fontFamily: 'Orbitron,sans-serif' }}>{counts.satisfaction}%</div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Satisfaction Rate</div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div style={{
      background: 'var(--bg-primary)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      padding: '35px',
      textAlign: 'center',
      transition: 'all 0.3s'
    }}
      onMouseEnter={(e) => { e.target.style.transform = 'translateY(-8px)'; e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 12px 40px rgba(0,212,255,0.15)'; }}
      onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
    >
      <div style={{ fontSize: '3rem', marginBottom: '20px' }}>{icon}</div>
      <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{description}</p>
    </div>
  );
}

function TestimonialCard({ name, role, quote, avatar }) {
  return (
    <div style={{
      background: 'var(--bg-primary)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      padding: '30px',
      transition: 'all 0.3s'
    }}
      onMouseEnter={(e) => { e.target.style.borderColor = 'var(--accent)'; }}
      onMouseLeave={(e) => { e.target.style.borderColor = 'var(--border)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg,var(--accent),#10d9a0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 700, color: '#000' }}>{avatar}</div>
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem' }}>{name}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{role}</div>
        </div>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, fontStyle: 'italic' }}>"{quote}"</p>
    </div>
  );
}

function HowItWorksStep({ number, icon, title, description }) {
  return (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
      <div style={{
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg,var(--accent),#10d9a0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        fontWeight: 800,
        color: '#000',
        flexShrink: 0
      }}>{number}</div>
      <div>
        <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{icon}</div>
        <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>{title}</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{description}</p>
      </div>
    </div>
  );
}

function CTASection({ onAuthClick }) {
  return (
    <div style={{
      padding: '100px 24px',
      background: 'linear-gradient(180deg,transparent,rgba(0,212,255,0.05),transparent)',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        width: '600px',
        height: '300px',
        background: 'radial-gradient(ellipse,rgba(0,212,255,0.15) 0%,transparent 70%)',
        pointerEvents: 'none'
      }} />
      <h2 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px', position: 'relative' }}>Ready to Transform Your City?</h2>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px', position: 'relative' }}>Join thousands of citizens and authorities working together to build better, safer, and more livable cities.</p>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
        <button onClick={() => onAuthClick('citizen')} style={{ background: '#10d9a0', color: '#000', fontWeight: 700, padding: '14px 36px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '1.1rem', transition: 'all 0.3s', boxShadow: '0 4px 16px rgba(16,217,160,0.3)' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(16,217,160,0.4)'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 16px rgba(16,217,160,0.3)'; }}>Get Started as Citizen</button>
        <button onClick={() => onAuthClick('authority')} style={{ background: 'transparent', color: 'var(--text-primary)', fontWeight: 700, padding: '14px 36px', borderRadius: '8px', border: '1px solid var(--border)', cursor: 'pointer', fontSize: '1.1rem', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.target.style.background = 'rgba(0,212,255,0.1)'; e.target.style.borderColor = 'var(--accent)'; }} onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'var(--border)'; }}>Authority Portal</button>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer style={{ padding: '60px 24px 40px', background: 'var(--bg-deep)', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '40px', marginBottom: '40px' }}>
        <div>
          <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '16px', letterSpacing: '1px' }}>FIXMYCITY</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>Empowering citizens and authorities to work together for better urban living.</p>
        </div>
        <div>
          <h4 style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '16px' }}>Platform</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a href='#' style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>How It Works</a>
            <a href='#' style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Features</a>
            <a href='#' style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Pricing</a>
          </div>
        </div>
        <div>
          <h4 style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '16px' }}>Company</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a href='#' style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>About Us</a>
            <a href='#' style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Careers</a>
            <a href='#' style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Contact</a>
          </div>
        </div>
        <div>
          <h4 style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '16px' }}>Connect</h4>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span style={{ fontSize: '1.3rem', cursor: 'pointer' }}>Twitter</span>
            <span style={{ fontSize: '1.3rem', cursor: 'pointer' }}>LinkedIn</span>
            <span style={{ fontSize: '1.3rem', cursor: 'pointer' }}>Facebook</span>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>© 2026 FixMyCity. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href='#' style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Privacy</a>
          <a href='#' style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Terms</a>
        </div>
      </div>
    </footer>
  );
}

function LandingPage({ onAuthClick, stats, testimonials }) {
  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', paddingTop: '60px' }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px); background-size: 60px 60px; }
      `}</style>

      <div className='hero-grid' />
      <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '400px', background: 'radial-gradient(ellipse,rgba(0,212,255,0.12) 0%,rgba(251,191,36,0.06) 50%,transparent 80%)', pointerEvents: 'none' }} />

      <div style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 24px 60px', position: 'relative' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16,217,160,0.08)', border: '1px solid rgba(16,217,160,0.4)', color: '#10d9a0', fontFamily: 'Orbitron,sans-serif', fontSize: '0.65rem', padding: '8px 16px', borderRadius: '20px', marginBottom: '28px', letterSpacing: '1px', textTransform: 'uppercase', animation: 'fadeInUp 0.6s ease-out' }}>
          <span>●</span> AI-Powered Civic Platform
        </div>

        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 800, color: 'var(--text-primary)', margin: '12px 0 24px', lineHeight: 1.1, maxWidth: '950px', animation: 'fadeInUp 0.6s ease-out 0.1s both' }}>
          FixMyCity — <span style={{ background: 'linear-gradient(135deg, var(--accent), #10d9a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Report. Track. Improve.</span>
        </h1>

        <p style={{ fontSize: 'clamp(1rem, 2vw, 1.3rem)', color: 'var(--text-secondary)', margin: '0 20px 16px', lineHeight: 1.7, maxWidth: '750px', fontWeight: 400, animation: 'fadeInUp 0.6s ease-out 0.2s both' }}>
          Empowering citizens and city authorities to report, track, and resolve civic issues together. Make your city better, one report at a time.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px', margin: '32px 0 48px', maxWidth: '800px', animation: 'fadeInUp 0.6s ease-out 0.3s both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <span style={{ color: '#10d9a0', fontSize: '1.2rem' }}>✓</span>
            <span>AI-Powered Verification</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <span style={{ color: '#10d9a0', fontSize: '1.2rem' }}>✓</span>
            <span>Real-Time Tracking</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <span style={{ color: '#10d9a0', fontSize: '1.2rem' }}>✓</span>
            <span>Instant Authority Alerts</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', margin: '16px 0', flexWrap: 'wrap', justifyContent: 'center', animation: 'fadeInUp 0.6s ease-out 0.4s both' }}>
          <HeroCTAButton onAuthClick={onAuthClick} />
          <button onClick={() => onAuthClick('authority')} style={{ background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border)', fontWeight: 700, padding: '12px 32px', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem', transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(0,212,255,0.1)' }}
            onMouseEnter={(e) => { e.target.style.background = 'rgba(0,212,255,0.1)'; e.target.style.borderColor = 'var(--accent)'; e.target.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'var(--border)'; e.target.style.transform = 'translateY(0)'; }}
          >Authority Portal</button>
        </div>

        <StatsCounter stats={stats} />
      </div>

      <div style={{ padding: '100px 24px', background: 'var(--bg-secondary)' }}>
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 60px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>Powerful Features</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Everything you need to report and resolve civic issues efficiently</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
          <FeatureCard icon='📸' title='Smart Reporting' description='Upload photos and AI automatically categorizes and verifies your civic issue report for faster processing.' />
          <FeatureCard icon='📍' title='Location Tracking' description='Precise GPS tagging ensures authorities know exactly where issues are located for quick resolution.' />
          <FeatureCard icon='🔔' title='Instant Alerts' description='Get notified immediately when your report is viewed, in progress, or resolved by authorities.' />
          <FeatureCard icon='📊' title='Analytics Dashboard' description='Track issue patterns over time with beautiful visualizations to identify recurring problems.' />
          <FeatureCard icon='🤖' title='AI Verification' description='Our AI system automatically validates reports to reduce spam and prioritize urgent issues.' />
          <FeatureCard icon='🏛' title='Authority Tools' description='Dedicated portal for city officials to manage, assign, and resolve reports efficiently.' />
        </div>
      </div>

      <div style={{ padding: '100px 24px', background: 'var(--bg-primary)' }}>
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 60px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>How It Works</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Simple, streamlined process to get your city issues resolved</p>
        </div>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <HowItWorksStep number='1' icon='📸' title='Report an Issue' description='Snap a photo, add a description, and pinpoint the location. Our app handles the rest.' />
          <div style={{ display: 'flex', justifyContent: 'center' }}><div style={{ width: '2px', height: '40px', background: 'linear-gradient(180deg, var(--accent), transparent)' }} /></div>
          <HowItWorksStep number='2' icon='⚡' title='AI Processing' description='Our AI verifies the report, categorizes it, and routes it to the appropriate department.' />
          <div style={{ display: 'flex', justifyContent: 'center' }}><div style={{ width: '2px', height: '40px', background: 'linear-gradient(180deg, var(--accent), transparent)' }} /></div>
          <HowItWorksStep number='3' icon='👨‍💼' title='Authority Action' description='City officials receive instant alerts, assess the issue, and begin resolution efforts.' />
          <div style={{ display: 'flex', justifyContent: 'center' }}><div style={{ width: '2px', height: '40px', background: 'linear-gradient(180deg, var(--accent), transparent)' }} /></div>
          <HowItWorksStep number='4' icon='✅' title='Resolution and Feedback' description='Get notified when the issue is fixed. Rate the resolution to help us improve.' />
        </div>
      </div>

      <div style={{ padding: '100px 24px', background: 'var(--bg-secondary)' }}>
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 60px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>Trusted by Communities</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>See what citizens and authorities say about FixMyCity</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
          {testimonials.length > 0 ? testimonials.map((t, i) => <TestimonialCard key={i} name={t.name} role={t.role} quote={t.quote} avatar={t.avatar || t.name.charAt(0)} />) : null}
        </div>
      </div>

      <CTASection onAuthClick={onAuthClick} />

      <Footer />
    </div>
  );
}
function AuthModal({ isOpen, onClose, userType, onSubmit, loading, error, onGoogleSignIn, isLogin, setIsLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  if (!isOpen) return null;
  return (
    <div className='modal-overlay open' onClick={onClose}>
      <div className='modal' onClick={e => e.stopPropagation()}>
        <button className='modal-close' onClick={onClose}>&times;</button>
        <h2 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p style={{ marginBottom: '24px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{userType === 'authority' ? 'Authority' : 'Citizen'} {isLogin ? 'Sign In' : 'Sign Up'}</p>
        {error && <div style={{ background: 'rgba(255,51,102,0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>{error}</div>}
        <button onClick={onGoogleSignIn} disabled={loading} style={{ width: '100%', padding: '12px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px', opacity: loading ? 0.7 : 1 }}>Continue with Google</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}><div style={{ flex: 1, height: '1px', background: 'var(--border)' }} /><span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>or</span><div style={{ flex: 1, height: '1px', background: 'var(--border)' }} /></div>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(email, password); }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Email</label>
            <input type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='you@example.com' required style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-deep)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.95rem' }} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Password</label>
            <input type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='Password' required style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-deep)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.95rem' }} />
          </div>
          <button type='submit' className='btn-primary' style={{ width: '100%', opacity: loading ? 0.7 : 1 }} disabled={loading}>{loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}</button>
        </form>
        <p style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{isLogin ? 'Do not have an account?' : 'Already have an account?'} <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 'inherit' }}>{isLogin ? 'Sign Up' : 'Sign In'}</button></p>
      </div>
    </div>
  );
}

function SetupUsernameModal({ isOpen, onSubmit, loading, error }) {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  if (!isOpen) return null;
  return (
    <div className='modal-overlay open'>
      <div className='modal' onClick={e => e.stopPropagation()}>
        <h2 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Welcome to FixMyCity!</h2>
        <p style={{ marginBottom: '24px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Please set up your profile to continue.</p>
        {error && <div style={{ background: 'rgba(255,51,102,0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>{error}</div>}
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(username, fullName); }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Pick a Username</label>
            <input type='text' value={username} onChange={e => setUsername(e.target.value)} placeholder='e.g. john_doe' required style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-deep)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.95rem' }} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Full Name</label>
            <input type='text' value={fullName} onChange={e => setFullName(e.target.value)} placeholder='Your real name' required style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-deep)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.95rem' }} />
          </div>
          <button type='submit' className='btn-primary' style={{ width: '100%', opacity: loading ? 0.7 : 1 }} disabled={loading}>{loading ? 'Saving...' : 'Complete Setup'}</button>
        </form>
      </div>
    </div>
  );
}

function Toast({ message, show }) {
  return <div className={'toast ' + (show ? 'show' : '')}>{message}</div>;
}

export default function Home() {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [userType, setUserType] = useState('citizen');
  const [authLoading, setAuthLoading] = useState(false);
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [stats, setStats] = useState(null);
  const [testimonials, setTestimonials] = useState([]);

  const showNotification = (msg) => { setToastMsg(msg); setShowToast(true); setTimeout(() => setShowToast(false), 3000); };

  const checkUsername = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, user_type')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data || !data.username) {
        setShowUsernameModal(true);
      } else {
        // Redirect based on the ACTUAL role in the database
        if (data.user_type === 'authority') {
          window.location.href = '/authority';
        } else {
          window.location.href = '/citizen';
        }
      }
    } catch (err) {
      console.error('Error checking username:', err);
      // Fallback
      if (userType === 'authority') { window.location.href = '/authority'; }
      else { window.location.href = '/citizen'; }
    }
  };

  useEffect(() => {
    fetch('http://localhost:3001/api/reports/stats/summary')
      .then(res => res.json())
      .then(data => {
        if (data.stats) setStats(data.stats);
      })
      .catch(err => console.log('Stats fetch error:', err));

    fetch('http://localhost:3001/api/testimonials?limit=3')
      .then(res => res.json())
      .then(data => {
        if (data.testimonials) setTestimonials(data.testimonials);
      })
      .catch(err => console.log('Testimonials fetch error:', err));

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        checkUsername(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && event === 'SIGNED_IN') {
        setUser(session.user);
        setShowAuthModal(false);
        checkUsername(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [userType]);

  const handleAuthClick = (type) => {
    setUserType(type || 'citizen');
    setShowAuthModal(true);
    setAuthError('');
  };

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setAuthError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err) {
      setAuthError(err.message || 'Google sign-in failed');
      setAuthLoading(false);
    }
  };

  const [isLogin, setIsLogin] = useState(true);
  const handleAuthSubmit = async (email, password) => {
    setAuthLoading(true);
    setAuthError('');
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              user_type: userType
            }
          }
        });
        if (error) throw error;
        showNotification('Account created! Please check your email to verify.');
      }
    } catch (err) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleUsernameSubmit = async (username, fullName) => {
    setUsernameLoading(true);
    setUsernameError('');
    try {
      // Check if username unique
      const { data: existing } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (existing) {
        setUsernameError('Username already taken');
        setUsernameLoading(false);
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username,
          full_name: fullName,
          user_type: userType, // Added to satisfy DB constraint
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setShowUsernameModal(false);
      if (userType === 'authority') { window.location.href = '/authority'; }
      else { window.location.href = '/citizen'; }
    } catch (err) {
      setUsernameError(err.message || 'Failed to save username');
    } finally {
      setUsernameLoading(false);
    }
  };

  return (
    <div>
      <Nav user={user} setUser={setUser} onAuthClick={handleAuthClick} />
      <AuthModal isOpen={showAuthModal} onClose={() => { setShowAuthModal(false); setIsLogin(true); }} userType={userType} onSubmit={handleAuthSubmit} loading={authLoading} error={authError} onGoogleSignIn={handleGoogleSignIn} isLogin={isLogin} setIsLogin={setIsLogin} />
      <SetupUsernameModal isOpen={showUsernameModal} onSubmit={handleUsernameSubmit} loading={usernameLoading} error={usernameError} />
      <LandingPage onAuthClick={handleAuthClick} stats={stats} testimonials={testimonials} />
      <Toast message={toastMsg} show={showToast} />
    </div>
  );
}
