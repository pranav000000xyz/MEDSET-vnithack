'use client';

import Link from 'next/link';
import { Activity, Circle as XCircle } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { useAuth } from '@/lib/auth-context';

export default function Rejected() {
  const { profile } = useAuth();
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900 p-8 text-center text-white">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-500"><XCircle className="h-6 w-6" /></div>
        <h1 className="mt-5 text-2xl font-semibold">Access denied</h1>
        <p className="mt-3 text-sm text-slate-400">Your account request was not approved. {profile?.rejection_reason ? `Reason: ${profile.rejection_reason}` : 'Please contact your hospital administrator if you believe this is an error.'}</p>
        <div className="mt-6 flex items-center justify-center gap-1 text-slate-500"><Activity className="h-4 w-4" /> MEDSET</div>
        <Link href="/login"><Button variant="outline" className="mt-6 w-full border-slate-700 bg-transparent text-white hover:bg-slate-800">Back to sign in</Button></Link>
      </Card>
    </main>
  );
}
