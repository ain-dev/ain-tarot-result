import { Flex } from '@chakra-ui/react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '타로 운세 결과',
  description: '키오스크에서 뽑은 타로 카드와 운세 결과입니다.',
};

interface ProvidersProps {
  children: React.ReactNode;
}

const layout = ({ children }: ProvidersProps) => {
  return (
    <Flex
      as="main"
      h="100vh"
      overflow="auto"
      justifyContent="center"
      alignItems="center"
    >
      {children}
    </Flex>
  );
};

export default layout;
