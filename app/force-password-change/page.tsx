'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, LockKeyhole } from 'lucide-react';
import { Button, Card, Input, Label } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

export default function ForcePasswordChange() {
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { session, refreshProfile } = useAuth();

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (newPassword.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (newPassword !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;
      if (session?.user) {
        await supabase.from('profiles').update({ must_change_password: false }).eq('id', session.user.id);
        await refreshProfile();
      }
      window.location.href = '/dashboard';
    } catch {
      setError('Unable to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900 p-8 text-white">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500"><Activity className="h-6 w-6" /></div>
          <h1 className="mt-5 text-2xl font-semibold">Set a new password</h1>
          <p className="mt-2 text-sm text-slate-400">Please choose a new password to continue.</p>
        </div>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <Label className="text-slate-300">New password</Label>
            <div className="relative mt-2">
              <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input required type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min. 8 characters" className="border-slate-700 bg-slate-800 pl-9 text-white" />
            </div>
          </div>
          <div>
            <Label className="text-slate-300">Confirm password</Label>
            <div className="relative mt-2">
              <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input required type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Re-enter password" className="border-slate-700 bg-slate-800 pl-9 text-white" />
            </div>
          </div>
          {error && <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
          <Button className="w-full" size="lg" disabled={loading}>{loading ? 'Updating…' : 'Update password'}</Button>
        </form>
      </Card>
    </main>
  );
}
