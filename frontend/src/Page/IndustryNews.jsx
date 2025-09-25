import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  VStack,
  Heading,
  Spinner,
  Badge,
  Flex,
  Button,
  Select,
} from "@chakra-ui/react";
import axios from "axios";

const MetalPrices = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [city, setCity] = useState("All"); // ✅ default city
  const itemsPerPage = 5;

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/metal_prices.json"); // public folder path
      setPrices(res.data || []);
    } catch (err) {
      console.error("Error fetching prices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  // ✅ Filter by city
  const filteredPrices =
    city === "All" ? prices : prices.filter((item) => item.city === city);

  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = filteredPrices.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(filteredPrices.length / itemsPerPage);

  // ✅ unique city list
  const cityOptions = ["All", ...new Set(prices.map((item) => item.city))];

  return (
    <Box p={6} overflow="hidden" maxW="900px" mx="auto">
      {/* ✅ Heading + Dropdown */}
      <Flex justify="space-between" align="center" mb={4}>
      <Heading size="md" color="#606FC4">
          Live Metal Price Updates
        </Heading>
        <Select
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setPage(1); // reset to first page
          }}
          w="200px"
          borderColor="#606FC4"
          focusBorderColor="#5058B3"
        >
          {cityOptions.map((c, idx) => (
            <option key={idx} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </Flex>

      {loading ? (
        <Box textAlign="center" py={10}>
          <Spinner size="xl" color="#606FC4" />
          <Text mt={2}>Fetching latest metal prices...</Text>
        </Box>
      ) : (
        <VStack align="start" spacing={3}>
          {currentItems.map((item, idx) => (
            <Box
              key={idx}
              w="100%"
              p={4}
              bg="#eef2ff"
              borderRadius="12px"
              boxShadow="sm"
              cursor="pointer"
              transition="0.2s"
              _hover={{ bg: "#d7dbf7", transform: "scale(1.01)" }}
            >
              <Flex justify="space-between" align="center">
                <Text fontSize="md" fontWeight="600" color="#606FC4">
                  {item.metal}
                </Text>
                <Badge colorScheme="purple" fontSize="0.9em">
                  {item.price}
                </Badge>
              </Flex>
              <Text fontSize="sm" color="gray.600">
                📍 {item.city} | {item.lastUpdate.replace("Last Update: ", "")}
              </Text>
            </Box>
          ))}
        </VStack>
      )}

      {/* ✅ Pagination Controls */}
      {!loading && totalPages > 1 && (
        <Flex justify="center" mt={4} gap={3}>
          <Button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            bg="#606FC4"
            color="white"
            _hover={{ bg: "#5058B3" }}
          >
            Previous
          </Button>
          <Text fontWeight="600" color="#5058B3" alignSelf="center">
            Page {page} of {totalPages}
          </Text>
          <Button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            bg="#606FC4"
            color="white"
            _hover={{ bg: "#5058B3" }}
          >
            Next
          </Button>
        </Flex>
      )}
    </Box>
  );
};

export default MetalPrices;
