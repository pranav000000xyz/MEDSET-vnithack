'use client';

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  accent?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

const accentConfig = {
  primary: { bg: 'bg-primary/10', text: 'text-primary' },
  success: { bg: 'bg-success/10', text: 'text-success' },
  warning: { bg: 'bg-warning/10', text: 'text-warning' },
  error: { bg: 'bg-destructive/10', text: 'text-destructive' },
  info: { bg: 'bg-info/10', text: 'text-info' },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  accent = 'primary',
  className,
}: StatCardProps) {
  const config = accentConfig[accent];
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border bg-card p-5 card-hover',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {trend && (
            <p
              className={cn(
                'text-xs font-medium',
                trend.positive ? 'text-success' : 'text-destructive'
              )}
            >
              {trend.positive ? '+' : ''}
              {trend.value}
            </p>
          )}
        </div>
        <div
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110',
            config.bg,
            config.text
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
