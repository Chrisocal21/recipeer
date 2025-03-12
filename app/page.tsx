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
      <SimpleGrid columns={[3, 4]} spacing={4} px={[2, 4]}>
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
              h="100px"
              w="full"
              bg={bg}
              variant="unstyled"
              spacing={2}
              borderRadius="16px"
              boxShadow="0 1px 2px rgba(0, 0, 0, 0.04)"
              transition="all 0.2s"
              _hover={{
                transform: 'translateY(-1px)',
                boxShadow: '0 3px 6px rgba(0, 0, 0, 0.06)'
              }}
              _active={{
                transform: 'translateY(0)',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
              }}
            >
              <Icon as={icon} w={7} h={7} color={iconColor} />
              <Text 
                color="gray.700" 
                fontSize="13px"
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
