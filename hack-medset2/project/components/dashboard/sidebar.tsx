'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Activity,
  Brain,
  Calendar,
  CreditCard,
  FileText,
  FlaskConical,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  type LucideIcon,
  Microscope,
  Pill,
  Receipt,
  Settings,
  Stethoscope,
  Users,
  Warehouse,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROLE_LABELS } from '@/lib/types';
import { currentUser } from '@/lib/mock-data';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  group: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, group: 'Overview' },
  { label: 'Patients', href: '/dashboard/patients', icon: Users, group: 'Clinical' },
  { label: 'Doctors', href: '/dashboard/doctors', icon: Stethoscope, group: 'Clinical' },
  { label: 'Appointments', href: '/dashboard/appointments', icon: Calendar, badge: '47', group: 'Clinical' },
  { label: 'ICU Management', href: '/dashboard/icu', icon: HeartPulse, badge: '3', group: 'Clinical' },
  { label: 'AI Scribe', href: '/dashboard/ai-scribe', icon: Brain, badge: 'AI', group: 'AI' },
  { label: 'SOAP Notes', href: '/dashboard/soap-notes', icon: FileText, group: 'AI' },
  { label: 'Laboratory', href: '/dashboard/laboratory', icon: FlaskConical, badge: '18', group: 'Diagnostics' },
  { label: 'Radiology', href: '/dashboard/radiology', icon: Microscope, group: 'Diagnostics' },
  { label: 'Pharmacy', href: '/dashboard/pharmacy', icon: Pill, badge: '3', group: 'Operations' },
  { label: 'Billing', href: '/dashboard/billing', icon: CreditCard, group: 'Operations' },
  { label: 'Inventory', href: '/dashboard/inventory', icon: Warehouse, group: 'Operations' },
  { label: 'Analytics', href: '/dashboard/analytics', icon: Activity, group: 'Insights' },
  { label: 'Audit Logs', href: '/dashboard/audit-logs', icon: Receipt, group: 'Insights' },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings, group: 'System' },
];

export function Sidebar() {
  const pathname = usePathname();
  const groups = Array.from(new Set(navItems.map((item) => item.group)));

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <HeartPulse className="h-5 w-5" />
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight">MEDSET</span>
          <p className="text-[10px] text-muted-foreground leading-none">Healthcare Platform</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4">
        {groups.map((group) => (
          <div key={group} className="mb-6">
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {group}
            </p>
            <div className="space-y-0.5">
              {navItems
                .filter((item) => item.group === group)
                .map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary"
                        />
                      )}
                      <item.icon className={cn('h-4 w-4', isActive && 'text-primary')} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            'rounded-md px-1.5 py-0.5 text-[10px] font-semibold',
                            item.badge === 'AI'
                              ? 'bg-primary text-primary-foreground'
                              : item.badge === '3'
                              ? 'bg-destructive/10 text-destructive'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="border-t p-3">
        <div className="flex items-center gap-3 rounded-lg p-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
            AS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground">{ROLE_LABELS[currentUser.role]}</p>
          </div>
          <Link href="/login" className="text-muted-foreground hover:text-destructive transition-colors">
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
