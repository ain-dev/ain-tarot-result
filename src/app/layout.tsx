import type { Metadata } from 'next';
import { Providers } from '@/app/providers';
import { pretendard } from '@/generated/fonts/fonts';
import { Box } from '@chakra-ui/react';

export const metadata: Metadata = {
  title: 'Mind Tarot',
  description: 'Tarot application for mental health',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={pretendard.className}>
        <Providers>
          <Box
            w={{ base: '100%', sm: '100%' }}
            h="100%"
            bgImage="/images/tarot_background_image.png"
            bgSize="cover"
          >
            {children}
          </Box>
        </Providers>
      </body>
    </html>
  );
}
