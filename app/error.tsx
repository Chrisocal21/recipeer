'use client';

import { Box, Button, Container, Heading, Text } from '@chakra-ui/react';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <Container>
      <Box p={8} textAlign="center">
        <Heading mb={4}>Something went wrong</Heading>
        <Text mb={4}>{error.message}</Text>
        <Button onClick={reset}>Try again</Button>
      </Box>
    </Container>
  );
}
