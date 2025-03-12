'use client';

import { Container, VStack } from '@chakra-ui/react';
import Title from '@/components/Title';
import NotebookPaper from '@/components/NotebookPaper';

export default function GroceriesPage() {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Title subtitle="Shopping List" />
        <NotebookPaper />
      </VStack>
    </Container>
  );
}
