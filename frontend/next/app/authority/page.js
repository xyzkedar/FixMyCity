'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

import Navbar from '../../components/Navbar';

// Local Nav removed

function ReportCard({ report, onUpdateStatus, onEdit }) {
  const statusColors = {
    pending: { bg: 'rgba(251, 146, 60, 0.2)', color: 'var(--pending-clr)' },
    resolved: { bg: 'rgba(0, 212, 255, 0.2)', color: 'var(--solved-clr)' },
    rejected: { bg: 'rgba(255, 51, 102, 0.2)', color: 'var(--unsolved-clr)' }
  };
  const status = statusColors[report.status] || statusColors.pending;
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0', overflow: 'hidden', transition: 'all 0.2s' }}>
      {report.image_url && (
        <div style={{ width: '100%', height: '180px', overflow: 'hidden', borderBottom: '1px solid var(--border)' }}>
          <img
            src={report.image_url}
            alt={report.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      )}
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            {report.title || (report.category ? (report.category.charAt(0).toUpperCase() + report.category.slice(1) + ' Issue') : 'Untitled Report')}
          </h3>
          <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', background: status.bg, color: status.color }}>{report.status}</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '12px', lineHeight: 1.5 }}>{report.description || 'No description'}</p>
        <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
          <span>Date: {report.created_at ? new Date(report.created_at).toLocaleDateString() : 'N/A'}</span>
          <span>Category: {report.category || 'General'}</span>
        </div>
        {(report.latitude && report.longitude) && (
          <div style={{ marginBottom: '16px', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>📍</span> Location Coordinates
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                {parseFloat(report.latitude).toFixed(4)}, {parseFloat(report.longitude).toFixed(4)}
              </span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${report.latitude},${report.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.75rem', color: 'var(--accent)', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid var(--accent)' }}
              >
                Open in Maps →
              </a>
            </div>
          </div>
        )}
        {report.ai_label && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#10d9a0', background: 'rgba(16,217,160,0.1)', padding: '2px 8px', borderRadius: '4px', marginBottom: '16px', border: '1px solid rgba(16,217,160,0.2)' }}>
            <span style={{ fontSize: '0.9rem' }}>✨</span> AI Verified: {report.ai_label} ({(report.ai_confidence * 100).toFixed(0)}%)
          </div>
        )}
        {report.status === 'pending' && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={async (e) => {
                const btn = e.currentTarget;
                const originalText = btn.innerText;
                btn.innerText = '...';
                btn.disabled = true;
                await onUpdateStatus(report.id, 'resolved');
                btn.innerText = originalText;
                btn.disabled = false;
              }}
              style={{ flex: 1, padding: '8px 16px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
            >
              Mark Resolved
            </button>
            <button
              onClick={async (e) => {
                const btn = e.currentTarget;
                const originalText = btn.innerText;
                btn.innerText = '...';
                btn.disabled = true;
                await onUpdateStatus(report.id, 'rejected');
                btn.innerText = originalText;
                btn.disabled = false;
              }}
              style={{ flex: 1, padding: '8px 16px', background: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
            >
              Reject
            </button>
            <button onClick={() => onEdit(report)} style={{ padding: '8px 16px', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>Edit</button>
          </div>
        )}
      </div>
    </div>
  );
}

function EditModal({ report, isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (report) {
      setTitle(report.title || '');
      setDescription(report.description || '');
      setCategory(report.category || 'general');
    }
  }, [report]);

  if (!isOpen || !report) return null;

  const handleSave = async () => {
    setSaving(true);
    await onSave(report.id, { title, description, category });
    setSaving(false);
  };

  return (
    <div className='modal-overlay open' onClick={onClose}>
      <div className='modal' onClick={e => e.stopPropagation()}>
        <button className='modal-close' onClick={onClose}>*</button>
        <h2 style={{ marginBottom: '24px', color: 'var(--text-primary)' }}>Edit Report</h2>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Title</label>
          <input type='text' value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '12px', background: 'var(--bg-void)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem' }} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} style={{ width: '100%', padding: '12px', background: 'var(--bg-void)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem', resize: 'vertical' }} />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '12px', background: 'var(--bg-void)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem' }}>
            <option value='general'>General</option>
            <option value='roads'>Roads and Potholes</option>
            <option value='lighting'>Street Lighting</option>
            <option value='garbage'>Garbage and Sanitation</option>
            <option value='water'>Water and Drainage</option>
            <option value='parks'>Parks and Green Spaces</option>
            <option value='safety'>Public Safety</option>
            <option value='infrastructure'>Infrastructure</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '12px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '1rem', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '1rem' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ label, value, color }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
      <div style={{ fontSize: '1.8rem', fontWeight: 700, color: color || 'var(--text-primary)', marginBottom: '4px' }}>{value}</div>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{label}</div>
    </div>
  );
}

