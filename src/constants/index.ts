import { keyframes } from '@chakra-ui/react';

export const selectiongFortuneCard = [
  {
    cardId: 1,
    title: '서양 사주',
    image: '/images/selected_saju_image.png',
    content1: '당신의 생년월일을 입력하면,',
    content2: '운명을 상징하는 타로카드를 보여드립니다.',
    description: ['직업운', '학업운', '금전운', '연애운', '건강운'],
    price: '9,000',
  },
  {
    cardId: 2,
    title: '타로 운세',
    image: '/images/selected_tarot_image.png',
    content1: '고민이 있으시다면 타로카드의 지혜로 답을 찾아보세요.',
    content2: '더 나은 미래를 위한 방향을 제시해 드립니다.',
    description: ['직업운', '학업운', '금전운', '연애운', '건강운'],
    price: '4,000',
  },
];

export const AGE_GROUP = [
  '19세 이하',
  '20대',
  '30대',
  '40대',
  '50대',
  '60세 이상',
];

export const TAROT_CATEGORIES = [
  {
    category: '오늘의 운세',
    categoryImage: '/images/tarot_category_image_01.png',
  },
  {
    category: '사랑',
    categoryImage: '/images/tarot_category_image_02.png',
  },
  {
    category: '상대의 속마음',
    categoryImage: '/images/tarot_category_image_03.png',
  },
  {
    category: '재회 가능성',
    categoryImage: '/images/tarot_category_image_04.png',
  },
  {
    category: '직장',
    categoryImage: '/images/tarot_category_image_05.png',
  },
  {
    category: '학교 생활',
    categoryImage: '/images/tarot_category_image_06.png',
  },
  {
    category: '금전',
    categoryImage: '/images/tarot_category_image_07.png',
  },
  {
    category: '펫 마음',
    categoryImage: '/images/tarot_category_image_08.png',
  },
];

export const LOVE_CATEGORY = [
  {
    detailCategory: '싱글',
  },
  {
    detailCategory: '커플',
  },
];

export const MIND_CATEGORY = [
  {
    detailCategory: '애정',
  },
  {
    detailCategory: '지인',
  },
  {
    detailCategory: '직장',
  },
];

export const MODAL_CONTENTS =
  ' 음성이 인식되지 않았어요.\n버튼을 누르고 5초 이내로 크게 말해주세요.';

export const GRADIENT_SPREAD = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
`;

export const ROTATE_ANIMATION = keyframes`
0% {
transform: rotate(0deg);
}
100% {
  transform: rotate(360deg)
}
`;

export const hasIconTitle = ['어울리는 직업', '금전운', '건강운'];

export const SAJU_RESULT_ENDING = {
  title: '카드 해석을 마치며...',
  endingContent: `탄생 카드는 태어날 때부터 가지고 있는 기질과 성향을 보여주는 나침반입니다.
    카드가 1장, 2장 혹은 3장이 나온 분들도 계실 텐데요.
    카드 개수 보다는 각각의 카드가 가지고 있는 의미와 상징을 이해하고, 나의 삶에 어떻게 적용할 수 있는지 고민해 보는 것이 중요합니다.
    
    평소에 감정의 기복을 자주 느낀다면 기질이 완전히 다른 카드들을 가지고 있어 그럴 수 있습니다.
    상황에 맞는 카드를 자연스럽게 꺼낼 수 있도록 훈련하면 내면의 균형을 유지하고 스스로를 더 잘 다스릴 수 있게 될 거예요.`,
};

export const RESULT_PAGE_LIMIT_TIME = 1000 * 60 * 6;
