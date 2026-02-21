'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

// Using Supabase directly

import Navbar from '../../components/Navbar';

// Local Nav removed
function ReportCard({ report }) {
  const statusColors = {
    pending: { bg: 'rgba(251, 146, 60, 0.2)', color: 'var(--pending-clr)' },
    resolved: { bg: 'rgba(0, 212, 255, 0.2)', color: 'var(--solved-clr)' },
    rejected: { bg: 'rgba(255, 51, 102, 0.2)', color: 'var(--unsolved-clr)' }
  };
  const status = statusColors[report.status] || statusColors.pending;
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', transition: 'all 0.2s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{report.title || 'Untitled Report'}</h3>
        <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', background: status.bg, color: status.color }}>{report.status}</span>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '12px', lineHeight: 1.5 }}>{report.description || 'No description'}</p>
      <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
        <span>Date: {report.created_at ? new Date(report.created_at).toLocaleDateString() : 'N/A'}</span>
        <span>Category: {report.category || 'General'}</span>
      </div>
      {report.ai_label && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#10d9a0', background: 'rgba(16,217,160,0.1)', padding: '2px 8px', borderRadius: '4px', marginBottom: '12px', border: '1px solid rgba(16,217,160,0.2)' }}>
          <span style={{ fontSize: '0.9rem' }}>✨</span> AI Verified: {report.ai_label} ({(report.ai_confidence * 100).toFixed(0)}%)
        </div>
      )}
    </div>
  );
}

