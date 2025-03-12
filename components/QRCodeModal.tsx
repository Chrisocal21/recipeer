'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  VStack,
  Button,
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import QRCodeDisplay from './QRCodeDisplay';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: string;
}

export default function QRCodeModal({ isOpen, onClose, title, data }: QRCodeModalProps) {
  const handleDownload = async () => {
    const qrUrl = await generateQRCode(data);
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="gray.800">
        <ModalHeader color="white">{title}</ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody>
          <VStack spacing={4} pb={6} align="center">
            <QRCodeDisplay data={data} size={250} />
            <Text color="gray.400" fontSize="sm">Scan with the Recipeer app</Text>
            <Button
              leftIcon={<DownloadIcon />}
              onClick={handleDownload}
              colorScheme="teal"
              size="sm"
            >
              Download QR Code
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
async function generateQRCode(data: string): Promise<string> {
    const canvas = document.createElement('canvas');
    const QRCode = (await import('qrcode')).default;
    await QRCode.toCanvas(canvas, data);
    return canvas.toDataURL('image/png');
}