export default function AuthorityDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [editReport, setEditReport] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });

  const showNotification = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 3000);
  };

  const [isApproved, setIsApproved] = useState(false);
  const [checkingApproval, setCheckingApproval] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = '/'; return; }
      setUser(session.user);

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('user_type, is_approved')
        .eq('id', session.user.id)
        .single();

      if (error || profile.user_type !== 'authority') {
        window.location.href = '/citizen';
        return;
      }

      setIsApproved(profile.is_approved);
      setCheckingApproval(false);

      if (profile.is_approved) {
        loadReports();
      }
    };
    checkAuth();
  }, []);

  const loadReports = async () => {
    try {
      const { data: reports, error } = await supabase.from('reports').select('*').order('created_at', { ascending: false }); if (error) throw error; setReports(reports || []);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (reportId, newStatus) => {
    try {
      const updatePayload = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      if (newStatus === 'resolved') {
        updatePayload.resolved_by = user.id;
        updatePayload.resolved_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('reports')
        .update(updatePayload)
        .eq('id', reportId)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        alert('Update failed: You might not have permission to update this report.');
        return;
      }

      showNotification(`Report marked as ${newStatus}`);
      loadReports();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleEditReport = (report) => {
    setEditReport(report);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (reportId, updates) => {
    try {
      const { error } = await supabase.from('reports').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', reportId);
      if (error) {
        alert('Failed to update report: ' + error.message);
        return;
      }
      setShowEditModal(false);
      setEditReport(null);
      loadReports();
    } catch (err) {
      alert('Failed to update report: ' + err.message);
    }
  };

  const filteredReports = filter === 'all' ? reports : reports.filter(r => r.status === filter);
  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
    rejected: reports.filter(r => r.status === 'rejected').length
  };

  if (checkingApproval) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-void)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        Verifying Security Credentials...
      </div>
    );
  }

  if (!isApproved) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-void)', paddingTop: '60px' }}>
        <Navbar user={user} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center', padding: '0 24px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '24px' }}>🛡️</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>Approval Pending</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', fontSize: '1.1rem', lineHeight: 1.6 }}>
            Your account is currently under review by the city administration. You will be granted access once your official identity is verified.
          </p>
          <div style={{ marginTop: '32px', padding: '16px 24px', background: 'rgba(0, 212, 255, 0.1)', border: '1px solid var(--accent)', borderRadius: '12px', color: 'var(--accent)', fontSize: '0.9rem' }}>
            Reference ID: {user?.id}
          </div>
          <button onClick={() => window.location.href = '/'} style={{ marginTop: '32px', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer' }}>Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-void)', paddingTop: '60px' }}>
      <Navbar user={user} />
      <div style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Authority Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage and resolve city issue reports</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
          <StatsCard label='Total Reports' value={stats.total} color='var(--accent)' />
          <StatsCard label='Pending' value={stats.pending} color='var(--pending-clr)' />
          <StatsCard label='Resolved' value={stats.resolved} color='var(--solved-clr)' />
          <StatsCard label='Rejected' value={stats.rejected} color='var(--unsolved-clr)' />
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          {['all', 'pending', 'resolved', 'rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--border)', background: filter === f ? 'var(--accent)' : 'transparent', color: filter === f ? '#000' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, textTransform: 'capitalize', transition: 'all 0.2s' }}>{f}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>Loading reports...</div>
        ) : filteredReports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}><p>No reports found</p></div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {filteredReports.map(report => (<ReportCard key={report.id} report={report} onUpdateStatus={handleUpdateStatus} onEdit={handleEditReport} />))}
          </div>
        )}
      </div>
      <EditModal report={editReport} isOpen={showEditModal} onClose={() => { setShowEditModal(false); setEditReport(null); }} onSave={handleSaveEdit} />
      <div className={`toast ${toast.show ? 'show' : ''}`} style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        background: 'var(--bg-panel)',
        border: '1px solid var(--accent)',
        padding: '12px 24px',
        borderRadius: '8px',
        zIndex: 10000,
        transition: 'all 0.3s'
      }}>
        {toast.msg}
      </div>
    </div>
  );
}
