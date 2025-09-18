// src/components/ForwordAuction.jsx
import React, { useEffect, useState } from "react";
import {
  Heading,
  Flex,
  VStack,
  SimpleGrid,
  Badge,
  Image,
  Modal,
  Box,
  Text,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Table,
  Tbody,
  Tr,
  Td,
  useDisclosure,
  useBreakpointValue,
} from "@chakra-ui/react";
import Navbar from "../Kaushik/Navbar";
import Footer from "../Kaushik/Footer";
import MarketDashboard from "./MarketDashboard";
import IndustryNews from "./IndustryNews";
import ActivationEventsPage from "./ActivationEventsPage";
import axios from "axios";

function BackwardAuction() {
  const [auctions, setAuctions] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});
  const [selectedAuction, setSelectedAuction] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    fetchAuctions();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTimers = {};
      auctions.forEach((auction) => {
        const diff = new Date(auction.endDate) - new Date();
        if (diff <= 0) updatedTimers[auction._id] = "Auction Ended";
        else {
          const hours = Math.floor(diff / 1000 / 60 / 60);
          const minutes = Math.floor((diff / 1000 / 60) % 60);
          const seconds = Math.floor((diff / 1000) % 60);
          updatedTimers[auction._id] = `${hours}h ${minutes}m ${seconds}s`;
        }
      });
      setTimeLeft(updatedTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [auctions]);

  const fetchAuctions = async () => {
    try {
      const res = await axios.get("https://zauvijek-industry-mart.onrender.com/api/auctions");
      // ✅ Filter forward auctions
      const forwardAuctions = res.data.filter(
        (auction) => auction.type === "backward"
      );
      setAuctions(forwardAuctions);
    } catch (err) {
      console.error(err);
    }
  };

  // Modal open
  const handleOpenModal = (auction) => {
    setSelectedAuction(auction);
    onOpen();
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <Box mt={{ base: "16%", md: "3.9%" }}>
        <Box
          w="100%"
          h={{ base: "250px", md: "400px" }}
          position="relative"
          // borderRadius="lg"
          overflow="hidden"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          >
            <source src="/ban.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Overlay */}
          <Box
            position="absolute"
            top="0"
            left="0"
            w="100%"
            h="100%"
            bg="rgba(0,0,0,0.4)"
            display="flex"
            alignItems="center"
            p={{ base: 4, md: 8 }}
            color="white"
          >
            <VStack
              spacing={4}
              align="start"
              maxW={{ base: "100%", md: "60%" }}
            >
              <Heading size={{ base: "md", md: "lg" }}>
                Backward Auction Expertise
              </Heading>
              <Text fontSize={{ base: "sm", md: "lg" }}>
                As a trusted neutral platform, we specialize in backward auctions
                for the steel and metal industry. Our fair and transparent
                approach, backed by 14+ years of expertise, helps sellers secure
                the best value while ensuring competitive participation.
              </Text>
            </VStack>
          </Box>
        </Box>
      </Box>

      {/* Auctions Cards Section */}
      <Box maxW="1000px" mx="auto" mt={10} px={2}>
        <Heading size="lg" mb={6} textAlign="center" color="purple.600">
          Backward Auctions
        </Heading>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={6}>
          {auctions.map((auction) => (
            <Box
              key={auction._id}
              borderRadius="20px"
              overflow="hidden"
              bg="white"
              shadow="md"
              transition="transform 0.2s"
              _hover={{ transform: "scale(1.03)", cursor: "pointer" }}
              onClick={() => handleOpenModal(auction)}
            >
              {/* Auction Image */}
              {auction.imageUrl ||
              (auction.photos && auction.photos.length > 0) ? (
                <Box h="200px" overflow="hidden">
                  <Image
                    src={`https://zauvijek-industry-mart.onrender.com${
                      auction.imageUrl || auction.photos[0]
                    }`}
                    alt={auction.title}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                  />
                </Box>
              ) : (
                <Box
                  h="200px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bg="gray.100"
                >
                  <Text>No Image</Text>
                </Box>
              )}

              {/* Auction Info */}
              <Box p={4}>
                <Text fontSize="sm" color="gray.500">
                  📅 {new Date(auction.startDate).toLocaleDateString()}
                </Text>
                <Text fontWeight="bold">Material: {auction.title}</Text>
                <Text fontSize="sm" isTruncated>
                  Location: {auction.pickupLocation || "N/A"}
                </Text>
                <Badge colorScheme="purple" mt={2}>
                  {auction.auctionType} Auction
                </Badge>
                <Text fontWeight="bold" mt={2} color="red.500">
                  ⏰ {timeLeft[auction._id] || "Calculating..."}
                </Text>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* Auction Modal */}
      {selectedAuction && (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Auction Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Table variant="simple">
                <Tbody>
                  <Tr>
                    <Td fontWeight="bold">Material Name</Td>
                    <Td>{selectedAuction.title}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold">Material Grade</Td>
                    <Td>{selectedAuction.materialGrade}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold">Quantity</Td>
                    <Td>
                      {selectedAuction.quantity} {selectedAuction.unit}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold">Auction Type</Td>
                    <Td>{selectedAuction.auctionType}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold">Starting Price</Td>
                    <Td>{selectedAuction.startingPrice}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold">Bid Increment</Td>
                    <Td>{selectedAuction.bidIncrement}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold">Start Date</Td>
                    <Td>
                      {new Date(selectedAuction.startDate).toLocaleString()}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold">End Date</Td>
                    <Td>
                      {new Date(selectedAuction.endDate).toLocaleString()}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold">Company</Td>
                    <Td>{selectedAuction.companyName}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold">Contact Person</Td>
                    <Td>{selectedAuction.contactPerson}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold">Phone</Td>
                    <Td>{selectedAuction.phone}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold">Email</Td>
                    <Td>{selectedAuction.email}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold">Pickup Location</Td>
                    <Td>{selectedAuction.pickupLocation}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold">Delivery Option</Td>
                    <Td>{selectedAuction.deliveryOption}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold">Terms</Td>
                    <Td>{selectedAuction.terms}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      {/* News + Events Section */}
      <Flex
        direction={{ base: "column", md: "row" }}
        gap="20px"
        p="20px"
        maxW="1200px"
        mx="auto"
      >
        <Box flex="2">
          <IndustryNews />
        </Box>
        <Box flex="1">
          <ActivationEventsPage />
        </Box>
      </Flex>

      <MarketDashboard />
      <Footer />
    </>
  );
}

export default BackwardAuction;
