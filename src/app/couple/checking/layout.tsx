import { Box } from '@chakra-ui/react';

interface ProvidersProps {
  children: React.ReactNode;
}

const layout = ({ children }: ProvidersProps) => {
  return <Box>{children}</Box>;
};

export default layout;
