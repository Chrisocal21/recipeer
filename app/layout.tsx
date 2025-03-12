import React from 'react';
import { Providers } from './providers';
import Navigation from '@/components/Navigation';
import { ColorModeScript } from '@chakra-ui/react';

export const metadata = {
  title: 'R E C I P E E R',
  description: 'Recipe management app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh', position: 'relative' }}>
        <ColorModeScript initialColorMode="dark" />
        <Providers>
          {children}
          <Navigation />
        </Providers>
      </body>
    </html>
  );
}
