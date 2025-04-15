'use client'

import { Providers } from '@/app/providers';
import { pretendard } from '@/generated/fonts/fonts';
import { Box } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        router.push('/home'); // ← 인트로 화면 주소로 수정
      }, 10 * 60 * 1000); // 10분 (테스트용으로는 10초로 바꿔도 됨)
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [router]);

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
