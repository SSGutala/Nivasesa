import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Nivasesa Agents | Lead Generation Platform",
  description: "Professional lead generation and management platform for real estate agents.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
