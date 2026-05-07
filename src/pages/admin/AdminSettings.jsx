import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../lib/api';
import { FiLock, FiCheck, FiUser, FiMail } from 'react-icons/fi';

const D = {
  card:   'rgba(255,255,255,0.04)',
  border: 'rgba(255,255,255,0.08)',
  input:  'rgba(255,255,255,0.06)',
  muted:  'rgba(255,255,255,0.45)',
  label:  'rgba(255,255,255,0.55)',
};

const inputBase = {
  background: D.input,
  border: `1px solid ${D.border}`,
  color: '#fff',
  borderRadius: '0.75rem',
  padding: '0.7rem 1rem',
  width: '100%',
  fontSize: '0.875rem',
  outline: 'none',
};

export default function AdminSettings() {
  const { admin } = useAuth();

  const [form, setForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState('');
  const [error,   setError]   = useState('');

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setSuccess(''); setError(''); };

  const save = async (e) => {
    e.preventDefault();
    if (form.new_password !== form.confirm_password) {
      setError('New passwords do not match.');
      return;
    }
    if (form.new_password.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await authApi.changePassword(form.current_password, form.new_password);
      setSuccess('Password updated successfully.');
      setForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-black text-white">Settings</h1>
        <p className="text-sm mt-1" style={{ color: D.muted }}>Manage your account</p>
      </div>

      {/* Account info */}
      <section className="rounded-2xl border p-6 mb-6" style={{ background: D.card, borderColor: D.border }}>
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Account Info</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
              <FiUser size={14} />
            </div>
            <div>
              <p className="text-xs" style={{ color: D.muted }}>Name</p>
              <p className="text-sm font-semibold text-white">{admin?.name || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
              <FiMail size={14} />
            </div>
            <div>
              <p className="text-xs" style={{ color: D.muted }}>Email</p>
              <p className="text-sm font-semibold text-white">{admin?.email || '—'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Change password */}
      <section className="rounded-2xl border p-6" style={{ background: D.card, borderColor: D.border }}>
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
          <FiLock size={14} style={{ color: '#7cb26e' }} /> Change Password
        </h2>

        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: D.label }}>Current Password</label>
            <input
              style={inputBase}
              type="password"
              required
              value={form.current_password}
              onChange={e => set('current_password', e.target.value)}
              placeholder="Enter current password"
              autoComplete="current-password"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: D.label }}>New Password</label>
            <input
              style={inputBase}
              type="password"
              required
              value={form.new_password}
              onChange={e => set('new_password', e.target.value)}
              placeholder="Minimum 6 characters"
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: D.label }}>Confirm New Password</label>
            <input
              style={inputBase}
              type="password"
              required
              value={form.confirm_password}
              onChange={e => set('confirm_password', e.target.value)}
              placeholder="Repeat new password"
              autoComplete="new-password"
            />
          </div>

          {error && (
            <p className="text-xs font-semibold px-3 py-2 rounded-xl" style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }}>
              {error}
            </p>
          )}
          {success && (
            <p className="text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-2" style={{ background: 'rgba(124,178,110,0.1)', color: '#7cb26e', border: '1px solid rgba(124,178,110,0.2)' }}>
              <FiCheck size={13} /> {success}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-accent text-white font-bold text-sm hover:bg-accent/90 disabled:opacity-60 transition-all"
          >
            {saving ? 'Saving…' : 'Update Password'}
          </button>
        </form>
      </section>
    </div>
  );
}
