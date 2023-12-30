import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FaPlus, FaTrash } from 'react-icons/fa';

// Import data from the JSON file
import foodData from '../data/foodData.json';

const aminoAcidsNames = [
  'Tryptophan',
  'Threonine',
  'Isoleucine',
  'Leucine',
  'Lysine',
  'Methionine',
  'Phenylalanine',
  'Tyrosine',
  'Valine',
  'Arginine',
  'Histidine',
  'Alanine',
  'Aspartic acid',
  'Glutamic acid',
  'Glycine',
  'Proline',
  'Serine',
  'Hydroxyproline',
  'Cysteine'
];

const Index = () => {
  const [foods, setFoods] = useState([]);
  // ... rest of the component code

  useEffect(() => {
    // When the component mounts, transform the imported data to the new structure
    const transformedFoods = foodData.map(item => ({
      description: item.name,
      fdcId: Math.random().toString(36).substr(2, 9),
      foodNutrients: item.foodNutrients.map((nutrient) => {
        if (aminoAcidsNames.includes(nutrient.name) && nutrient.unitName === 'g') {
          return { name: nutrient.name, amount: nutrient.amount, unitName: 'g' };
        }
        return null;
      }).filter(nutrient => nutrient !== null)
    }));
    setFoods(transformedFoods);
  }, []);

  
  const [foodName, setFoodName] = useState('');
  const [aminoAcidProfile, setAminoAcidProfile] = useState('');

  const handleAddFood = () => {
  if (foodName && aminoAcidProfile) {
    const nutrients = aminoAcidProfile.split(',').map((amino, index) => {
  const [name, amountStr] = amino.trim().split(':');
  const amount = parseFloat(amountStr.trim());
  return aminoAcidsNames.includes(name) ? { name, amount, unitName: 'g' } : null;
}).filter(nutrient => nutrient !== null);

    setFoods([
      ...foods,
      { description: foodName, fdcId: Math.random().toString(36).substr(2, 9), foodNutrients: nutrients },
    ]);
    setFoodName('');
    setAminoAcidProfile('');
  }
};

  const handleRemoveFood = (index) => {
    setFoods(foods.filter((_, i) => i !== index));
  };

  const combinedProfile = foods.reduce(
    (acc, food) => food.profile.map((amt, index) => (acc[index] || 0) + amt),
    []
  );

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6}>
        <Heading>Amino Acid Profile for Meal</Heading>
        <FormControl>
          <FormLabel>Food Name</FormLabel>
          <Input
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Amino Acid Profile (comma-separated values)</FormLabel>
          <Input
            value={aminoAcidProfile}
            onChange={(e) => setAminoAcidProfile(e.target.value)}
          />
        </FormControl>
        <Button
          leftIcon={<FaPlus />}
          colorScheme="teal"
          onClick={handleAddFood}
        >
          Add Food
        </Button>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Food Name</Th>
              <Th>Amino Acid Profile</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {foods.map((food, index) => (
              <Tr key={index}>
                <Td>{food.description}</Td>
                <Td>{food.foodNutrients.map(nutrient => `${nutrient.name}: ${nutrient.amount} ${nutrient.unitName}`).join(', ')}</Td>
                <Td>
                  <Button
                    leftIcon={<FaTrash />}
                    colorScheme="red"
                    onClick={() => handleRemoveFood(index)}
                  >
                    Remove
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {foods.length > 0 && (
          <Flex width="full" justify="center" p={4}>
            <Stack>
              <Text fontSize="xl" fontWeight="bold">
                Combined Amino Acid Profile
              </Text>
              <Box borderWidth="1px" borderRadius="lg" p={4}>
                {combinedProfile.join(', ')}
              </Box>
            </Stack>
          </Flex>
        )}
      </VStack>
    </Container>
  );
};

export default Index;
