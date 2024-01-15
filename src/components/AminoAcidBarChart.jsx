import React from "react";
import { Box, Progress, Stack, Text } from "@chakra-ui/react";

const AminoAcidBarChart = ({ profile, optimalProportions }) => {
  // Find the maximum amount for scaling the progress bars
  const maxAmount = Math.max(...profile.map((nutrient) => nutrient.amount));

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4}>
      <Stack spacing={3}>
        {profile.map((nutrient, index) => (
          <Box key={index}>
            <Text fontSize="sm" fontWeight="bold">
              {nutrient.name} ({nutrient.amount}g)
            </Text>
            <Progress value={(nutrient.amount / maxAmount) * 100} size="sm" colorScheme="yellow" />
            {(() => {
              // Calculate the scaling factor based on the meal's amino acid profile
              const scalingFactor = Math.min(
                ...profile
                  .map((n) => {
                    const optimalValueForN = optimalProportions[n.name] || 0;
                    return n.amount / optimalValueForN;
                  })
                  .filter((factor) => !isNaN(factor)),
              );

              // Calculate the scaled optimal value for this nutrient
              const optimalValue = optimalProportions[nutrient.name] || 0;
              const scaledOptimalValue = optimalValue * scalingFactor;
              // Ensure the scaled optimal value does not exceed the nutrient amount
              const displayedOptimalValue = Math.min(scaledOptimalValue, nutrient.amount);
              return <Progress value={(displayedOptimalValue / maxAmount) * 100} size="sm" colorScheme="green" />;
            })()}
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default AminoAcidBarChart;
