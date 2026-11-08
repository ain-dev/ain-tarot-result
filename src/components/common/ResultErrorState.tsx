import { Button, Flex, Text } from '@chakra-ui/react';
import textStyles from '@/configs/textStyles';

export type ResultErrorVariant = 'notFound' | 'failed' | 'delayed';

const TITLES: Record<ResultErrorVariant, string> = {
  notFound: '결과를 찾을 수 없습니다.',
  failed: '결과를 불러오지 못했습니다.',
  delayed: '결과 준비가 평소보다 오래 걸리고 있습니다.',
};

// Results are kept for 3 days (backend `expire_at`); expired ids answer 404.
const NOT_FOUND_GUIDE =
  '결과는 생성 후 3일 동안만 볼 수 있어요.\nQR 코드를 다시 확인해 주세요.';

export const NETWORK_ERROR_GUIDE =
  '인터넷 연결을 확인한 뒤 다시 시도해 주세요.';

/**
 * Not-found / load-error block shared by the tarot, saju and couple result
 * pages. Shows a retry button only when `onRetry` is given.
 */
const ResultErrorState = ({
  variant,
  description,
  onRetry,
}: {
  variant: ResultErrorVariant;
  description?: string;
  onRetry?: () => void;
}) => {
  const guide = description ?? (variant === 'notFound' ? NOT_FOUND_GUIDE : '');
  return (
    <Flex
      role="alert"
      flexDirection="column"
      alignItems="center"
      gap="8px"
      mt="40px"
      px="20px"
      textAlign="center"
    >
      <Text color="#FFF" style={textStyles.Bold_18}>
        {TITLES[variant]}
      </Text>
      {guide && (
        <Text
          color="#D6BDFF"
          style={textStyles.Regular_16}
          whiteSpace="pre-line"
        >
          {guide}
        </Text>
      )}
      {onRetry && (
        <Button mt="8px" onClick={onRetry} borderRadius="100px" bg="#D0BCFF">
          <Text color="#381E72">다시 시도</Text>
        </Button>
      )}
    </Flex>
  );
};

export default ResultErrorState;
