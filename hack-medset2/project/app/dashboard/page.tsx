'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowUpRight,
  BedDouble,
  Brain,
  Calendar,
  IndianRupee,
  LayoutDashboard,
  Microscope,
  Pill,
  Stethoscope,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { StatCard } from '@/components/shared/stat-card';
import { StatusBadge, getPatientStatusType } from '@/components/shared/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  appointments,
  beds,
  dashboardStats,
  departmentData,
  icuTrendData,
  notifications,
  patientFlowData,
  patients,
  revenueData,
} from '@/lib/mock-data';

const bedTypeData = [
  { name: 'Available', value: beds.filter((b) => b.status === 'Available').length, color: 'hsl(var(--success))' },
  { name: 'Occupied', value: beds.filter((b) => b.status === 'Occupied').length, color: 'hsl(var(--destructive))' },
  { name: 'Reserved', value: beds.filter((b) => b.status === 'Reserved').length, color: 'hsl(var(--info))' },
  { name: 'Other', value: beds.filter((b) => ['Maintenance', 'Cleaning'].includes(b.status)).length, color: 'hsl(var(--warning))' },
];

export default function DashboardPage() {
  const icuBeds = beds.filter((b) => b.ward.startsWith('ICU'));
  const icuOccupied = icuBeds.filter((b) => b.status === 'Occupied').length;
  const recentPatients = patients.slice(0, 5);
  const upcomingAppointments = appointments.filter((a) => ['Scheduled', 'Checked-in', 'In Progress'].includes(a.status)).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <LayoutDashboard className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hospital Dashboard</h1>
          <p className="text-sm text-muted-foreground">Real-time overview of hospital operations — {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Patients" value={dashboardStats.totalPatients.toLocaleString('en-IN')} icon={Users} trend={{ value: '12.5% this month', positive: true }} accent="primary" />
        <StatCard title="Appointments Today" value={dashboardStats.appointmentsToday} icon={Calendar} trend={{ value: '8% vs yesterday', positive: true }} accent="info" />
        <StatCard title="ICU Patients" value={dashboardStats.icuPatients} icon={BedDouble} trend={{ value: '2 critical', positive: false }} accent="error" />
        <StatCard title="Revenue Today" value={`₹${(dashboardStats.revenueToday / 1000).toFixed(0)}K`} icon={IndianRupee} trend={{ value: '15.2% vs avg', positive: true }} accent="success" />
      </div>

      {/* Charts row 1 */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Revenue chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Revenue & Expenses</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Monthly trend (₹)</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-1.5">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-success">+18.2%</span>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000000}M`} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, '']}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" strokeWidth={2} fill="url(#revGrad)" name="Revenue" />
                <Area type="monotone" dataKey="expenses" stroke="hsl(var(--chart-4))" strokeWidth={2} fill="url(#expGrad)" name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bed occupancy pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bed Occupancy</CardTitle>
            <p className="text-sm text-muted-foreground">Total {beds.length} beds</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={bedTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3}>
                  {bedTypeData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-3 space-y-1.5">
              {bedTypeData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Patient flow */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Patient Flow This Week</CardTitle>
            <p className="text-sm text-muted-foreground">Admissions, discharges & emergency cases</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100" height={240}>
              <BarChart data={patientFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="admissions" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Admissions" />
                <Bar dataKey="discharges" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Discharges" />
                <Bar dataKey="emergency" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} name="Emergency" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ICU trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ICU Utilization</CardTitle>
            <p className="text-sm text-muted-foreground">{icuOccupied}/{icuBeds.length} beds occupied ({dashboardStats.icuOccupancy}%)</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={icuTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="occupancy" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ fill: 'hsl(var(--chart-1))', r: 3 }} name="Occupancy %" />
                <Line type="monotone" dataKey="alerts" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={{ fill: 'hsl(var(--chart-4))', r: 3 }} name="Alerts" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Lists row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent patients */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Patients</CardTitle>
            <Link href="/dashboard/patients" className="flex items-center gap-1 text-sm text-primary hover:underline">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentPatients.map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent/50 transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                    {p.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.mrn} · {p.diagnosis}</p>
                  </div>
                  <StatusBadge status={getPatientStatusType(p.status)} label={p.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Active Alerts</CardTitle>
            <Zap className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.filter((n) => !n.read).map((n) => (
                <div key={n.id} className="flex gap-3 rounded-lg border p-3">
                  <span className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${n.type === 'critical' ? 'bg-destructive animate-pulse' : n.type === 'warning' ? 'bg-warning' : n.type === 'success' ? 'bg-success' : 'bg-info'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { icon: Users, label: 'New Patient', href: '/dashboard/patients', color: 'text-primary' },
              { icon: Calendar, label: 'Appointment', href: '/dashboard/appointments', color: 'text-info' },
              { icon: Brain, label: 'AI Scribe', href: '/dashboard/ai-scribe', color: 'text-primary' },
              { icon: Microscope, label: 'Lab Order', href: '/dashboard/laboratory', color: 'text-success' },
              { icon: Pill, label: 'Pharmacy', href: '/dashboard/pharmacy', color: 'text-warning' },
              { icon: Stethoscope, label: 'ICU', href: '/dashboard/icu', color: 'text-destructive' },
            ].map((action) => (
              <Link key={action.label} href={action.href}>
                <div className="flex flex-col items-center gap-2 rounded-xl border p-4 card-hover">
                  <action.icon className={`h-6 w-6 ${action.color}`} />
                  <span className="text-xs font-medium">{action.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
