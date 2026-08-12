import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
export const metadata = { title: 'MEDSET | Hospital Intelligence Platform', description: 'Clinical operations, documentation and analytics for modern hospitals.' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body><AuthProvider>{children}</AuthProvider></body></html>; }
