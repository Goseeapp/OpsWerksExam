import type { Metadata } from 'next';
import { MantineProvider } from '@/providers/MantineProvider';
import { ColorSchemeScript } from '@mantine/core';

export const metadata: Metadata = {
  title: 'Gadget Management System',
  description: 'Manage your gadgets',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}
