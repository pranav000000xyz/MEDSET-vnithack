'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Plus, Search, Star, Stethoscope, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { PageHeader } from '@/components/shared/page-header';
import { doctors as initialDoctors } from '@/lib/mock-data';
import type { Doctor } from '@/lib/types';
import { cn } from '@/lib/utils';

const statusTypes: Record<string, 'success' | 'warning' | 'error' | 'neutral'> = {
  Available: 'success',
  Busy: 'warning',
  'On Leave': 'neutral',
  'Off Duty': 'neutral',
};

export default function DoctorsPage() {
  const [doctors] = useState<Doctor[]>(initialDoctors);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  const departments = ['all', ...Array.from(new Set(doctors.map((d) => d.department)))];

  const filtered = doctors.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.specialization.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'all' || d.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Doctor Management"
        description="Manage medical staff, specializations, and availability"
        icon={Stethoscope}
        actions={
          <Button>
            <Plus className="mr-1.5 h-4 w-4" />
            Add Doctor
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Doctors', value: doctors.length, color: 'text-primary' },
          { label: 'Available Now', value: doctors.filter((d) => d.status === 'Available').length, color: 'text-success' },
          { label: 'On Leave', value: doctors.filter((d) => d.status === 'On Leave').length, color: 'text-muted-foreground' },
          { label: 'Patients Today', value: doctors.reduce((sum, d) => sum + d.patientsToday, 0), color: 'text-info' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={cn('text-2xl font-bold mt-1', stat.color)}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search doctors..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-thin">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setDeptFilter(dept)}
              className={cn(
                'whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                deptFilter === dept ? 'bg-primary text-primary-foreground' : 'bg-card border hover:bg-accent'
              )}
            >
              {dept === 'all' ? 'All Departments' : dept}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((doc, i) => (
          <motion.div key={doc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="card-hover">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary text-lg font-semibold">
                    {doc.name.replace('Dr. ', '').split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{doc.name}</p>
                        <p className="text-sm text-primary">{doc.specialization}</p>
                      </div>
                      <StatusBadge status={statusTypes[doc.status]} label={doc.status} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{doc.department}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-warning fill-warning" />
                    <span className="font-medium">{doc.rating}</span>
                    <span className="text-muted-foreground text-xs">rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{doc.patientsToday}</span>
                    <span className="text-muted-foreground text-xs">today</span>
                  </div>
                  <div className="text-muted-foreground text-xs">{doc.experience} yrs exp</div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {doc.qualifications.map((q) => (
                    <span key={q} className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium">{q}</span>
                  ))}
                </div>

                <div className="mt-4 flex gap-2 border-t pt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone className="mr-1.5 h-3.5 w-3.5" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="mr-1.5 h-3.5 w-3.5" />
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
