import React, { useEffect, useState } from "react";
import {
  Heading,
  Button,
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
import axios from "axios";
function BackwordAuction() {
  const [auctions, setAuctions] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [selectedAuction, setSelectedAuction] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

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
      // Filter only forward auctions
      const forwardAuctions = res.data.filter((auction) => auction.type === "backward");
      console.log("Forward Auctions:", forwardAuctions);
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

  const cardHeight = useBreakpointValue({ base: "100px", md: "100px" });

  return (
    <>
    <Navbar />
    <Flex
      gap={6}
      mt={20}
      px={{ base: 4, md: 4 }}
      flexDir={{ base: "column", lg: "row" }}
    >
      {/* Left Card */}
      <Box
        flex="1"
        bgImage="url(https://plus.unsplash.com/premium_photo-1664300628088-bb2e317ea462?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)"
        bgSize="cover"
        bgPos="center"
        color="white"
        borderRadius="20px"
        p={6}
        display="flex"
        flexDir="column"
        justifyContent="space-between"
        minH={cardHeight}
      >
        <VStack align="start" spacing={4}>
          <Heading size="lg">Experience You Can Trust</Heading>
          <Text fontSize="sm" maxW="90%">
            14+ years of expertise in strategizing the e-auction for steel &
            metal industry. Exclusive focus on technology & tailored services
            set us apart.
          </Text>
        </VStack>
        <Button
          bg="purple.500"
          _hover={{ bg: "purple.600" }}
          color="white"
          borderRadius="10px"
          mt={4}
          alignSelf="flex-start"
        >
          Feel the difference
        </Button>
      </Box>

      {/* Middle Slider */}
      <Box
  flex="3"
  borderRadius="20px"
  overflow="hidden"
  position="relative"
  h="450px"   // 👈 Height control
>
  {/* Background Video */}
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
    <source src="/ban1.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>

  {/* Overlay Content */}
  <Box
    position="absolute"
    top="0"
    left="0"
    w="100%"
    h="100%"
    bg="rgba(0,0,0,0.4)" // 👈 हल्का dark overlay ताकि text साफ दिखे
    display="flex"
    flexDir="column"
    justifyContent="center"
    p={6}
    color="white"
  >
    <VStack spacing={4} align="start" maxW="80%">
      <Heading size="lg">A Leading Neutral Platform</Heading>
      <Text fontSize="sm">
        We proudly operate as the leading neutral portal in the e-auction
        landscape, ensuring impartiality by not being promoted or owned by
        any steel industry firm.
      </Text>
      <Button
        bg="purple.500"
        _hover={{ bg: "purple.600" }}
        color="white"
        borderRadius="10px"
      >
        Click to register
      </Button>
    </VStack>
  </Box>
</Box>



      {/* Right Cards */}
      <VStack flex="1" spacing={4}>
        <Box
          bg="white"
          borderRadius="20px"
          p={6}
          boxShadow="md"
          textAlign="left"
          w="100%"
          minH={cardHeight}
        >
          <Heading size="md" color="purple.500">
            Ready To Join As A Bidder →
          </Heading>
          <VStack align="start" mt={3} spacing={1} fontSize="sm" color="gray.700">
            <Text>› 14 years of expertise</Text>
            <Text>› Online EMD management</Text>
            <Text>› Post ads & chat facility</Text>
            <Text>› Ease of participation</Text>
          </VStack>
        </Box>

        <Box
          bgGradient="linear(to-r, purple.400, purple.600)"
          borderRadius="20px"
          p={6}
          color="white"
          textAlign="left"
          w="100%"
          minH={cardHeight}
        >
          <Heading size="md">Ready To Join As A Supplier →</Heading>
          <VStack align="start" mt={3} spacing={1} fontSize="sm">
            <Text>› Varied e-auction engines available</Text>
            <Text>› Robust Security Measures</Text>
            <Text>› Qualified and Secure Bidders</Text>
            <Text>› User-Friendly Interface</Text>
          </VStack>
        </Box>
      </VStack>
    </Flex>
     {/* Auctions Cards Section (Above Footer) */}
     <Box maxW="1000px" mx="auto" mt={10} px={2}>
        <Heading size="lg" mb={6} textAlign="center" color="purple.600">
        Backward Auctions
        </Heading>
     <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        {auctions.map((auction) => (
          <Box
            key={auction._id}
            borderRadius="20px"
            overflow="hidden"
            bg="white"
            shadow="md"
            position="relative"
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.03)", cursor: "pointer" }}
            onClick={() => handleOpenModal(auction)} // 👈 Pure card pe click
          >
            {/* Auction Image */}
            {auction.imageUrl || (auction.photos && auction.photos.length > 0) ? (
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

      {/* Modal */}
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
                  <Tr>
                    <Td fontWeight="bold">Material Certificate</Td>
                    <Td>
                      {selectedAuction.materialCertificate ? (
                        <a
                          href={`https://zauvijek-industry-mart.onrender.com${selectedAuction.materialCertificate}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "blue" }}
                        >
                          View Certificate
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold">Photos</Td>
                    <Td>
                      {selectedAuction.photos ? (
                        <Image
                          src={`https://zauvijek-industry-mart.onrender.com${selectedAuction.photos}`}
                          alt="Auction Photos"
                          w="100px"
                          h="100px"
                          objectFit="cover"
                        />
                      ) : (
                        "No Photos"
                      )}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    <Footer />
    </>
  );
}

export default BackwordAuction;


