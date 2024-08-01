'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getCards } from '@/configs/axios/tarot/tarot.api';
import { IsMobileDevice } from '@/utils/IsMobileDevice';
import useTarotStore from '@/app/store/tarotUserInfo';

import TarotFlipCard from '@/components/Tarot/Checking/TarotFlipCard';
import Lottie from 'react-lottie-player';

import { CardType } from '@/model/cards';
import { Box, Text, Flex, Button, Spinner } from '@chakra-ui/react';
import { hahmlet } from '@/generated/fonts/fonts';
import textStyles from '@/configs/textStyles';

import petAnimationData from '@/public/assets//pet_card_back_image.json';
import animationData from '@/public/assets/card_back_image.json';

const TarotCheckingCards = () => {
  const [isDescription, setIsDescription] = useState(false);
  const [pickupCards, setPickupCards] = useState(0);
  const [flipCount, setFlipCount] = useState(0);

  const { postCardList, category } = useTarotStore();
  const isMobile = IsMobileDevice('(max-width: 500px)');
  const params = useParams();
  const taskId = params.id as string;

  const { data: cardsData, isFetching } = useQuery({
    queryKey: ['tarotCards'],
    queryFn: () => getCards(taskId),
    retry: 6,
  });

  const cardList = isFetching ? postCardList : cardsData?.cardList;

  const handleClick = () => {
    setIsDescription(!isDescription);
  };

  const handleClickCardList = () => {
    setPickupCards(pickupCards + 1);
  };

  return (
    <Flex w="100%" h="100vh" flexDirection="column" alignItems="center">
      <Text
        as="p"
        className={hahmlet.className}
        style={textStyles.Bold_18}
        mt="40px"
        mb="40px"
        color="#FFF"
      >
        {isDescription
          ? '당신의 타로 운세 결과입니다.'
          : '고민에 집중해서 3장의 카드를 선택해 주세요.'}
      </Text>

      <Flex
        as="figure"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        mb="40px"
      >
        {!isDescription && (
          <Lottie
            animationData={
              category === '펫 마음' ? petAnimationData : animationData
            }
            style={{ width: '360px', height: '130px' }}
            play
            loop={false}
            speed={2}
            onClick={handleClickCardList}
          />
        )}
        <Flex
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          gap="40px"
        >
          {cardList.slice(0, pickupCards)?.map((card: CardType) => (
            <Box key={card.id}>
              <TarotFlipCard
                imageSrc={card.src}
                setFlipCount={setFlipCount}
                isDescription={isDescription}
                isMobile={isMobile}
              />
            </Box>
          ))}
        </Flex>
      </Flex>

      {pickupCards >= 3 && flipCount < 3 && (
        <Button
          w="160px"
          h="37px"
          borderRadius="100px"
          isDisabled={flipCount < 3}
        >
          카드를 뒤집어서 확인
        </Button>
      )}

      {flipCount >= 3 && !isDescription && (
        <Button
          w="276px"
          h="48px"
          borderRadius="100px"
          bg={isFetching ? '#353336' : '#D0BCFF'}
          onClick={handleClick}
        >
          {isFetching ? (
            <>
              <Spinner size="md" mr="8px" />
              <Text color="#787579">로딩중</Text>
            </>
          ) : (
            <Text color="#381E72">설명 보기</Text>
          )}
        </Button>
      )}

      {isDescription && (
        <Box w="70%" px="16px">
          <Flex flexDirection="column" alignItems="center">
            <Flex flexDirection="column" gap="32px" mb="40px">
              <Box>
                <Text
                  className={hahmlet.className}
                  style={textStyles.Bold_16}
                  color="#FFF"
                  mb="16px"
                >
                  {cardsData.title}
                </Text>
                <Text
                  style={textStyles.Regular_16}
                  whiteSpace="pre-line"
                  color="#FFF"
                >
                  {cardsData.cardDescription}
                </Text>
              </Box>
            </Flex>
          </Flex>
        </Box>
      )}
    </Flex>
  );
};

export default TarotCheckingCards;
