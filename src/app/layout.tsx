import { DiffProvider } from '@/contexts/DiffContext';
import type { ReactNode } from 'react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import "./globals.css"; 

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <DiffProvider>{children}</DiffProvider>
      </body>
    </html>
  );
}
