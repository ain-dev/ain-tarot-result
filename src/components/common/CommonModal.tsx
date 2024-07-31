'use client';

import { useRouter } from 'next/navigation';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Text,
} from '@chakra-ui/react';
import textStyles from '@/configs/textStyles';

interface modalType {
  isOpen: boolean;
  onClose: () => void;
}

const CommonModal = ({ isOpen, onClose }: modalType) => {
  const router = useRouter();

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent maxW="660px" maxH="374px" p="60px">
        <ModalHeader
          p="0"
          mb="20px"
          style={textStyles.Bold_32}
          textAlign="center"
        >
          처음 화면으로 이동
        </ModalHeader>
        <ModalBody h="72px" p="0" mb="60px">
          <Text style={textStyles.Regular_24} textAlign="center">
            결과를 모두 확인하셨나요?
            <br />
            버튼을 누르면 처음 화면으로 돌아갑니다.
          </Text>
        </ModalBody>
        <ModalFooter p="0" justifyContent="center" gap="20px">
          <Button
            w="260px"
            h="54px"
            onClick={onClose}
            bg="#FFF"
            borderRadius="60px"
            border="2px solid #680BFF"
          >
            닫기
          </Button>
          <Button
            onClick={() => router.push('/')}
            w="260px"
            h="54px"
            bg="#680BFF"
            color="#FFF"
            borderRadius="60px"
          >
            처음으로
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CommonModal;
