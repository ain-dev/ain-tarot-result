import { Flex } from '@chakra-ui/react';

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
