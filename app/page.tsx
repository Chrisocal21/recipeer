'use client';

import { Container, SimpleGrid, Button, Icon, VStack, Text } from '@chakra-ui/react';
import { StarIcon, EditIcon, CalendarIcon, CopyIcon, AddIcon } from '@chakra-ui/icons';
import { BsCameraFill } from 'react-icons/bs';
import Link from 'next/link';
import Title from '@/components/Title';

export default function Home() {
  return (
    <Container maxW="container.xl" py={8}>
      <Title mb={8} />
      <SimpleGrid 
        columns={2} 
        spacing={{ base: 4, md: 6 }}
        px={{ base: 2, md: 8 }}
        maxW="600px"
        mx="auto"
      >
        {[
          { href: '/favorites', icon: StarIcon, label: 'Favorites', bg: '#F8F9FA', iconColor: '#343A40' },
          { href: '/groceries', icon: EditIcon, label: 'Groceries', bg: '#F8F9FA', iconColor: '#343A40' },
          { href: '/meal-plan', icon: CalendarIcon, label: 'Meal Plan', bg: '#F8F9FA', iconColor: '#343A40' },
          { href: '/recipes', icon: CopyIcon, label: 'Recipes', bg: '#F8F9FA', iconColor: '#343A40' },
          { href: '/recipes/new', icon: AddIcon, label: 'Create', bg: '#F8F9FA', iconColor: '#343A40' },
          { href: '/scan', icon: BsCameraFill, label: 'Scan', bg: '#F8F9FA', iconColor: '#343A40' },
        ].map(({ href, icon, label, bg, iconColor }) => (
          <Link key={href} href={href} style={{ textDecoration: 'none' }}>
            <VStack
              as={Button}
              h={{ base: "120px", md: "140px" }}
              w="full"
              bg={bg}
              variant="unstyled"
              spacing={3}
              borderRadius="xl"
              boxShadow="0 1px 2px rgba(0, 0, 0, 0.04)"
              transition="all 0.2s"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.08)'
              }}
              _active={{
                transform: 'translateY(0)',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
              }}
            >
              <Icon as={icon} w={8} h={8} color={iconColor} />
              <Text 
                color="gray.700" 
                fontSize={{ base: "14px", md: "16px" }}
                fontWeight="medium"
              >
                {label}
              </Text>
            </VStack>
          </Link>
        ))}
      </SimpleGrid>
    </Container>
  );
}
