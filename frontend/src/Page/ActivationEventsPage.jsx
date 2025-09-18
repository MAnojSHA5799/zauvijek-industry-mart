// src/Page/TendersPage.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Flex,
  Heading,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import axios from "axios";
import { ChevronRightIcon } from "@chakra-ui/icons";
const MotionBox = motion(Box);

const TendersPage = () => {
  const [tenders, setTenders] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const cardBg = useColorModeValue("white", "gray.700");

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const res = await axios.get("https://zauvijek-industry-mart.vercel.app/tenders.json"); // ✅ tenders.json must be inside public/
        setTenders(res.data || []);
      } catch (err) {
        console.error("Error loading tenders.json", err);
      }
    };
    fetchTenders();
  }, []);

  return (
    <Box p={6} overflow="hidden" maxW="600px" mx="auto">
      <Heading size="sm" mb={6} textAlign="center" color="#606FC4">
        Latest Trade & Tender Updates
      </Heading>

      <Box
        h="480px" // 8 items * ~60px height = 480px visible area
        overflow="hidden"
        borderRadius="12px"
        boxShadow="md"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <MotionBox
          animate={{ y: isPaused ? 0 : ["0%", "-100%"] }}
          transition={{
            duration: 200, // speed of scrolling
            ease: "linear",
            repeat: Infinity,
          }}
        >
          <VStack spacing={3} align="stretch">
            {/* Repeat list twice for smooth loop */}
            {[...tenders, ...tenders].map((item, idx) => (
              <Box
  key={idx}
  p={4}
  bg={cardBg}
  borderRadius="8px"
  boxShadow="sm"
  cursor="pointer"
  _hover={{ bg: "#eef2ff", transform: "scale(1.02)" }}
  transition="0.3s"
  onClick={() => window.open(item.link, "_blank")}
>
  <Flex align="center" justify="space-between">
    <Text
      fontSize="sm"
      fontWeight="600"
      color="#5058B3"
      noOfLines={2}
    >
      {item.title}
    </Text>
    <ChevronRightIcon color="#606FC4" boxSize={5} />
  </Flex>
</Box>

            ))}
          </VStack>
        </MotionBox>
      </Box>
    </Box>
  );
};

export default TendersPage;
