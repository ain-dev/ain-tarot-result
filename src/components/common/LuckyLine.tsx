'use client';

import { Box, Text } from '@chakra-ui/react';
import textStyles from '@/configs/textStyles';
import { hahmlet } from '@/generated/fonts/fonts';

interface ILuckyLineProps {
  place?: string | null;
  number?: string | null;
}

const GOLD = '#F6E6B4';
const GOLD_SOFT = 'rgba(246,230,180,0.7)';

const Row = ({ label, value }: { label: string; value: string }) => (
  <Text
    color={GOLD}
    fontSize="20px"
    fontWeight="700"
    lineHeight="30px"
    wordBreak="keep-all"
  >
    <Text as="span" fontSize="15px" color={GOLD_SOFT} mr="8px">
      {label}
    </Text>
    {value}
  </Text>
);

// Gold card under every result: lucky place and lucky number (same design as the
// kiosk, stacked for phone width). Hidden when either value is missing (the result
// server does not send them yet, or the result predates the feature).
const LuckyLine = ({ place, number }: ILuckyLineProps) => {
  if (!place || !number) return null;

  return (
    <Box
      data-testid="lucky-line"
      className={hahmlet.className}
      mt="24px"
      mb="40px"
      mx="auto"
      w="100%"
      maxW="520px"
      px="20px"
      pt="16px"
      pb="18px"
      borderRadius="20px"
      textAlign="center"
      bg="linear-gradient(180deg, rgba(246,230,180,0.12), rgba(246,230,180,0.04))"
      border="1.5px solid rgba(246,230,180,0.6)"
      boxShadow="0 0 20px rgba(246,230,180,0.15)"
    >
      <Text
        style={textStyles.Bold_16}
        color="#D6BDFF"
        letterSpacing="2px"
        mb="8px"
      >
        🍀 당신의 행운
      </Text>
      {/* Short labels: the result column is narrow on a phone and the title
          already says what these are, so the place name stays on one line */}
      <Row label="장소" value={place} />
      <Row label="숫자" value={number} />
    </Box>
  );
};

export default LuckyLine;
