'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, ArrowRight, LockKeyhole, Mail } from 'lucide-react';
import { Button, Card, Input, Label } from '@/components/ui';
import { authenticate } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Check legacy developer accounts first
    const legacyUser = authenticate(email, password);
    if (legacyUser) {
      localStorage.setItem('medset-user', JSON.stringify(legacyUser));
      window.location.href = '/dashboard';
      return;
    }

    // Fall back to Supabase auth
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError('Incorrect email or password.');
        return;
      }
      if (!data.user) {
        setError('Unable to sign in. Please try again.');
        return;
      }

      // Check approval status
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('status, must_change_password')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError || !profile) {
        setError('Unable to load your account. Please contact your administrator.');
        return;
      }

      if (profile.status === 'pending') {
        router.push('/pending-approval');
        return;
      }
      if (profile.status === 'rejected') {
        router.push('/rejected');
        return;
      }
      if (profile.must_change_password) {
        router.push('/force-password-change');
        return;
      }
      window.location.href = '/dashboard';
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900 p-8 text-white">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500"><Activity className="h-6 w-6" /></div>
          <h1 className="mt-5 text-2xl font-semibold">Welcome to MEDSET</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to your hospital workspace</p>
        </div>
        <form onSubmit={submit} className="space-y-5">
          <div>
            <Label className="text-slate-300">MEDSET Login ID</Label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@medset.demo" className="border-slate-700 bg-slate-800 pl-9 text-white" />
            </div>
          </div>
          <div>
            <div className="flex justify-between">
              <Label className="text-slate-300">Password</Label>
              <Link href="/forgot-password" className="text-xs text-sky-400 hover:underline">Forgot password?</Link>
            </div>
            <div className="relative mt-2">
              <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" className="border-slate-700 bg-slate-800 pl-9 text-white" />
            </div>
          </div>
          {error && <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
          <Button className="w-full" size="lg" disabled={loading}>
            {loading ? 'Signing in…' : <>Sign in <ArrowRight className="h-4 w-4" /></>}
          </Button>
        </form>
        <div className="mt-6 border-t border-slate-800 pt-5 text-center text-sm text-slate-400">New to MEDSET? <Link href="/signup" className="text-sky-400 hover:underline">Create account</Link></div>
      </Card>
    </main>
  );
}
