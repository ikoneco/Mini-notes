import type { Metadata } from 'next';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@/theme/ThemeProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Minimal Notes',
  description: 'A radically minimalist personal note app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}