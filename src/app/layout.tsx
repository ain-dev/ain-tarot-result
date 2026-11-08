import { Providers } from '@/app/providers';
import { pretendard } from '@/generated/fonts/fonts';
import { Box } from '@chakra-ui/react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Mind Tarot', template: '%s | Mind Tarot' },
  description:
    '키오스크에서 받은 타로·사주·커플궁합 결과를 휴대폰에서 확인하세요.',
  // Each result URL belongs to one customer; keep them out of search engines.
  robots: { index: false, follow: false },
};

// No idle-timeout redirect here: this app is the result page customers open on
// their own phone after scanning the kiosk QR. The kiosk-style "go back to the
// intro after 10 minutes idle" timer pushed to `/home`, which does not exist in
// this app, so an idle customer lost their result and landed on a 404.
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
