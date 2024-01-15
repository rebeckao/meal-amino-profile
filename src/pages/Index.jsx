import React, { useState, useEffect, useRef } from "react";
import { useOutsideClick } from "@chakra-ui/react";
import { Box, Button, Container, Flex, FormControl, FormLabel, Heading, Input, Stack, Table, Tbody, Td, Th, Thead, Tr, Text, VStack } from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";

// Import data from the JSON file
import foodData from "../data/foodData.json";

const aminoAcidsNames = ["Tryptophan", "Threonine", "Isoleucine", "Leucine", "Lysine", "Methionine", "Phenylalanine", "Tyrosine", "Valine", "Arginine", "Histidine", "Alanine", "Aspartic acid", "Glutamic acid", "Glycine", "Proline", "Serine", "Hydroxyproline", "Cysteine"];

import { FaSearch } from "react-icons/fa";
import AminoAcidBarChart from "../components/AminoAcidBarChart"; // Moved import statement to the top

const Index = () => {
  const [foods, setFoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef();
  // ... rest of the component code

  useEffect(() => {
    // Foods are initialized to an empty array, no initial data is set
    setFoods([]);
  }, []);

  const [foodName, setFoodName] = useState("");
  const [aminoAcidProfile, setAminoAcidProfile] = useState("");

  const handleAddFood = () => {
    if (foodName && aminoAcidProfile) {
      const nutrients = aminoAcidProfile
        .split(",")
        .map((amino, index) => {
          const [name, amountStr] = amino.trim().split(":");
          const amount = parseFloat(amountStr.trim());
          return aminoAcidsNames.includes(name) ? { name, amount, unitName: "g" } : null;
        })
        .filter((nutrient) => nutrient !== null);

      setFoods([...foods, { description: foodName, fdcId: Math.random().toString(36).substr(2, 9), foodNutrients: nutrients }]);
      setFoodName("");
      setAminoAcidProfile("");
    }
  };

  useOutsideClick({
    ref: searchRef,
    handler: () => setShowDropdown(false),
  });

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setShowDropdown(event.target.value !== "");
  };

  const handleDropdownClick = (foodDescription) => {
    const selectedFood = foodData.find((food) => food.description.toLowerCase() === foodDescription.toLowerCase());
    if (selectedFood) {
      const foodWithQuantity = { ...selectedFood, quantity: 100 }; // Default quantity set to 100
      const newFoods = [...foods, foodWithQuantity];
      setFoods(newFoods);
    }
    setSearchQuery("");
    setShowDropdown(false);
  };

  const handleRemoveFood = (fdcId) => {
    setFoods(foods.filter((food) => food.fdcId !== fdcId));
  };

  const filteredFoods = foods;

  const optimalAminoAcidsProportions = {
    Histidine: 10,
    Isoleucine: 10,
    Leucine: 14,
    Lysine: 12,
    "Methionine plus cystine": 13,
    "Phenylalanine plus tyrosine": 14,
    Threonine: 7,
    Tryptophan: 3.5,
    Valine: 10,
  };

  const essentialAminoAcids = {
    Histidine: "Histidine",
    Isoleucine: "Isoleucine",
    Leucine: "Leucine",
    Lysine: "Lysine",
    Methionine: "Methionine plus cystine",
    Cystine: "Methionine plus cystine",
    Phenylalanine: "Phenylalanine plus tyrosine",
    Tyrosine: "Phenylalanine plus tyrosine",
    Threonine: "Threonine",
    Tryptophan: "Tryptophan",
    Valine: "Valine",
  };

  const combinedProfile = foods
    .reduce((acc, food) => {
      const quantity = food.quantity || 100; // Default to 100 if quantity is not specified
      food.foodNutrients.forEach((nutrient) => {
        const nutrientName = essentialAminoAcids[nutrient.name];
        if (nutrientName) {
          const existingNutrient = acc.find((n) => n.name === nutrientName);
          if (existingNutrient) {
            existingNutrient.amount += nutrient.amount * (quantity / 100);
          } else {
            acc.push({ name: nutrientName, amount: nutrient.amount * (quantity / 100), unitName: "g" });
          }
        }
      });
      return acc;
    }, [])
    .map((nutrient) => ({ ...nutrient, amount: parseFloat(nutrient.amount.toFixed(2)) })); // Round to two decimal places

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6}>
        <Heading>Amino Acid Profile for Meal</Heading>
        <FormControl as="form" onSubmit={(e) => e.preventDefault()}>
          <FormLabel htmlFor="search">Search for a Food</FormLabel>
          <Flex ref={searchRef}>
            <Input id="search" value={searchQuery} onChange={handleSearchChange} placeholder="Type to search..." onClick={() => setShowDropdown(true)} />
            <Button type="submit" ml={2} leftIcon={<FaSearch />}>
              Search
            </Button>
            {showDropdown && searchQuery && (
              <Stack spacing={1} mt="10" w="100%" borderWidth="1px" borderRadius="lg" p={2} bg="white" position="absolute" zIndex="dropdown">
                {foodData
                  .filter((food) => food.description.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((food, index) => (
                    <Box key={index} p={2} borderRadius="md" _hover={{ bg: "gray.100" }} onClick={() => handleDropdownClick(food.description)} cursor="pointer">
                      {food.description}
                    </Box>
                  ))}
              </Stack>
            )}
            {showDropdown && searchQuery && (
              <Stack spacing={1} mt="10" w="100%" borderWidth="1px" borderRadius="lg" p={2} bg="white" position="absolute" zIndex="dropdown">
                {foodData
                  .filter((food) => food.description.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((food, index) => (
                    <Box key={index} p={2} borderRadius="md" _hover={{ bg: "gray.100" }} onClick={() => handleDropdownClick(food.description)} cursor="pointer">
                      {food.description}
                    </Box>
                  ))}
              </Stack>
            )}
          </Flex>
        </FormControl>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Food Name</Th>
              <Th>Amino Acid Profile</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredFoods.map((food) => (
              <Tr key={food.fdcId}>
                <Td>{food.description}</Td>
                <Td>{food.foodNutrients.map((nutrient) => `${nutrient.name}: ${nutrient.amount} ${nutrient.unitName}`).join(", ")}</Td>
                <Td>
                  <Input type="number" placeholder="Quantity (g)" value={food.quantity} onChange={(e) => setFoods(foods.map((f) => (f.fdcId === food.fdcId ? { ...f, quantity: parseFloat(e.target.value) } : f)))} size="sm" min={0} max={1000} width="100px" />
                </Td>
                <Td>
                  <Button leftIcon={<FaTrash />} colorScheme="red" onClick={() => handleRemoveFood(food.fdcId)}>
                    Remove
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        import AminoAcidBarChart from '../components/AminoAcidBarChart'; // Add this import at the top with the other imports // ... rest of the component code stays the same
        {foods.length > 0 && (
          <Flex width="full" justify="center" p={4}>
            <Stack>
              <Text fontSize="xl" fontWeight="bold">
                Combined Amino Acid Profile
              </Text>
              <AminoAcidBarChart profile={combinedProfile} />
            </Stack>
          </Flex>
        )}
      </VStack>
    </Container>
  );
};

export default Index;
