'use client';

import { Container, Spinner, Center } from '@chakra-ui/react';

export default function Loading() {
  return (
    <Container>
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    </Container>
  );
}
