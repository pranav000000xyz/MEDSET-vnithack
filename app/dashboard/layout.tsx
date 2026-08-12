'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Activity, BarChart3, Bell, BrainCircuit, CalendarDays, ChevronLeft, ClipboardList, FileClock, FlaskConical, LayoutDashboard, LogOut, Menu, Pill, Receipt, ScanLine, Settings, Stethoscope, UserRound, Users, Warehouse, BedDouble } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAuth } from '@/lib/auth-context';
import { getInitials, ROLE_LABELS } from '@/lib/supabase';

const groups = [
  { label: 'Overview', items: [['/dashboard', 'Dashboard', LayoutDashboard]] as const },
  { label: 'Clinical', items: [['/dashboard/patients', 'Patients', Users], ['/dashboard/doctors', 'Doctors', Stethoscope], ['/dashboard/appointments', 'Appointments', CalendarDays], ['/dashboard/icu', 'ICU Management', BedDouble]] as const },
  { label: 'AI & Documentation', items: [['/dashboard/ai-scribe', 'AI Scribe', BrainCircuit], ['/dashboard/soap-notes', 'SOAP Notes', ClipboardList]] as const },
  { label: 'Diagnostics', items: [['/dashboard/laboratory', 'Laboratory', FlaskConical], ['/dashboard/radiology', 'Radiology', ScanLine]] as const },
  { label: 'Operations', items: [['/dashboard/pharmacy', 'Pharmacy', Pill], ['/dashboard/billing', 'Billing', Receipt], ['/dashboard/inventory', 'Inventory', Warehouse]] as const },
  { label: 'Insights', items: [['/dashboard/analytics', 'Analytics', BarChart3], ['/dashboard/audit-logs', 'Audit Logs', FileClock]] as const },
  { label: 'System', items: [['/dashboard/settings', 'Settings', Settings]] as const },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { profile, legacyUser, loading, signOut } = useAuth();

  const displayName = profile?.full_name ?? legacyUser?.name ?? 'Loading…';
  const displayRole = profile ? ROLE_LABELS[profile.role] : legacyUser?.role ?? '—';

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r bg-card transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center gap-2 border-b px-5">
          <div className="rounded-lg bg-primary p-1.5 text-primary-foreground"><Activity className="h-5 w-5" /></div>
          <span className="text-lg font-semibold">MEDSET</span>
          <button className="ml-auto lg:hidden" onClick={() => setOpen(false)}><ChevronLeft className="h-5 w-5" /></button>
        </div>
        <div className="scrollbar-thin h-[calc(100vh-8rem)] overflow-y-auto px-3 py-4">
          {groups.map(group => (
            <div key={group.label} className="mb-5">
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{group.label}</p>
              {group.items.map(([href, label, Icon]) => (
                <Link key={href} href={href} onClick={() => setOpen(false)} className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${pathname === href ? 'bg-accent font-medium text-accent-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                  <Icon className="h-4 w-4" />{label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="absolute bottom-0 w-full border-t bg-card p-3">
          <div className="flex items-center gap-3 rounded-lg p-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">{getInitials(displayName)}</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{displayName}</p>
              <p className="text-[11px] text-muted-foreground">{displayRole}</p>
            </div>
            <button onClick={handleSignOut}><LogOut className="h-4 w-4 text-muted-foreground" /></button>
          </div>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button>
            <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
              <span>MEDSET</span><span>/</span><span className="text-foreground">Hospital workspace</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted">
              <Bell className="h-5 w-5" /><span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">{displayName}</p>
              <p className="text-xs text-muted-foreground">{displayRole}</p>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
      {open && <div className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" onClick={() => setOpen(false)} />}
    </div>
  );
}
