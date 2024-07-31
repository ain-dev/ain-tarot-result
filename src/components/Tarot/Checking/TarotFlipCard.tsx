import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

import Image from 'next/image';
import useTarotStore from '@/app/store/tarotUserInfo';

interface FlipCardProps {
  imageSrc: string;
  setFlipCount: React.Dispatch<React.SetStateAction<number>>;
  isDescription: boolean;
  isMobile: boolean;
}

const TarotFlipCard = ({
  imageSrc,
  setFlipCount,
  isDescription,
  isMobile,
}: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { category } = useTarotStore();

  const imageSize = isDescription
    ? { width: 294, height: 508 }
    : { width: 147, height: 254 };

  const handleClick = () => {
    setIsFlipped(!isFlipped);
    setFlipCount((prev: number) => prev + 1);
  };

  return (
    <Box position="relative" onClick={handleClick}>
      <motion.div
        style={{
          width: isMobile ? 74 : imageSize.width,
          height: isMobile ? 128 : imageSize.height,
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.6s',
        }}
      >
        {/* Back-Image */}
        <Box
          position="absolute"
          sx={{ backfaceVisibility: 'hidden' }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="transparent"
        >
          <Image
            src={
              category === '펫 마음'
                ? '/images/pet_card_back_image_md.png'
                : '/images/card_back_image_md.png'
            }
            alt={'card_back_image'}
            width={isMobile ? 74 : imageSize.width}
            height={isMobile ? 128 : imageSize.height}
            priority
            style={{
              width: isMobile ? 74 : imageSize.width,
              height: isMobile ? 128 : imageSize.height,
            }}
          />
        </Box>

        {/* Front-Image */}
        <Box
          position="absolute"
          sx={{ backfaceVisibility: 'hidden' }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          transform="rotateY(180deg)"
          boxShadow="0px 0px 20px 0px #0E0116"
        >
          <Image
            src={imageSrc}
            alt={'card_front_image'}
            width={isMobile ? 74 : imageSize.width}
            height={isMobile ? 128 : imageSize.height}
            priority
            style={{
              width: isMobile ? 74 : imageSize.width,
              height: isMobile ? 128 : imageSize.height,
            }}
          />
        </Box>
      </motion.div>
    </Box>
  );
};

export default TarotFlipCard;
