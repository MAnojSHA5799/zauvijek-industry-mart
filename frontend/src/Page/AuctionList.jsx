// src/components/AuctionList.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Kaushik/Navbar";
import Footer from "../Kaushik/Footer";
import {
  Box,
  Flex,
  Text,
  Button,
  Image,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Card,
  CardBody,
  Heading,
  Stack,
  useToast,
} from "@chakra-ui/react";

const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const toast = useToast();
  const { id } = useParams();

  // ✅ Logged-in user details
  const user = JSON.parse(localStorage.getItem("userDetails"));
  console.log("Logged-in User:", user);

  // ✅ Fetch auctions
  const fetchAuctions = async () => {
    try {
      if (!user || !user.id) {
        console.warn("No logged-in user found");
        return;
      }

      const res = await axios.get("https://zauvijek-industry-mart.onrender.com/api/auctions");
      console.log("All auctions:", res.data);

      // ✅ Filter auctions by logged-in user
      const userAuctions = res.data.filter(
        (auction) => auction.userId === user.id
      );

      setAuctions(userAuctions);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error fetching auctions",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchAuctions();
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Delete auction
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this auction?")) {
      try {
        await axios.delete(`https://zauvijek-industry-mart.onrender.com/api/auctions/${id}`);
        toast({
          title: "Auction deleted successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchAuctions();
      } catch (err) {
        console.error(err);
        toast({
          title: "Error deleting auction",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  // ✅ Edit auction
  const handleEdit = (id) => {
    navigate(`/auction/edit/${id}`);
  };

  return (
    <>
      <Navbar />
      <Box maxW="1200px" mx="auto" px="20px" mt="90px" mb="40px">
        <Heading
          textAlign="center"
          color="#606FC4"
          mb="30px"
          fontSize={{ base: "2xl", md: "3xl" }}
        >
          My Auctions
        </Heading>

        {auctions.length === 0 ? (
          <Text textAlign="center" color="gray.500">
            No auctions found for your account.
          </Text>
        ) : isMobile ? (
          // ✅ Mobile Card View
          <Stack spacing={5}>
            {auctions.map((auction) => (
              <Card key={auction._id} shadow="md" borderRadius="xl">
                <CardBody>
                  <Heading fontSize="lg" color="#333" mb={2}>
                    {auction.title}
                  </Heading>
                  <Text color="gray.600" mb={2}>
                    {auction.description}
                  </Text>
                  <Text>
                    <b>Type:</b>{" "}
                    <Text as="span" color="#606FC4" fontWeight="500">
                      {auction.type}
                    </Text>
                  </Text>
                  <Text>
                    <b>Start:</b>{" "}
                    {new Date(auction.startDate).toLocaleString()}
                  </Text>
                  <Text>
                    <b>End:</b> {new Date(auction.endDate).toLocaleString()}
                  </Text>

                  {auction.imageUrl ||
                  (auction.photos && auction.photos.length > 0) ? (
                    <Image
                      src={`https://zauvijek-industry-mart.onrender.com${
                        auction.imageUrl || auction.photos[0]
                      }`}
                      alt={auction.title}
                      mt={3}
                      borderRadius="lg"
                      h="180px"
                      w="100%"
                      objectFit="cover"
                    />
                  ) : (
                    <Text mt={2}>No Image</Text>
                  )}

                  <Flex mt={4} gap={3}>
                    <Button
                      size="sm"
                      bg="#606FC4"
                      color="white"
                      _hover={{ bg: "#4a56b2" }}
                      onClick={() => handleEdit(auction._id)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      bg="red.500"
                      color="white"
                      _hover={{ bg: "red.600" }}
                      onClick={() => handleDelete(auction._id)}
                    >
                      Delete
                    </Button>
                  </Flex>
                </CardBody>
              </Card>
            ))}
          </Stack>
        ) : (
          // ✅ Desktop Table View
          <Box overflowX="auto" borderRadius="md" boxShadow="sm">
            <Table variant="striped" colorScheme="gray">
              <Thead bg="#606FC4">
                <Tr>
                  <Th color="white">Title</Th>
                  <Th color="white">Type</Th>
                  <Th color="white">Start Time</Th>
                  <Th color="white">End Time</Th>
                  <Th color="white">Image</Th>
                  <Th color="white">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {auctions.map((auction) => (
                  <Tr key={auction._id} _hover={{ bg: "gray.100" }}>
                    <Td>{auction.title}</Td>
                    <Td>{auction.type}</Td>
                    <Td>{new Date(auction.startDate).toLocaleString()}</Td>
                    <Td>{new Date(auction.endDate).toLocaleString()}</Td>
                    <Td>
                      {auction.imageUrl ||
                      (auction.photos && auction.photos.length > 0) ? (
                        <Image
                          src={`https://zauvijek-industry-mart.onrender.com${
                            auction.imageUrl || auction.photos[0]
                          }`}
                          alt={auction.title}
                          boxSize="80px"
                          borderRadius="md"
                          objectFit="cover"
                          border="1px solid #ddd"
                        />
                      ) : (
                        "No Image"
                      )}
                    </Td>
                    <Td>
                      <Flex gap={3}>
                        <Button
                          size="sm"
                          bg="#606FC4"
                          color="white"
                          _hover={{ bg: "#4a56b2" }}
                          onClick={() => handleEdit(auction._id)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          bg="red.500"
                          color="white"
                          _hover={{ bg: "red.600" }}
                          onClick={() => handleDelete(auction._id)}
                        >
                          Delete
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>
      <Footer />
    </>
  );
};

export default AuctionList;
