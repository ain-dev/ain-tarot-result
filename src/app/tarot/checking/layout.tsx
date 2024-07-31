import { Box } from '@chakra-ui/react';

interface ProvidersProps {
  children: React.ReactNode;
}

const layout = ({ children }: ProvidersProps) => {
  return (
    <Box w={{ base: '550px', sm: '100%' }} h={{ base: '100vh', sm: '100%' }}>
      {children}
    </Box>
  );
};

export default layout;
