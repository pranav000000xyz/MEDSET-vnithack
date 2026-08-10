'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Clipboard,
  FileText,
  Heart,
  MapPin,
  Phone,
  Plus,
  Search,
  Stethoscope,
  Thermometer,
  Users,
  Wind,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge, getPatientStatusType } from '@/components/shared/status-badge';
import { PageHeader } from '@/components/shared/page-header';
import { patients as initialPatients } from '@/lib/mock-data';
import type { Patient } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function PatientsPage() {
  const [patients] = useState<Patient[]>(initialPatients);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Patient | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  const filtered = patients.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.mrn.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: patients.length,
    Admitted: patients.filter((p) => p.status === 'Admitted').length,
    ICU: patients.filter((p) => p.status === 'ICU').length,
    Emergency: patients.filter((p) => p.status === 'Emergency').length,
    Outpatient: patients.filter((p) => p.status === 'Outpatient').length,
    Discharged: patients.filter((p) => p.status === 'Discharged').length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patient Management"
        description="Register, track, and manage all patient records"
        icon={Users}
        actions={
          <Button onClick={() => setShowRegister(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            Register Patient
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or MRN..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-thin">
          {Object.entries(statusCounts).map(([key, count]) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={cn(
                'flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                statusFilter === key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border hover:bg-accent'
              )}
            >
              {key === 'all' ? 'All' : key}
              <span className={cn('rounded px-1 text-xs', statusFilter === key ? 'bg-primary-foreground/20' : 'bg-muted')}>
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Patient grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="cursor-pointer card-hover" onClick={() => setSelected(p)}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                      {p.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.mrn}</p>
                    </div>
                  </div>
                  <StatusBadge status={getPatientStatusType(p.status)} label={p.status} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="font-medium text-foreground">{p.age}</span> yrs · {p.gender}
                  </div>
                  <div className="text-muted-foreground">Blood: <span className="font-medium text-foreground">{p.bloodGroup}</span></div>
                </div>

                {p.diagnosis && (
                  <div className="mt-3 rounded-lg bg-secondary/50 p-2.5">
                    <p className="text-xs text-muted-foreground">Diagnosis</p>
                    <p className="text-sm font-medium">{p.diagnosis}</p>
                  </div>
                )}

                {p.vitals && (
                  <div className="mt-3 flex gap-2">
                    <div className="flex items-center gap-1 rounded-md bg-destructive/5 px-2 py-1 text-xs">
                      <Heart className="h-3 w-3 text-destructive" />
                      <span className="font-medium">{p.vitals.heartRate}</span>
                    </div>
                    <div className="flex items-center gap-1 rounded-md bg-info/5 px-2 py-1 text-xs">
                      <Wind className="h-3 w-3 text-info" />
                      <span className="font-medium">{p.vitals.oxygenSaturation}%</span>
                    </div>
                    <div className="flex items-center gap-1 rounded-md bg-warning/5 px-2 py-1 text-xs">
                      <Thermometer className="h-3 w-3 text-warning" />
                      <span className="font-medium">{p.vitals.temperature}°F</span>
                    </div>
                  </div>
                )}

                {p.allergies.length > 0 && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    <span>Allergies: {p.allergies.join(', ')}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Patient detail drawer */}
      {selected && <PatientDetailDrawer patient={selected} onClose={() => setSelected(null)} />}

      {/* Register modal */}
      {showRegister && <RegisterPatientModal onClose={() => setShowRegister(false)} />}
    </div>
  );
}

function PatientDetailDrawer({ patient, onClose }: { patient: Patient; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        className="relative h-full w-full max-w-xl overflow-y-auto scrollbar-thin bg-card border-l shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-card/95 backdrop-blur p-5">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-accent">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold">Patient Details</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-accent">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Patient info */}
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary text-xl font-semibold">
              {patient.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{patient.name}</h3>
              <p className="text-sm text-muted-foreground">{patient.mrn}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <StatusBadge status={getPatientStatusType(patient.status)} label={patient.status} />
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">{patient.age} yrs · {patient.gender}</span>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">Blood: {patient.bloodGroup}</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-lg border p-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium">{patient.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border p-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="text-sm font-medium truncate">{patient.address}</p>
              </div>
            </div>
          </div>

          {/* Diagnosis & Doctor */}
          {patient.diagnosis && (
            <div className="rounded-xl border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Stethoscope className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold">Current Diagnosis</p>
              </div>
              <p className="text-sm">{patient.diagnosis}</p>
              {patient.doctor && <p className="text-xs text-muted-foreground mt-1">Attending: {patient.doctor}</p>}
            </div>
          )}

          {/* Vitals */}
          {patient.vitals && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  Latest Vitals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {[
                    { label: 'Heart Rate', value: `${patient.vitals.heartRate} bpm`, icon: Heart, color: 'text-destructive' },
                    { label: 'Blood Pressure', value: patient.vitals.bloodPressure, icon: Activity, color: 'text-primary' },
                    { label: 'Temperature', value: `${patient.vitals.temperature}°F`, icon: Thermometer, color: 'text-warning' },
                    { label: 'SpO₂', value: `${patient.vitals.oxygenSaturation}%`, icon: Wind, color: 'text-info' },
                    { label: 'Respiratory', value: `${patient.vitals.respiratoryRate}/min`, icon: Wind, color: 'text-success' },
                  ].map((v) => (
                    <div key={v.label} className="rounded-lg bg-secondary/50 p-3">
                      <v.icon className={`h-4 w-4 ${v.color}`} />
                      <p className="text-xs text-muted-foreground mt-1">{v.label}</p>
                      <p className="text-sm font-bold">{v.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Allergies & Medications */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  Allergies
                </CardTitle>
              </CardHeader>
              <CardContent>
                {patient.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.map((a) => (
                      <span key={a} className="rounded-md bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">{a}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No known allergies</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {patient.medications.length > 0 ? (
                  <div className="space-y-1">
                    {patient.medications.map((m) => (
                      <p key={m} className="text-sm">{m}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No active medications</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Medical history timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clipboard className="h-4 w-4 text-primary" />
                Medical Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {patient.history.map((h, i) => (
                  <div key={h.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                        {i + 1}
                      </div>
                      {i < patient.history.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                    </div>
                    <div className="flex-1 pb-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{h.title}</p>
                        <span className="text-xs text-muted-foreground">{h.date}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{h.description}</p>
                      <span className="mt-1 inline-block rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium">{h.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}

function RegisterPatientModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-lg rounded-2xl border bg-card shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin"
      >
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-lg font-bold">Register New Patient</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-accent">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form className="p-5 space-y-4" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <Input className="mt-1" placeholder="Patient name" required />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input className="mt-1" placeholder="+91..." required />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Age</label>
              <Input className="mt-1" type="number" placeholder="Age" required />
            </div>
            <div>
              <label className="text-sm font-medium">Gender</label>
              <select className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Blood Group</label>
              <select className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                  <option key={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Address</label>
            <Input className="mt-1" placeholder="Full address" />
          </div>
          <div>
            <label className="text-sm font-medium">Known Allergies</label>
            <Input className="mt-1" placeholder="Comma separated (e.g. Penicillin, Sulfa)" />
          </div>
          <div>
            <label className="text-sm font-medium">Insurance Provider</label>
            <Input className="mt-1" placeholder="Optional" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Register Patient</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
