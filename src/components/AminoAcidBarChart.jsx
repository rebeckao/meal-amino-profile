import React from 'react';
import { Box, Progress, Stack, Text } from '@chakra-ui/react';

const AminoAcidBarChart = ({ profile }) => {
  // Find the maximum amount for scaling the progress bars
  const maxAmount = Math.max(...profile.map(nutrient => nutrient.amount));
  
  return (
    <Box borderWidth="1px" borderRadius="lg" p={4}>
      <Stack spacing={3}>
        {profile.map((nutrient, index) => (
          <Box key={index}>
            <Text fontSize="sm" fontWeight="bold">{nutrient.name} ({nutrient.amount}g)</Text>
            <Progress value={(nutrient.amount / maxAmount) * 100} size="sm" colorScheme="green" />
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default AminoAcidBarChart;