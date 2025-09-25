import React, { useEffect, useState, useRef } from "react";
import { 
  Box, 
  Flex, 
  Button, 
  Text, 
  useToast, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalCloseButton, 
  ModalBody, 
  ModalFooter,
  SimpleGrid,
  Image,
  useDisclosure, // ✅ Add this
} from "@chakra-ui/react";
// const MotionBox = motion(Box);

import { Link } from "react-router-dom"; // ✅ Fixes 'Link' undefined
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BannerDisplayTwo from "./BannerDisplayTwo";
import axios from "axios";

const MotionBox = motion(Box);

const Home = () => {
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [userPlan, setUserPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const MotionFlex = motion(Flex); // ✅ Fixes 'MotionFlex' undefined

  const toast = useToast();
  const {
    isOpen: isExpiryOpen,
    onOpen: openExpiry,
    onClose: closeExpiry,
  } = useDisclosure();

  const prevLengthRef = useRef(0);

  // Slider logos or other UI data
  const logos = [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/HP_logo_2012.svg/2048px-HP_logo_2012.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/2560px-Adidas_Logo.svg.png",
    "https://1000logos.net/wp-content/uploads/2017/05/Reebok-logo.png",
    "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    "https://upload.wikimedia.org/wikipedia/commons/5/51/Google.png",
  ];

  // 🔹 Fetch user info
  const fetchUser = async () => {
    try {
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));
      if (!userDetails || !userDetails._id) return;

      const res = await axios.post(
        "https://zauvijek-industry-mart.onrender.com/user/me",
        { userDetails },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
console.log("66",res.data)
      setUserPlan(res.data);
      checkPlanExpiry(res.data);
    } catch (err) {
      console.error("Error fetching user info", err.response?.data || err);
    }
  };

  // 🔹 Check if plan is about to expire (5 days before expiry)
  const checkPlanExpiry = (user) => {
    if (!user.planActive || !user.planEndDate) return;

    const today = new Date();
    const planEnd = new Date(user.planEndDate);
    const daysLeft = Math.ceil((planEnd - today) / (1000 * 60 * 60 * 24));

    if (daysLeft <= 5 && daysLeft >= 0) {
      openExpiry();
    }
  };

  // 🔹 Fetch products
  const fetchProducts = async () => {
    try {
      const response = await fetch("https://zauvijek-industry-mart.onrender.com/buyer/products");
      const data = await response.json();
      const newProducts = data.products || [];

      // 🔥 Check for new item
      if (prevLengthRef.current && newProducts.length > prevLengthRef.current) {
        toast({
          title: "New Item Added 🎉",
          description: "A new product has been added to the store.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }

      prevLengthRef.current = newProducts.length;
      setProducts(newProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch items/prices
  const fetchItems = async () => {
    try {
      const res = await axios.get("https://zauvijek-industry-mart-23cvrv2tx.vercel.app//recycleinme_prices.json");
      const data = res.data.map((item) => {
        let changeType = "neutral";
        if (item.change.includes("▼") || item.change.includes("-")) changeType = "down";
        else if (item.change.includes("▲") || item.change.includes("+")) changeType = "up";
        return { ...item, changeType };
      });
      setItems(data);
    } catch (err) {
      console.error("Error loading recycleinme_prices.json", err);
    }
  };

  // 🔹 useEffect to fetch data once
  useEffect(() => {
    fetchItems();
    fetchProducts();
    fetchUser();
  }, []);

  // 🔹 Auto-refresh products every 10s
  useEffect(() => {
    const interval = setInterval(fetchProducts, 10000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  const categoryOrder = ["steel", "machinery", "electronics", "automotive"];
  const orderedCategories = Object.keys(groupedProducts).sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a.toLowerCase());
    const bIndex = categoryOrder.indexOf(b.toLowerCase());
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return (
    <>
      <Navbar />

      {/* Banner */}
      <Box mt={10}>
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <BannerDisplayTwo />
        </motion.div>
      </Box>

      {/* Plan Expiry Modal */}
      {userPlan && (
        <Modal isOpen={isExpiryOpen} onClose={closeExpiry} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Plan Expiry Alert</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>
                Your <strong>{userPlan.plan}</strong> plan will expire in{" "}
                <strong>
                  {Math.ceil((new Date(userPlan.planEndDate) - new Date()) / (1000 * 60 * 60 * 24))}
                </strong>{" "}
                days. Please renew to continue enjoying premium features.
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="purple"
                mr={3}
                onClick={() => {
                  closeExpiry();
                  window.location.href = "/signup"; // redirect to renew plan
                }}
              >
                Renew Plan
              </Button>
              <Button variant="ghost" onClick={closeExpiry}>
                Later
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      {/* <Box mt={-10}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <BannerDisplay />
        </motion.div>
      </Box> */}

      {/* Metal Market Updates */}
      <div
        className="overflow-hidden border p-3 rounded-lg mt-3 mb-3 bg-white shadow-lg"
        style={{
          border: "1px solid #ccc",
          height: "80px",
          padding: "20px",
          borderRadius: "8px",
          marginTop: "-20px",
        }}
      >
        <div className="marquee-wrapper relative overflow-hidden">
          <div
            className="marquee flex gap-6 animate-marquee whitespace-nowrap"
            style={{ paddingLeft: "20px", paddingRight: "20px" }}
          >
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-6 px-5 py-2 rounded-lg border transition-transform duration-200 hover:scale-105 hover:shadow-xl"
                style={{
                  background: "#9daafa", // subtle gradient
                  height: "40px",
                  // border: "2px solidhsl(0, 100.00%, 65.10%)", // colored border
                  minWidth: "max-content", // ensures proper spacing
                  marginRight: "12px", // extra spacing between items
                  padding: "8px",
                  paddingLeft: "20px",
                  paddingRight: "20px",
                  borderRadius: "5px",
                }}
              >
                {/* 🔴 Vertical Divider */}
                <span className="border-l-4 border-red-500 h-6 mr-3"></span>

                {/* Title */}
                <span
                  className="font-bold text-white mr-4"
                  style={{ fontWeight: 700, color: "white" }}
                >
                  {item.title} |{" "}
                </span>

                {/* Price */}
                <span
                  className="font-bold text-black mr-4"
                  style={{ color: "white", fontWeight: '900' }}
                >
                  {item.price} |
                </span>

                {/* Change Status with gradient */}
                {item.changeType === "down" && (
                  <span
                    style={{
                      fontWeight: "700",
                      color: "white",
                      // background: "#ff4d4d", // red background
                      padding: "1px 10px",
                      // borderRadius: "6px",
                      marginRight: "16px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span style={{ color: "#ff0000" }}>↓</span> {item.change}
                  </span>
                )}
                {item.changeType === "up" && (
                  <span
                    style={{
                      fontWeight: "700",
                      color: "white",
                      // background: "#28a745", // green background
                      padding: "1px 10px",
                      // borderRadius: "6px",
                      marginRight: "16px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span style={{ color: "#00ff00" }}>↑</span> {item.change}
                  </span>
                )}
                {item.changeType === "neutral" && (
                  <span
                    style={{
                      fontWeight: "700",
                      color: "white",
                      // background: "#6c757d", // gray background÷
                      padding: "1px 10px",
                      // borderRadius: "6px",
                      // marginRight: "16px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {item.change}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CSS for marquee */}
        <style>{`
  .marquee-wrapper {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
  }
  .marquee {
    display: inline-flex;
    animation: marquee 200s linear infinite;
  }
  .marquee-wrapper:hover .marquee {
    animation-play-state: paused;
  }
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
`}</style>
      </div>

      {/* Category-wise sections */}
      <Box
      // maxW="1200px"
      // mx="auto"
      // px={{ base: 2, sm: 4 }}
      // py={{ base: 2, sm: 4 }}
      // mt={{ base: "40px", sm: "60px", md: "80px" }} // ✅ Added margin-top for spacing
      >
        {loading ? (
          <Text fontSize={{ base: "14px", sm: "16px" }}>
            Loading products...
          </Text>
        ) : (
          <Box
            // maxW="1200px"
            // mx="auto"
            px={{ base: 2, sm: 4 }}
            py={{ base: 2, sm: 4 }}
          >
            {orderedCategories.map((category) => (
              <Box
                key={category}
                borderTop="3px solid #606FC4"
                backgroundColor="white"
                marginTop={{ base: "10px", sm: "20px" }}
                w="100%"
                p={4}
              >
                {/* Category Heading */}

                {/* Product Grid */}
                <SimpleGrid
                  columns={{ base: 2, sm: 2, md: 5 }}
                  spacing={{ base: 3, sm: 4, md: 5 }}
                >
                  {groupedProducts[category].map((el, i) => (
                    <MotionFlex
                      key={el._id}
                      p={{ base: "6px", sm: "10px" }}
                      flexDirection="column"
                      boxShadow="rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, 
                               rgba(60, 64, 67, 0.15) 0px 2px 6px 2px"
                      borderRadius="md"
                      bg="white"
                      cursor="pointer"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      {/* Product Image with Condition Badge */}
                      <Box w="100%" position="relative">
                        <Image
                          width="100%"
                          height={{ base: "140px", sm: "180px", md: "250px" }}
                          objectFit="cover"
                          borderRadius="md"
                          src={`https://zauvijek-industry-mart.onrender.com${el.images?.[0]}`}
                          alt={el.name}
                        />

                        {/* Condition Badge */}
                        {el.condition && (
                          <Box
                            position="absolute"
                            top="10px"
                            left="5px"
                            bg={
                              el.condition === "New"
                                ? "#606FC4"
                                : el.condition === "Refurbished"
                                ? "orange.500"
                                : el.condition === "Resale"
                                ? "teal.500"
                                : "gray.500"
                            }
                            color="white"
                            fontSize={{ base: "10px", sm: "12px" }}
                            fontWeight="bold"
                            px={3}
                            py={1}
                            borderRadius="full"
                            boxShadow="0px 2px 6px rgba(0,0,0,0.3)"
                            textAlign="center"
                          >
                            {el.condition}
                          </Box>
                        )}
                      </Box>

                      {/* Product Info */}
                      <Box p={{ base: "6px", sm: "10px" }} align="start">
                        <Text
                          fontWeight="700"
                          fontSize={{ base: "12px", sm: "14px" }}
                          color="black"
                          noOfLines={1}
                        >
                          {el.name}
                        </Text>
                        <Text
                          fontSize={{ base: "11px", sm: "12px" }}
                          color="gray.600"
                          noOfLines={2}
                        >
                          {el.description?.slice(0, 40)}...
                        </Text>

                        {/* Price + View Button */}
                        <Flex
                          mt={2}
                          justifyContent="space-between"
                          alignItems="center"
                          gap={2}
                        >
                          <Text
                            fontSize={{ base: "12px", sm: "13px" }}
                            fontWeight="bold"
                            color="#606FC4"
                          >
                            ₹{el.price}
                          </Text>

                          <Button
                            as={Link}
                            to={`/product/${el._id}`}
                            size="sm"
                            fontSize={{ base: "11px", sm: "13px" }}
                            color="#606FC4"
                            border="1px solid #606FC4"
                            _hover={{
                              bg: "#606FC4",
                              color: "white",
                              transform: "scale(1.05)",
                            }}
                            transition="all 0.2s ease-in-out"
                          >
                            View
                          </Button>
                        </Flex>
                      </Box>
                    </MotionFlex>
                  ))}
                </SimpleGrid>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Footer />
    </>
  );
};

export default Home;
