'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { Button, Card, Input, Label, Select } from '@/components/ui';
import { supabase, SIGNUP_ROLES, type UserRole } from '@/lib/supabase';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('doctor');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      setLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, role, department, phone } },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (!data.user) {
        setError('Unable to create account. Please try again.');
        return;
      }

      setDone(true);
      setTimeout(() => router.push('/pending-approval'), 3000);
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <Card className="w-full max-w-md border-slate-800 bg-slate-900 p-8 text-center text-white">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500"><Activity className="h-6 w-6" /></div>
          <h1 className="mt-5 text-2xl font-semibold">Account created</h1>
          <p className="mt-3 text-sm text-slate-400">Your request has been submitted for approval. A hospital administrator will review and activate your account. You will be redirected shortly.</p>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900 p-8 text-white">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500"><Activity className="h-6 w-6" /></div>
          <h1 className="mt-5 text-2xl font-semibold">Create your account</h1>
          <p className="mt-2 text-sm text-slate-400">Request access to the MEDSET workspace</p>
        </div>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <Label className="text-slate-300">Full name</Label>
            <div className="relative mt-2">
              <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Dr. Jane Smith" className="border-slate-700 bg-slate-800 pl-9 text-white" />
            </div>
          </div>
          <div>
            <Label className="text-slate-300">Work email (your MEDSET Login ID)</Label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@hospital.com" className="border-slate-700 bg-slate-800 pl-9 text-white" />
            </div>
          </div>
          <div>
            <Label className="text-slate-300">Password</Label>
            <div className="relative mt-2">
              <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" className="border-slate-700 bg-slate-800 pl-9 text-white" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-slate-300">Role</Label>
              <Select value={role} onChange={e => setRole(e.target.value as UserRole)} className="mt-2 border-slate-700 bg-slate-800 text-white">
                {SIGNUP_ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </Select>
            </div>
            <div>
              <Label className="text-slate-300">Department</Label>
              <Input value={department} onChange={e => setDepartment(e.target.value)} placeholder="Cardiology" className="mt-2 border-slate-700 bg-slate-800 text-white" />
            </div>
          </div>
          <div>
            <Label className="text-slate-300">Phone (optional)</Label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" className="mt-2 border-slate-700 bg-slate-800 text-white" />
          </div>
          {error && <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
          <Button className="w-full" size="lg" disabled={loading}>
            {loading ? 'Creating account…' : <>Request access <ArrowRight className="h-4 w-4" /></>}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">Already have an account? <Link href="/login" className="text-sky-400 hover:underline">Sign in</Link></p>
      </Card>
    </main>
  );
}
