'use client';

import { Box, Container, Heading } from '@chakra-ui/react';

export default function NewRecipePage() {
  return (
    <Container maxW="container.xl" py={8}>
      <Box as="main" p={8} bg="white" shadow="md" rounded="lg">
        <Heading>Create New Recipe</Heading>
      </Box>
    </Container>
  );
}
