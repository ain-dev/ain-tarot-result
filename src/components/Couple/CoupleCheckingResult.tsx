'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getCoupleResult } from '@/configs/axios/couple/couple.api';

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

  const {
    data: resultData,
    isFetching,
    isError,
    refetch,
  } = useQuery<CoupleResult>({
    queryKey: ['coupleResult', taskId],
    queryFn: () => getCoupleResult(taskId),
    retry: 8,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
  const hasResultFailed = isError || (!isFetching && !resultData);

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
        <Flex alignItems="center" gap="8px" mt="40px">
          <Spinner size="md" />
          <Text color="#FFF">결과를 불러오는 중입니다...</Text>
        </Flex>
      )}

      {!isFetching && hasResultFailed && (
        <Button
          mt="40px"
          onClick={() => refetch()}
          borderRadius="100px"
          bg="#D0BCFF"
        >
          <Text color="#381E72">다시 시도</Text>
        </Button>
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
            {resultData.compatTtsUrl && (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <audio
                controls
                src={resultData.compatTtsUrl}
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
