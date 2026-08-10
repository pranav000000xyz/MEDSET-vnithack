'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  ChevronDown,
  HelpCircle,
  Languages,
  Search,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { notifications, currentUser } from '@/lib/mock-data';
import { ROLE_LABELS } from '@/lib/types';
import { cn } from '@/lib/utils';

const typeColors: Record<string, string> = {
  critical: 'bg-destructive',
  warning: 'bg-warning',
  info: 'bg-info',
  success: 'bg-success',
  error: 'bg-destructive',
};

export function Topbar() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-card/80 px-6 backdrop-blur-xl">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search patients, doctors, appointments..."
          className="h-9 pl-10 pr-4 bg-secondary/50 border-0"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Languages className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <HelpCircle className="h-4 w-4" />
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9"
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                {unreadCount}
              </span>
            )}
          </Button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 rounded-2xl border bg-card shadow-xl overflow-hidden"
              >
                <div className="flex items-center justify-between border-b p-3">
                  <p className="font-semibold text-sm">Notifications</p>
                  <span className="text-xs text-muted-foreground">{unreadCount} unread</span>
                </div>
                <div className="max-h-80 overflow-y-auto scrollbar-thin">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        'flex gap-3 border-b p-3 hover:bg-accent/50 transition-colors cursor-pointer',
                        !n.read && 'bg-primary/5'
                      )}
                    >
                      <span className={cn('mt-1.5 h-2 w-2 flex-shrink-0 rounded-full', typeColors[n.type])} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{n.module}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2">
                  <Button variant="ghost" size="sm" className="w-full text-xs">
                    Mark all as read
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mx-1 h-6 w-px bg-border" />

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 rounded-lg p-1 hover:bg-accent transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
              AS
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium leading-none">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{ROLE_LABELS[currentUser.role]}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 rounded-2xl border bg-card shadow-xl overflow-hidden"
              >
                <div className="border-b p-3">
                  <p className="text-sm font-semibold">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {ROLE_LABELS[currentUser.role]}
                  </div>
                </div>
                <div className="p-1.5">
                  {['My Profile', 'Settings', 'Help & Support', 'Sign Out'].map((item) => (
                    <button
                      key={item}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors text-left"
                    >
                      {item === 'Settings' && <Settings className="h-4 w-4 text-muted-foreground" />}
                      {item === 'Sign Out' && <span className="text-destructive">{item}</span>}
                      {!['Settings', 'Sign Out'].includes(item) && item}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
