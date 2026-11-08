'use client';

import React, { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';

import { QueryClient } from '@tanstack/react-query';
import EmotionRegistry from '@/app/EmotionRegistry';

export function Providers({ children }: { children: React.ReactNode }) {
  // Create the client once per browser session; creating it in the render body
  // throws the whole query cache away whenever Providers re-renders.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 60,
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <EmotionRegistry>
          <ChakraProvider>{children}</ChakraProvider>
        </EmotionRegistry>
      </QueryClientProvider>
    </>
  );
}

export default Providers;
