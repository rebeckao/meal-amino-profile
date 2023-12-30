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

// Mock function to simulate fetching data from an external API
const fetchFoodsFromAPI = () => {
  return new Promise((resolve) => {
    // Simulate network request by delaying the resolution of the promise
    setTimeout(() => {
      // Static data to simulate API response
      const mockAPIData = [
        { name: 'Apple', profile: [5, 15, 20] },
        { name: 'Banana', profile: [4, 25, 10] },
      ];
      resolve(mockAPIData);
    }, 1000);
    // Note: In a real-world scenario, you would make an HTTP request here
    // using the fetch API or libraries like axios to get data from the API.
  });
};

const Index = () => {
  const [foods, setFoods] = useState([]);
  // ... rest of the component code

  useEffect(() => {
    // When the component mounts, fetch the food data
    fetchFoodsFromAPI().then((data) => {
      // Update the state with the fetched data
      setFoods(data);
    });
  }, []);

  
  const [foodName, setFoodName] = useState('');
  const [aminoAcidProfile, setAminoAcidProfile] = useState('');

  const handleAddFood = () => {
    if (foodName && aminoAcidProfile) {
      setFoods([
        ...foods,
        { name: foodName, profile: aminoAcidProfile.split(',').map(Number) },
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
                <Td>{food.name}</Td>
                <Td>{food.profile.join(', ')}</Td>
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