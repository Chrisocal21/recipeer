'use client';

import { Heading, HeadingProps, VStack, Text } from '@chakra-ui/react';

interface TitleProps extends HeadingProps {
  subtitle?: string;
}

export default function Title({ subtitle, ...props }: TitleProps) {
  return (
    <VStack spacing={2} mb={6}>
      <Heading
        fontSize={["24px", "28px", "32px"]}
        textAlign="center"
        fontWeight="bold"
        color="white"
        {...props}
      >
        <Text as="span" letterSpacing="0.15em">C O O K </Text>
        <Text as="span" fontStyle="italic" letterSpacing="0.1em">BASE</Text>
      </Heading>
      {subtitle && (
        <Heading
          as="h2"
          fontSize={["18px", "20px", "24px"]}
          color="gray.400"
          fontWeight="medium"
        >
          {subtitle}
        </Heading>
      )}
    </VStack>
  );
}
