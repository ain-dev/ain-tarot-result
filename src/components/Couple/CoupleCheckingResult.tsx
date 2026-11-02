'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  CoupleResultError,
  getCoupleResult,
  isCoupleResultError,
} from '@/configs/axios/couple/couple.api';

import { CardDetailType } from '@/model/cards';
import { Box, Text, Flex, Spinner, Button } from '@chakra-ui/react';
import { hahmlet } from '@/generated/fonts/fonts';
import textStyles from '@/configs/textStyles';
import { breakAfterSentences } from '@/utils/textFormat';

interface CoupleCardProfile {
  cardId: number;
  cardName: string;
  contentsInfo: CardDetailType[];
  ttsUrl?: string;
}

interface CoupleResult {
  personA: CoupleCardProfile[];
  personB: CoupleCardProfile[];
  compat: string;
  tips: string;
  compatTtsUrl?: string;
}

// 모바일(QR 스캔)로 들어오는 커플궁합 결과 화면. 키오스크 화면(mind-tarot-frontend-master
// CoupleCheckingResult.tsx)과 동일한 데이터 구조를 그대로 쓰되, TTS는 autoplay 정책
// 이슈를 피하려고 네이티브 <audio controls>로 손님이 직접 재생하게 한다.
const CategoryBlock = ({
  categoryTitle,
  profiles,
}: {
  categoryTitle: string;
  profiles: CoupleCardProfile[];
}) => (
  <Box>
    <Text
      className={hahmlet.className}
      style={textStyles.Bold_18}
      color="#FFF"
      mb="10px"
    >
      {categoryTitle}
    </Text>
    <Flex flexDirection="column" gap="20px">
      {profiles.map((profile) => {
        const content =
          profile.contentsInfo?.find((c) => c.title === categoryTitle)
            ?.content ?? '';
        return (
          <Text
            key={profile.cardId}
            style={textStyles.Regular_16}
            color="#FFF"
            whiteSpace="pre-line"
          >
            {breakAfterSentences(content)}
          </Text>
        );
      })}
    </Flex>
  </Box>
);

// 418 polling: 2s → ×1.5 backoff capped at 10s, ~6 minutes in total.
const MAX_GENERATING_POLLS = 40;
const MAX_UNAVAILABLE_RETRIES = 3;

// TTS URLs are built from the backend's BACKEND_URL, which defaults to a
// kiosk-local address (http://localhost:8000). Such a URL cannot play on the
// customer's phone, so skip it instead of showing a broken player.
const UNREACHABLE_AUDIO_HOSTS = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  'backend',
];

