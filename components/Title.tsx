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
        color="#4A4A4A"
        {...props}
      >
        <Text as="span" letterSpacing="0.15em">R E C I P E E R</Text>
      </Heading>
      {subtitle && (
        <Heading
          as="h2"
          fontSize={["18px", "20px", "24px"]}
          color="gray.500"
          fontWeight="medium"
        >
          {subtitle}
        </Heading>
      )}
    </VStack>
  );
}