function AddReportModal({ isOpen, onClose, onSubmit, loading, statusText }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
          setLocation(position.coords.latitude.toFixed(6) + ', ' + position.coords.longitude.toFixed(6));
        },
        (err) => {
          setError('Could not get location: ' + err.message);
        }
      );
    } else {
      setError('Geolocation not supported');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!latitude || !longitude) {
      setError('Please provide your location');
      return;
    }
    setError('');
    onSubmit({ title, description, category, location, latitude, longitude, image });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className='modal-overlay open' onClick={onClose}>
      <div className='modal' onClick={e => e.stopPropagation()}>
        <button className='modal-close' onClick={onClose}>*</button>
        <h2 style={{ marginBottom: '24px', color: 'var(--text-primary)' }}>Report an Issue</h2>
        {error && <div style={{ background: 'rgba(255,51,102,0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Title</label>
            <input type='text' value={title} onChange={e => setTitle(e.target.value)} placeholder='Brief title of the issue' required style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-deep)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.95rem' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder='Describe the issue in detail' required rows={4} style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-deep)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.95rem', resize: 'vertical' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-deep)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
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
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Photo (optional)</label>
            <input type='file' accept='image/*' onChange={handleImageChange} style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-deep)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.95rem' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Location *</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type='text' value={location} onChange={e => setLocation(e.target.value)} placeholder='Enter location' style={{ flex: 1, padding: '12px 16px', background: 'var(--bg-deep)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.95rem' }} />
              <button type='button' onClick={handleLocation} style={{ padding: '12px 16px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Use GPS</button>
            </div>
            <input type='hidden' value={latitude} onChange={e => setLatitude(e.target.value)} />
            <input type='hidden' value={longitude} onChange={e => setLongitude(e.target.value)} />
          </div>
          <button type='submit' className='btn-primary' style={{ width: '100%', opacity: loading ? 0.7 : 1 }} disabled={loading}>{loading ? (statusText || 'Submitting...') : 'Submit Report'}</button>
        </form>
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

export default function CitizenDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = '/'; return; }
      setUser(session.user);
      loadReports();
    };
    checkAuth();
  }, []);

  const loadReports = async () => {
    try {
      const { data: reports, error } = await supabase.from("reports").select("*").order("created_at", { ascending: false }); if (error) throw error; setReports(reports || []);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const [statusText, setStatusText] = useState('');

  const handleSubmitReport = async (reportData) => {
    setSubmitting(true);
    setStatusText('Starting submission...');
    let aiLabel = null;
    let aiConfidence = null;
    try {
      // 1. Upload image to Supabase Storage FIRST (to get a public URL for AI)
      let imageUrl = null;
      if (reportData.image) {
        setStatusText('Uploading photo for verification...');
        const fileName = 'reports/' + Date.now() + '-' + reportData.image.name;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('reports')
          .upload(fileName, reportData.image, { contentType: reportData.image.type, upsert: false });

        if (uploadError) {
          alert('Failed to upload image: ' + uploadError.message);
          setSubmitting(false);
          setStatusText('');
          return;
        }

        const { data: urlData } = supabase.storage.from('reports').getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
      }

      // 2. AI Image Verification (Using the Public URL)
      if (imageUrl) {
        setStatusText('AI is analyzing image...');
        const verifyRes = await fetch('/api/verify-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl })
        });

        if (!verifyRes.ok) {
          const errorData = await verifyRes.json().catch(() => ({ error: 'AI server is temporarily busy' }));
          const proceed = confirm(`AI Verification is currently unavailable (Error: ${errorData.error}). Would you like to submit the report anyway?`);
          if (!proceed) {
            setSubmitting(false);
            setStatusText('');
            return;
          }
          aiLabel = 'Manual Submission';
          aiConfidence = 0;
        } else {
          const verifyData = await verifyRes.json();
          if (verifyData.isDown) {
            const proceed = confirm(`Note: AI Verification Service is currently unavailable. Proceed with manual submission?`);
            if (!proceed) {
              setSubmitting(false);
              setStatusText('');
              return;
            }
            aiLabel = 'Manual (AI Down)';
            aiConfidence = 0;
          } else if (!verifyData.isVerified) {
            alert(`AI rejected this image (Detected: ${verifyData.label || 'Unknown'}, Score: ${((verifyData.score || 0) * 100).toFixed(1)}%). Please upload a clear photo of a civic issue.`);
            // Optional: delete from storage here?
            setSubmitting(false);
            setStatusText('');
            return;
          } else {
            aiLabel = verifyData.label;
            aiConfidence = verifyData.score;
            setStatusText(`AI Verified: ${verifyData.label}`);
          }
        }
      }

      // 3. Insert report directly to Supabase
      setStatusText('Saving report...');
      const { data: report, error: dbError } = await supabase
        .from('reports')
        .insert({
          user_id: user.id,
          title: reportData.title,
          description: reportData.description,
          category: reportData.category,
          latitude: parseFloat(reportData.latitude),
          longitude: parseFloat(reportData.longitude),
          image_url: imageUrl,
          ai_label: aiLabel,
          ai_confidence: aiConfidence,
          status: 'pending'
        })
        .select()
        .single();

      if (dbError) {
        alert('Failed to submit report: ' + dbError.message);
        setSubmitting(false);
        setStatusText('');
        return;
      }

      setShowModal(false);
      loadReports();
    } catch (err) {
      alert('Failed to submit report: ' + err.message);
    } finally {
      setSubmitting(false);
      setStatusText('');
    }
  };

  const filteredReports = filter === 'all' ? reports : reports.filter(r => r.status === filter);
  const stats = { total: reports.length, pending: reports.filter(r => r.status === 'pending').length, resolved: reports.filter(r => r.status === 'resolved').length };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-void)', paddingTop: '60px' }}>
      <Navbar user={user} />
      <div style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>My Reports</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Track and manage your city issue reports</p>
          </div>
          <button onClick={() => setShowModal(true)} className='btn-primary' style={{ padding: '12px 24px' }}>+ New Report</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
          <StatsCard label='Total Reports' value={stats.total} color='var(--accent)' />
          <StatsCard label='Pending' value={stats.pending} color='var(--pending-clr)' />
          <StatsCard label='Resolved' value={stats.resolved} color='var(--solved-clr)' />
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
            {filteredReports.map(report => (<ReportCard key={report.id} report={report} />))}
          </div>
        )}
      </div>
      <AddReportModal isOpen={showModal} onClose={() => setShowModal(false)} onSubmit={handleSubmitReport} loading={submitting} statusText={statusText} />
    </div>
  );
}
