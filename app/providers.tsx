'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import React from 'react';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  styles: {
    global: () => ({
      body: {
        bg: 'gray.900',
        color: 'white',
      },
      '*::placeholder': {
        color: 'whiteAlpha.400',
      },
      '*, *::before, &::after': {
        borderColor: 'whiteAlpha.300',
      },
    }),
  },
  components: {
    Container: {
      baseStyle: {
        maxW: 'container.xl',
        px: [4, 6, 8],
      }
    },
    Button: {
      defaultProps: {
        colorScheme: 'teal',
      }
    }
  }
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme} cssVarsRoot="body">
        {children}
      </ChakraProvider>
    </CacheProvider>
  );
}
