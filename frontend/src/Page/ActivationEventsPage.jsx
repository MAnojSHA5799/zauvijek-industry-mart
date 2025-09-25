// src/Page/TendersPage.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Flex,
  Heading,
  VStack,
  Image,
  Badge,
  useColorModeValue,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import axios from "axios";
import { ChevronRightIcon } from "@chakra-ui/icons";

const MotionBox = motion(Box);

const TendersPage = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isPaused, setIsPaused] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cardBg = useColorModeValue("white", "gray.700");

  // ✅ Fetch JSON
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get("/metal-mining.json"); // ✅ file inside public/
        const data = res.data || [];
        setNews(data);
        setFilteredNews(data);

        // Extract unique categories + add "All"
        const uniqueCategories = [
          "All",
          ...new Set(data.map((item) => item.category)),
        ];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error loading metal-mining.json", err);
      }
    };
    fetchNews();
  }, []);

  // Function to alternate Steel and MetalsMining
  const interleaveData = (data) => {
    const steel = data.filter((item) => item.category === "Steel");
    const mining = data.filter((item) => item.category === "MetalsMining");

    const maxLen = Math.max(steel.length, mining.length);
    const interleaved = [];

    for (let i = 0; i < maxLen; i++) {
      if (steel[i]) interleaved.push(steel[i]);
      if (mining[i]) interleaved.push(mining[i]);
    }
    return interleaved;
  };

  // ✅ Filter news based on category
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredNews(interleaveData(news)); // <-- FIXED
    } else {
      setFilteredNews(news.filter((item) => item.category === selectedCategory));
    }
  }, [selectedCategory, news]);

  // ✅ Open modal
  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // ✅ Close modal
  const handleCloseModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  return (
    <Box p={6} overflow="hidden" maxW="900px" mx="auto">
      {/* Heading + Filter */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="md" color="#606FC4">
          Latest Steel & Mining Updates
        </Heading>

        <Select
          w="200px"
          size="sm"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          borderColor="#606FC4"
          _hover={{ borderColor: "#4f46e5" }}
          _focus={{ borderColor: "#4f46e5", boxShadow: "0 0 0 1px #4f46e5" }}
        >
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </Select>
      </Flex>

      {/* Auto-scrolling list */}
      <Box
        h="500px"
        overflow="hidden"
        borderRadius="12px"
        boxShadow="md"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        bg="white"
      >
        <MotionBox
          animate={{ y: isPaused ? 0 : ["0%", "-100%"] }}
          transition={{
            duration: 900,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          <VStack spacing={4} align="stretch">
            {[...filteredNews, ...filteredNews].map((item, idx) => (
              <Box
                key={idx}
                p={4}
                bg={cardBg}
                borderRadius="12px"
                boxShadow="sm"
                cursor="pointer"
                _hover={{ bg: "#eef2ff", transform: "scale(1.01)" }}
                transition="0.3s"
                onClick={() => handleOpenModal(item)}
              >
                <Flex gap={4}>
                  {/* Thumbnail */}
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.title}
                      boxSize="80px"
                      borderRadius="8px"
                      objectFit="cover"
                    />
                  )}

                  {/* Content */}
                  <Box flex="1">
                    <Flex justify="space-between" align="center" mb={1}>
                      <Badge colorScheme="purple">{item.category}</Badge>
                      <Text fontSize="xs" color="gray.500">
                        {item.date}
                      </Text>
                    </Flex>

                    <Text
                      fontSize="md"
                      fontWeight="700"
                      color="#333"
                      noOfLines={2}
                      mb={1}
                    >
                      {item.title}
                    </Text>

                    <Text fontSize="sm" color="gray.600" noOfLines={2} mb={2}>
                      {item.description}
                    </Text>

                    {/* Stock Info */}
                    {item.stockPrice && (
                      <Text
                        fontSize="sm"
                        fontWeight="600"
                        color={
                          item.stockChange?.includes("-")
                            ? "red.500"
                            : "green.500"
                        }
                      >
                        ₹{item.stockPrice} ({item.stockChange})
                      </Text>
                    )}
                  </Box>

                  <ChevronRightIcon color="#606FC4" boxSize={6} />
                </Flex>
              </Box>
            ))}
          </VStack>
        </MotionBox>
      </Box>

      {/* ✅ Modal */}
      {selectedItem && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          size="lg"
          isCentered
        >
          <ModalOverlay />
          <ModalContent mt={2}>
            <ModalHeader>{selectedItem.title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {selectedItem.image && (
                <Image
                  ml={"20%"}
                  w={"60%"}
                  h={"50%"}
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  mb={4}
                  borderRadius="8px"
                  objectFit="cover"
                />
              )}
              <Badge colorScheme="purple" mb={2}>
                {selectedItem.category}
              </Badge>
              <Text fontSize="sm" color="gray.500" mb={2}>
                {selectedItem.date}
              </Text>
              <Text fontSize="md" color="gray.700" mb={3}>
                {selectedItem.description}
              </Text>

              {selectedItem.stockPrice && (
                <Text
                  fontSize="md"
                  fontWeight="600"
                  color={
                    selectedItem.stockChange?.includes("-")
                      ? "red.500"
                      : "green.500"
                  }
                  mb={3}
                >
                  ₹{selectedItem.stockPrice} ({selectedItem.stockChange})
                </Text>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default TendersPage;
