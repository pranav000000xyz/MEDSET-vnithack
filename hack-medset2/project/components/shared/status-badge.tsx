'use client';

import { cn } from '@/lib/utils';

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'critical';

const statusConfig: Record<StatusType, { bg: string; text: string; dot: string; label: string }> = {
  success: { bg: 'bg-success/10', text: 'text-success', dot: 'bg-success', label: 'Success' },
  warning: { bg: 'bg-warning/10', text: 'text-warning', dot: 'bg-warning', label: 'Warning' },
  error: { bg: 'bg-destructive/10', text: 'text-destructive', dot: 'bg-destructive', label: 'Error' },
  info: { bg: 'bg-info/10', text: 'text-info', dot: 'bg-info', label: 'Info' },
  neutral: { bg: 'bg-muted', text: 'text-muted-foreground', dot: 'bg-muted-foreground', label: 'Neutral' },
  critical: { bg: 'bg-destructive/15', text: 'text-destructive', dot: 'bg-destructive animate-pulse', label: 'Critical' },
};

export function StatusBadge({
  status,
  label,
  className,
}: {
  status: StatusType;
  label?: string;
  className?: string;
}) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.bg,
        config.text,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      {label || config.label}
    </span>
  );
}

export function getPatientStatusType(status: string): StatusType {
  switch (status) {
    case 'Admitted':
    case 'Scheduled':
    case 'Checked-in':
      return 'info';
    case 'ICU':
    case 'Emergency':
      return 'critical';
    case 'Discharged':
    case 'Completed':
      return 'success';
    case 'Cancelled':
    case 'No-show':
    case 'Overdue':
      return 'error';
    case 'Outpatient':
    case 'In Progress':
      return 'warning';
    default:
      return 'neutral';
  }
}

export function getBedStatusType(status: string): StatusType {
  switch (status) {
    case 'Available':
      return 'success';
    case 'Occupied':
      return 'error';
    case 'Reserved':
      return 'info';
    case 'Maintenance':
    case 'Cleaning':
      return 'warning';
    default:
      return 'neutral';
  }
}

export function getInvoiceStatusType(status: string): StatusType {
  switch (status) {
    case 'Paid':
    case 'Verified':
    case 'Completed':
    case 'Approved':
      return 'success';
    case 'Partial':
    case 'Processing':
    case 'Reviewed':
    case 'Scheduled':
      return 'warning';
    case 'Unpaid':
    case 'Ordered':
    case 'Sample Collected':
    case 'Draft':
    case 'Generated':
      return 'info';
    case 'Overdue':
    case 'Rejected':
    case 'Cancelled':
      return 'error';
    default:
      return 'neutral';
  }
}
