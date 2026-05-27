import type { Metadata } from 'next';
import { Bricolage_Grotesque } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import './globals.css';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
  axes: ['opsz', 'wdth'],
});

export const metadata: Metadata = {
  title: 'VedaAI — Assessment Creator',
  description: 'AI-powered assignment and question paper generation for teachers',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={bricolage.variable}>
      <body className="flex min-h-screen bg-gradient-to-b from-[#eeeeee] to-[#dadada]">
        <Sidebar />
        <div className="flex flex-1 flex-col min-w-0 pb-20 lg:pb-0">
          {children}
        </div>
        <MobileNav />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              borderRadius: '16px',
              background: '#181818',
              color: '#fff',
              fontSize: '14px',
              letterSpacing: '-0.01em',
            },
            success: { iconTheme: { primary: '#FF5623', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}
