import { Flex } from '@chakra-ui/react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '서양 사주 결과',
  description: '생년월일로 찾은 탄생카드와 운세 결과입니다.',
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
