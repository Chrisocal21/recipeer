'use client';

import { Container, VStack } from '@chakra-ui/react';
import Title from '@/components/Title';

export default function ScanPage() {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Title subtitle="QR Scanner" />
      </VStack>
    </Container>
  );
}