const isPlayableAudioUrl = (url?: string): url is string => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    if (UNREACHABLE_AUDIO_HOSTS.includes(parsed.hostname)) return false;
    // An http: file on an https: page is blocked as mixed content.
    if (
      typeof window !== 'undefined' &&
      window.location.protocol === 'https:' &&
      parsed.protocol === 'http:'
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

const GENDER_STYLE = {
  male: {
    accent: '#8FCBFF',
    bg: 'rgba(78,144,255,0.12)',
    border: 'rgba(143,203,255,0.4)',
  },
  female: {
    accent: '#FFB1D8',
    bg: 'rgba(255,105,180,0.12)',
    border: 'rgba(255,177,216,0.4)',
  },
};

const PersonColumn = ({
  label,
  gender,
  profiles,
}: {
  label: string;
  gender: 'male' | 'female';
  profiles: CoupleCardProfile[];
}) => {
  const style = GENDER_STYLE[gender];
  const categoryTitles = profiles?.[0]?.contentsInfo?.map((c) => c.title) ?? [];
  return (
    <Flex
      flexDirection="column"
      gap="28px"
      w="100%"
      p="20px"
      borderRadius="20px"
      bg={style.bg}
      border="1px solid"
      borderColor={style.border}
    >
      <Box>
        <Text
          className={hahmlet.className}
          style={textStyles.Bold_20}
          color={style.accent}
        >
          {label}
        </Text>
        <Text
          className={hahmlet.className}
          style={textStyles.Regular_16}
          color="#D6BDFF"
          mt="4px"
        >
          {profiles?.map((p) => p.cardName).join(', ')}
        </Text>
      </Box>
      {categoryTitles.map((categoryTitle) => (
        <CategoryBlock
          key={categoryTitle}
          categoryTitle={categoryTitle}
          profiles={profiles}
        />
      ))}
    </Flex>
  );
};

const CoupleCheckingResult = () => {
  const params = useParams();
  const taskId = params.id as string;
  const [audioFailed, setAudioFailed] = useState(false);

  const {
    data: resultData,
    error,
    failureReason,
    isFetching,
    isError,
    refetch,
  } = useQuery<CoupleResult, CoupleResultError>({
    queryKey: ['coupleResult', taskId],
    queryFn: () => getCoupleResult(taskId),
    retry: (failureCount, err) => {
      if (err.kind === 'notFound') return false; // unknown id or expired
      if (err.kind === 'generating') return failureCount < MAX_GENERATING_POLLS;
      return failureCount < MAX_UNAVAILABLE_RETRIES;
    },
    retryDelay: (attemptIndex, err) =>
      isCoupleResultError(err) && err.kind === 'generating'
        ? Math.min(2000 * 1.5 ** attemptIndex, 10000)
        : Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // While TanStack Query is retrying, the latest error is exposed as
  // `failureReason` (not `error`), so use it to tell "still generating" apart.
  const lastError = error ?? failureReason;
  const isGenerating =
    !resultData &&
    isCoupleResultError(lastError) &&
    lastError.kind === 'generating';
  const isNotFound =
    isError && isCoupleResultError(error) && error.kind === 'notFound';
  // No HTTP response at all (network/CORS failure, e.g. a backend 500 without
  // CORS headers for an unknown id) after the retry cap: most likely the id is
  // unknown or expired, so show that guidance, but still offer a retry.
  const isUnreachable =
    isError &&
    isCoupleResultError(error) &&
    error.kind === 'unavailable' &&
    error.status === undefined;
  const hasResultFailed =
    !isFetching && !resultData && !isNotFound && !isUnreachable;

  return (
    <Flex
      w="100%"
      minH="100vh"
      flexDirection="column"
      alignItems="center"
      px="20px"
      py="40px"
    >
      <Text
        as="p"
        className={hahmlet.className}
        style={textStyles.Bold_24}
        mb="24px"
        color="#FFF"
        textAlign="center"
      >
        커플궁합 결과입니다.
      </Text>

      {isFetching && (
        <Flex
          flexDirection="column"
          alignItems="center"
          gap="8px"
          mt="40px"
          textAlign="center"
        >
          <Flex alignItems="center" gap="8px">
            <Spinner size="md" />
            <Text color="#FFF">
              {isGenerating
                ? '결과를 만들고 있습니다...'
                : '결과를 불러오는 중입니다...'}
            </Text>
          </Flex>
          {isGenerating && (
            <Text color="#D6BDFF" style={textStyles.Regular_16}>
              잠시만 기다려 주세요. 준비되면 자동으로 표시됩니다.
            </Text>
          )}
        </Flex>
      )}

      {!isFetching && (isNotFound || isUnreachable) && (
        <Flex
          flexDirection="column"
          alignItems="center"
          gap="8px"
          mt="40px"
          textAlign="center"
        >
          <Text color="#FFF" style={textStyles.Bold_18}>
            결과를 찾을 수 없습니다.
          </Text>
          <Text
            color="#D6BDFF"
            style={textStyles.Regular_16}
            whiteSpace="pre-line"
          >
            결과는 생성 후 3일 동안만 볼 수 있어요.
            {'\n'}QR 코드를 다시 확인해 주세요.
          </Text>
          {isUnreachable && (
            <Button
              mt="8px"
              onClick={() => refetch()}
              borderRadius="100px"
              bg="#D0BCFF"
            >
              <Text color="#381E72">다시 시도</Text>
            </Button>
          )}
        </Flex>
      )}

      {hasResultFailed && (
        <Flex
          flexDirection="column"
          alignItems="center"
          gap="12px"
          mt="40px"
          textAlign="center"
        >
          <Text color="#FFF" style={textStyles.Regular_16}>
            {isGenerating
              ? '결과 준비가 평소보다 오래 걸리고 있습니다.'
              : '결과를 불러오지 못했습니다.'}
          </Text>
          <Button onClick={() => refetch()} borderRadius="100px" bg="#D0BCFF">
            <Text color="#381E72">다시 시도</Text>
          </Button>
        </Flex>
      )}

      {!isFetching && resultData && (
        <Flex flexDirection="column" gap="28px" w="100%" maxW="520px">
          <PersonColumn
            label="남자"
            gender="male"
            profiles={resultData.personA}
          />
          <PersonColumn
            label="여자"
            gender="female"
            profiles={resultData.personB}
          />

          <Box>
            <Text
              className={hahmlet.className}
              style={textStyles.Bold_20}
              color="#F6E6B4"
              mb="10px"
            >
              두 분의 궁합 총평
            </Text>
            <Text
              style={textStyles.Regular_16}
              color="#FFF"
              whiteSpace="pre-line"
            >
              {breakAfterSentences(resultData.compat)}
            </Text>
            {resultData.tips && (
              <Box
                mt="20px"
                p="16px"
                borderRadius="16px"
                bg="rgba(214,189,255,0.14)"
                border="1px solid rgba(214,189,255,0.4)"
              >
                <Text
                  className={hahmlet.className}
                  style={textStyles.Bold_18}
                  color="#D6BDFF"
                  mb="8px"
                >
                  💡 실전 대화법 팁
                </Text>
                <Text
                  style={textStyles.Regular_16}
                  color="#FFF"
                  whiteSpace="pre-line"
                >
                  {breakAfterSentences(resultData.tips)}
                </Text>
              </Box>
            )}
            {isPlayableAudioUrl(resultData.compatTtsUrl) && !audioFailed && (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <audio
                controls
                preload="metadata"
                src={resultData.compatTtsUrl}
                onError={() => setAudioFailed(true)}
                style={{ width: '100%', marginTop: '16px' }}
              />
            )}
          </Box>
        </Flex>
      )}
    </Flex>
  );
};

export default CoupleCheckingResult;
