'use client';

import { useState, type JSX } from 'react';
import { useParams } from 'next/navigation';
import { decodeRouteParam } from '@/utils/routeParam';
import { getCards } from '@/configs/axios/saju/saju.api';
import { useResultQuery } from '@/utils/useResultQuery';
import { IsMobileDevice } from '@/utils/IsMobileDevice';
import useSajuStore from '@/app/store/sajuUserInfo';

import SajuFlipCard from '@/components/Saju/SajuFlipCard';
import ResultErrorState, {
  NETWORK_ERROR_GUIDE,
} from '@/components/common/ResultErrorState';

import { CardType, CardDetailType, SajuResult } from '@/model/cards';
import { Box, Text, Flex, Button, Spinner } from '@chakra-ui/react';
import { hahmlet } from '@/generated/fonts/fonts';
import { CareerIcon, MoneyIcon, HealthyIcon } from '@/generated/CustomIcon';
import { SAJU_RESULT_ENDING } from '@/constants';
import textStyles from '@/configs/textStyles';

const SajuCheckingCards = () => {
  const [isDescription, setIsDescription] = useState(false);

  const { postCardList } = useSajuStore();
  const isMobile = IsMobileDevice('(max-width: 550px)');
  const params = useParams();

  const taskId = decodeRouteParam(params.id);

  const {
    data: cardsData,
    isFetching,
    isGenerating,
    errorState,
    refetch,
  } = useResultQuery<SajuResult>(['sajuCards', taskId], () => getCards(taskId));
  const hasError = errorState !== null;

  const cardList = isFetching ? postCardList : cardsData?.cardList;
  const cardContentsInfo = cardsData?.contentsInfo;

  const iconMapping: { [key: string]: JSX.Element } = {
    '어울리는 직업': <CareerIcon isMobile={isMobile} />,
    금전운: <MoneyIcon isMobile={isMobile} />,
    건강운: <HealthyIcon isMobile={isMobile} />,
  };

  const handleClick = () => {
    if (!isFetching && cardsData) setIsDescription(!isDescription);
  };

  return (
    <Flex w="100%" h="100vh" flexDirection="column" alignItems="center">
      <Text
        as="p"
        className={hahmlet.className}
        style={textStyles.Bold_24}
        my="40px"
        color="#FFF"
      >
        당신의 탄생카드입니다.
      </Text>

      <Flex
        as="figure"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        gap="24px"
        mb="40px"
      >
        {cardList?.map((card: CardType) => (
          <Box key={card.id}>
            <SajuFlipCard
              imageSrc={card.src}
              isMobile={isMobile}
              isDescription={isDescription}
            />
          </Box>
        ))}
      </Flex>

      {hasError && (
        <ResultErrorState
          variant={errorState === 'unreachable' ? 'failed' : errorState}
          description={
            errorState === 'unreachable' ? NETWORK_ERROR_GUIDE : undefined
          }
          onRetry={errorState === 'notFound' ? undefined : () => refetch()}
        />
      )}

      {!isDescription && !hasError && (
        <Button
          w="276px"
          h="48px"
          onClick={handleClick}
          borderRadius="100px"
          bg={isFetching ? '#353336' : '#D0BCFF'}
        >
          {isFetching ? (
            <>
              <Spinner size="md" mr="8px" color="#E6E0E9" />
              <Text color="#CAC4D0">로딩중</Text>
            </>
          ) : (
            <Text color="#381E72">설명보기</Text>
          )}
        </Button>
      )}

      {isFetching && isGenerating && (
        <Text
          color="#D6BDFF"
          style={textStyles.Regular_16}
          textAlign="center"
          mt="16px"
        >
          결과를 만들고 있습니다... 잠시만 기다려 주세요.
        </Text>
      )}

      {isDescription && (
        <Box w="70%">
          <Flex flexDirection="column" alignItems="center">
            <Flex flexDirection="column" gap="20px" mb="80px">
              {cardContentsInfo?.map(
                (contentInfo: CardDetailType, idx: number) => (
                  <Box key={idx}>
                    <Flex gap="8px">
                      {iconMapping[contentInfo.title]}
                      <Text
                        className={hahmlet.className}
                        style={textStyles.Bold_16}
                        color="#FFF"
                        mb="16px"
                      >
                        {contentInfo.title}
                      </Text>
                    </Flex>
                    <Text
                      style={textStyles.Regular_16}
                      color="#FFF"
                      whiteSpace="pre-line"
                    >
                      {contentInfo.content}
                    </Text>
                  </Box>
                ),
              )}

              <Box>
                <Text
                  className={hahmlet.className}
                  style={textStyles.Bold_16}
                  color="#D6BDFF"
                  mb="16px"
                >
                  카드 해석을 마치며...
                </Text>
                <Text
                  style={textStyles.Regular_16}
                  color="#FFF"
                  whiteSpace="pre-line"
                >
                  {SAJU_RESULT_ENDING.endingContent}
                </Text>
              </Box>
            </Flex>
          </Flex>
        </Box>
      )}
    </Flex>
  );
};

export default SajuCheckingCards;
