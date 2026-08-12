'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { Activity, ArrowLeft, Mail } from 'lucide-react';
import { Button, Card, Input, Label } from '@/components/ui';
import { supabase } from '@/lib/supabase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/force-password-change`,
      });
      if (resetError) throw resetError;
      setSent(true);
    } catch {
      setError('Unable to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <Card className="w-full max-w-md border-slate-800 bg-slate-900 p-8 text-center text-white">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500"><Activity className="h-6 w-6" /></div>
          <h1 className="mt-5 text-2xl font-semibold">Check your email</h1>
          <p className="mt-3 text-sm text-slate-400">We have sent a password reset link to <span className="text-sky-400">{email}</span>. Follow the link to set a new password.</p>
          <Link href="/login"><Button variant="outline" className="mt-6 w-full border-slate-700 bg-transparent text-white hover:bg-slate-800"><ArrowLeft className="h-4 w-4" /> Back to sign in</Button></Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900 p-8 text-white">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500"><Activity className="h-6 w-6" /></div>
          <h1 className="mt-5 text-2xl font-semibold">Reset password</h1>
          <p className="mt-2 text-sm text-slate-400">Enter your MEDSET Login ID and we will send you a reset link.</p>
        </div>
        <form onSubmit={submit} className="space-y-5">
          <div>
            <Label className="text-slate-300">MEDSET Login ID</Label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@medset.demo" className="border-slate-700 bg-slate-800 pl-9 text-white" />
            </div>
          </div>
          {error && <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
          <Button className="w-full" size="lg" disabled={loading}>{loading ? 'Sending…' : 'Send reset link'}</Button>
        </form>
        <div className="mt-6 text-center"><Link href="/login" className="text-sm text-sky-400 hover:underline">Back to sign in</Link></div>
      </Card>
    </main>
  );
}
