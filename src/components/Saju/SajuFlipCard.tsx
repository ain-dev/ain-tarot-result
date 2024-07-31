import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

import Image from 'next/image';

interface FlipCardProps {
  imageSrc: string;
  isDescription: boolean;
  isMobile: boolean;
}

const SajuFlipCard = ({ imageSrc, isMobile }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const imageSize = isMobile
    ? { width: 74, height: 128 }
    : { width: 294, height: 508 };

  const handleClick = () => setIsFlipped(!isFlipped);

  return (
    <Box position="relative" onClick={handleClick}>
      <motion.div
        style={{
          width: imageSize.width,
          height: imageSize.height,
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
            src={'/images/card_back_image_md.png'}
            alt={'card_back_image'}
            width={imageSize.width}
            height={imageSize.height}
            priority
            style={{
              width: imageSize.width,
              height: imageSize.height,
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
            width={imageSize.width}
            height={imageSize.height}
            priority
            style={{
              width: imageSize.width,
              height: imageSize.height,
            }}
          />
        </Box>
      </motion.div>
    </Box>
  );
};

export default SajuFlipCard;
