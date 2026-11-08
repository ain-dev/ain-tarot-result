import { Box } from '@chakra-ui/react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '커플궁합 결과',
  description: '두 분의 카드로 본 커플궁합 결과입니다.',
};

interface ProvidersProps {
  children: React.ReactNode;
}

const layout = ({ children }: ProvidersProps) => {
  return <Box>{children}</Box>;
};

export default layout;
