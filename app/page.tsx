'use client';

import { Container, SimpleGrid, Heading, Button, Icon, VStack, Text } from '@chakra-ui/react';
import { StarIcon, ViewIcon, CalendarIcon, SearchIcon, AddIcon, PhoneIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import Title from '@/components/Title';

export default function Home() {
  return (
    <Container maxW="container.xl" py={8}>
      <Title mb={8} />
      <SimpleGrid columns={[2, 3]} spacing={6}>
        {[
          { href: '/favorites', icon: StarIcon, label: 'Favorites', bgColor: 'yellow.400' },
          { href: '/groceries', icon: ViewIcon, label: 'Groceries', bgColor: 'green.400' },
          { href: '/meal-plan', icon: CalendarIcon, label: 'Meal Plan', bgColor: 'blue.400' },
          { href: '/recipes', icon: SearchIcon, label: 'Recipes', bgColor: 'purple.400' },
          { href: '/recipes/new', icon: AddIcon, label: 'Create', bgColor: 'orange.400' },
          { href: '/scan', icon: PhoneIcon, label: 'Scan', bgColor: 'red.400' },
        ].map(({ href, icon, label, bgColor }) => (
          <Link key={href} href={href} style={{ textDecoration: 'none' }}>
            <VStack
              as={Button}
              h="120px"
              w="full"
              bg={bgColor}
              variant="unstyled"
              spacing={3}
              borderRadius="2xl"
              boxShadow={`
                0 2px 0 0 ${bgColor},
                0 4px 6px -1px rgba(0, 0, 0, 0.1),
                0 2px 4px -1px rgba(0, 0, 0, 0.06),
                inset 0 1px 0 0 rgba(255, 255, 255, 0.2)
              `}
              transition="all 0.2s"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: `
                  0 4px 0 0 ${bgColor},
                  0 8px 8px -4px rgba(0, 0, 0, 0.1),
                  0 4px 6px -2px rgba(0, 0, 0, 0.05),
                  inset 0 1px 0 0 rgba(255, 255, 255, 0.2)
                `
              }}
              _active={{
                transform: 'translateY(0)',
                boxShadow: `
                  0 1px 0 0 ${bgColor},
                  0 2px 4px -1px rgba(0, 0, 0, 0.1),
                  0 1px 2px -1px rgba(0, 0, 0, 0.06),
                  inset 0 1px 0 0 rgba(255, 255, 255, 0.2)
                `
              }}
            >
              <Icon as={icon} w={8} h={8} color="white" />
              <Text color="white" fontWeight="semibold">{label}</Text>
            </VStack>
          </Link>
        ))}
      </SimpleGrid>
    </Container>
  );
}
