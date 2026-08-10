'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  Brain,
  Calendar,
  CheckCircle2,
  Clipboard,
  FileText,
  HeartPulse,
  LayoutDashboard,
  Mic,
  Shield,
  Stethoscope,
  Users,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Mic,
    title: 'AI Ambient Clinical Scribe',
    description:
      'Whisper-powered speech recognition with speaker diarization. Automatically generates SOAP notes from doctor-patient conversations in Hindi, English, and Marathi.',
  },
  {
    icon: Brain,
    title: 'Medical Entity Extraction',
    description:
      'BioBERT & MedCAT extract conditions, medications, dosages, and allergies. Auto-detects drug interactions and missing diagnoses with ICD-10 coding.',
  },
  {
    icon: Activity,
    title: 'Real-time ICU Management',
    description:
      'Live bed status, ventilator and monitor assignment, nurse allocation, and emergency alerts with color-coded visual dashboard.',
  },
  {
    icon: LayoutDashboard,
    title: 'Enterprise Hospital Operations',
    description:
      'Patient management, appointments, wards, OT scheduling, lab, radiology, pharmacy, billing, inventory, staff, and visitors — all in one platform.',
  },
  {
    icon: Shield,
    title: 'Role-Based Access & Audit',
    description:
      'JWT authentication with 10 role tiers. Complete audit logs, encryption, RBAC, and HIPAA-aligned security architecture.',
  },
  {
    icon: Zap,
    title: 'Analytics & Reporting',
    description:
      'Revenue, bed occupancy, ICU utilization, AI accuracy, and department analytics with PDF, Excel, and CSV exports.',
  },
];

const modules = [
  { icon: Users, label: 'Patient Management' },
  { icon: Stethoscope, label: 'Doctor Management' },
  { icon: HeartPulse, label: 'ICU Management' },
  { icon: Calendar, label: 'Appointments' },
  { icon: Clipboard, label: 'Clinical Documentation' },
  { icon: FileText, label: 'Medical Reports' },
  { icon: Brain, label: 'AI Copilot' },
  { icon: Activity, label: 'Analytics' },
];

const stats = [
  { value: '10', label: 'Role Types' },
  { value: '20+', label: 'Modules' },
  { value: '15+', label: 'AI Features' },
  { value: '3', label: 'Languages' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 glass border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <HeartPulse className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">MEDSET</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#modules" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Modules
            </Link>
            <Link href="#ai" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              AI
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/login">
              <Button size="sm">
                Get Started
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm">
              <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-muted-foreground">AI-Powered Healthcare for Indian Hospitals</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              AI Clinical Documentation &<br />
              <span className="gradient-text">Hospital Management</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              MEDSET combines ambient AI clinical scribes with complete hospital operations — from ICU
              bed management to billing, pharmacy, lab, and analytics. One enterprise platform for modern Indian healthcare.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/login">
                <Button size="lg" className="h-12 px-8">
                  Enter Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="h-12 px-8">
                  Explore Features
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={item}>
                <div className="rounded-2xl border bg-card p-6 text-center card-hover">
                  <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything a hospital needs</h2>
          <p className="mt-3 text-muted-foreground">
            From AI-powered clinical documentation to complete operational management
          </p>
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={item}>
              <div className="group h-full rounded-2xl border bg-card p-6 card-hover">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Modules */}
      <section id="modules" className="border-y bg-secondary/30">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">20+ Integrated Modules</h2>
            <p className="mt-3 text-muted-foreground">
              Every department, every workflow, one unified platform
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {modules.map((mod, i) => (
              <motion.div
                key={mod.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex flex-col items-center gap-3 rounded-2xl border bg-card p-6 text-center card-hover">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <mod.icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium">{mod.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section id="ai" className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Brain className="h-4 w-4" />
              AI-Powered
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Ambient AI that writes while you work
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              MEDSET listens to your clinical conversations and automatically generates structured SOAP notes.
              It extracts medical entities, checks drug interactions, flags allergies, detects missing diagnoses,
              and assigns ICD-10 codes — all in real-time.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                'Whisper + Pyannote for speech recognition & diarization',
                'BioBERT & MedCAT for medical entity extraction',
                'Llama 3 + LangChain for SOAP note generation',
                'PaddleOCR for document & prescription scanning',
                'Hindi, English & Marathi language support',
              ].map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                  <span className="text-sm">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border bg-card p-6 shadow-xl"
          >
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-3 w-3 rounded-full bg-destructive" />
              <div className="flex h-3 w-3 rounded-full bg-warning" />
              <div className="flex h-3 w-3 rounded-full bg-success" />
              <span className="ml-2 text-xs text-muted-foreground">AI Scribe — Live Session</span>
            </div>
            <div className="space-y-3">
              <div className="rounded-lg bg-primary/5 p-3">
                <p className="text-xs font-medium text-primary">Doctor</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  &ldquo;Patient is a 54-year-old male, admitted with acute MI. BP is 140/90, SpO2 94%...&rdquo;
                </p>
              </div>
              <div className="rounded-lg bg-success/5 p-3">
                <p className="text-xs font-medium text-success">AI Generated SOAP Note</p>
                <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                  <p><span className="font-medium text-foreground">S:</span> 54yo male, post-MI day 2...</p>
                  <p><span className="font-medium text-foreground">O:</span> BP 140/90, HR 92, SpO2 94%...</p>
                  <p><span className="font-medium text-foreground">A:</span> Post-MI, stable on DAPT...</p>
                  <p><span className="font-medium text-foreground">P:</span> Continue meds, repeat troponin...</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {['I21.9 Acute MI', 'Drug Interaction', 'Allergy: Penicillin'].map((tag) => (
                  <span key={tag} className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-secondary/30">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to transform your hospital?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Join the next generation of AI-powered healthcare management
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login">
              <Button size="lg" className="h-12 px-8">
                Access Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" size="lg" className="h-12 px-8">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <HeartPulse className="h-4 w-4" />
              </div>
              <span className="font-bold">MEDSET</span>
              <span className="text-sm text-muted-foreground">— AI Clinical Documentation & Hospital Management</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 MEDSET. Built for Indian healthcare.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
