import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Heading,
  Text,
  Image,
  Button,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Flex,
  Spacer,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Divider,
} from "@chakra-ui/react";
import { SearchIcon, StarIcon, AddIcon } from "@chakra-ui/icons";
import Navbar from "../Kaushik/Navbar";
import Footer from "../Kaushik/Footer";

const B2BMarketplace = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOrderOpen,
    onOpen: onOrderOpen,
    onClose: onOrderClose,
  } = useDisclosure();
  const toast = useToast();

  const token = JSON.parse(localStorage.getItem("token"));
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    if (token) {
      fetchOrders();
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedCategory) params.append("category", selectedCategory);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);

      const response = await fetch(
        `http://localhost:4000/buyer/products?${params}`
      );
      const data = await response.json();
      console.log("92", data.products);
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:4000/buyer/categories");
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:4000/buyer/orders", {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleSearch = () => {
    fetchProducts();
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.productId === product._id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
          sellerId: product.sellerId._id,
          sellerName: product.sellerId.name,
        },
      ]);
    }
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(
        cart.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const placeOrder = async () => {
    if (!token) {
      toast({
        title: "Login Required",
        description: "Please login to place an order",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add products to your cart",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/buyer/orders", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          products: cart,
          shippingAddress: {
            name: userDetails.name,
            address: "Default Address",
            city: "Default City",
            state: "Default State",
            pincode: "123456",
            phone: userDetails.phone,
          },
          paymentMethod: "cod",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast({
          title: "Order Placed",
          description: `Your order has been placed successfully. ${data.totalOrders} order(s) created.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setCart([]);
        onOrderClose();
        fetchOrders();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Order Failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "yellow";
      case "confirmed":
        return "blue";
      case "shipped":
        return "purple";
      case "delivered":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  const totalCartAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <>
      <Navbar />
      <Box p={8} mt={10} maxW="1200px" mx="auto">
        <Heading mb={6} color="blue.600">
          B2B Marketplace
        </Heading>

        <Tabs>
          <TabList>
            <Tab>Browse Products</Tab>
            <Tab>My Orders</Tab>
            {cart.length > 0 && <Tab>Cart ({cart.length})</Tab>}
          </TabList>

          <TabPanels>
            <TabPanel>
              {/* Search and Filters */}
              <Box mb={6} p={4} bg="gray.50" borderRadius="md">
                <Grid
                  templateColumns="repeat(auto-fit, minmax(200px, 1fr))"
                  gap={4}
                  mb={4}
                >
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <SearchIcon color="gray.300" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                  <Select
                    placeholder="All Categories"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Select>
                  <NumberInput
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(value) => setMinPrice(value)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <NumberInput
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(value) => setMaxPrice(value)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Grid>
                <Button colorScheme="blue" onClick={handleSearch}>
                  Search
                </Button>
              </Box>

              {/* Products Grid */}
              <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
  {products.map((product) => (
    <Card
      key={product._id}
      maxW="sm"
      borderWidth="0px"
      borderRadius="md"
      overflow="hidden"
      boxShadow="md"
      _hover={{ boxShadow: "xl", transform: "scale(1.02)", transition: "0.3s" }}
    >
      {/* Product Image */}
      {product.images && product.images.length > 0 && (
        <Image
          src={`http://localhost:4000${product.images[0]}`}
          alt={product.name}
          objectFit="cover"
          w="100%"
          h="250px"
        />
      )}

      <CardBody>
        {/* Product Name */}
        <Heading size="md" mb={1} noOfLines={2}>
          {product.name}
        </Heading>

        {/* Seller */}
        {/* <Text fontSize="sm" color="gray.500" mb={2}>
          by {product.sellerId?.name}
        </Text> */}

        {/* Description */}
        <Text fontSize="sm" color="gray.600" mb={2} noOfLines={2}>
          {product.description}
        </Text>

        {/* Price */}
        <Text fontSize="xl" fontWeight="bold" color="green.600" mb={1}>
          ₹{product.price}
        </Text>

        {/* Stock & Min Order */}
        <Flex fontSize="sm" color="gray.500" mb={2} justify="space-between">
          <Text>Stock: {product.stock}</Text>
          <Text>Min Order: {product.minOrderQuantity}</Text>
        </Flex>

        {/* Category Badge */}
        <Badge colorScheme="blue">{product.category}</Badge>
      </CardBody>

      <CardFooter>
      <Button
  bg="#606FC4"
  color="white"
  _hover={{ bg: "#4a54a8" }}
  size="sm"
  w="100%"
  onClick={() => addToCart(product)}
  isDisabled={product.stock === 0}
>
  Add to Cart
</Button>

      </CardFooter>
    </Card>
  ))}
</Grid>

            </TabPanel>

            <TabPanel>
              <Heading size="md" mb={4}>
                My Orders
              </Heading>
              {!token ? (
                <Text>Please login to view your orders</Text>
              ) : (
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Order ID</Th>
                        <Th>Seller</Th>
                        <Th>Amount</Th>
                        <Th>Status</Th>
                        <Th>Date</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {orders.map((order) => (
                        <Tr key={order._id}>
                          <Td>{order._id.slice(-8)}</Td>
                          <Td>{order.sellerId?.name}</Td>
                          <Td>₹{order.totalAmount}</Td>
                          <Td>
                            <Badge colorScheme={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </Td>
                          <Td>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              )}
            </TabPanel>

            {cart.length > 0 && (
              <TabPanel>
                <Flex mb={4}>
                  <Heading size="md">Shopping Cart</Heading>
                  <Spacer />
                  <Button colorScheme="green" onClick={onOrderOpen}>
                    Place Order
                  </Button>
                </Flex>

                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Product</Th>
                        <Th>Seller</Th>
                        <Th>Price</Th>
                        <Th>Quantity</Th>
                        <Th>Total</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {cart.map((item) => (
                        <Tr key={item.productId}>
                          <Td>{item.name}</Td>
                          <Td>{item.sellerName}</Td>
                          <Td>₹{item.price}</Td>
                          <Td>
                            <NumberInput
                              size="sm"
                              maxW={20}
                              value={item.quantity}
                              onChange={(value) =>
                                updateCartQuantity(item.productId, value)
                              }
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </Td>
                          <Td>₹{item.price * item.quantity}</Td>
                          <Td>
                            <Button
                              size="sm"
                              colorScheme="red"
                              onClick={() => removeFromCart(item.productId)}
                            >
                              Remove
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>

                <Box mt={4} p={4} bg="gray.50" borderRadius="md">
                  <Text fontSize="xl" fontWeight="bold">
                    Total Amount: ₹{totalCartAmount}
                  </Text>
                </Box>
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>

        {/* Place Order Modal */}
        <Modal isOpen={isOrderOpen} onClose={onOrderClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Place Order</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text mb={4}>Review your order:</Text>
              {cart.map((item) => (
                <Box
                  key={item.productId}
                  p={2}
                  borderBottom="1px"
                  borderColor="gray.200"
                >
                  <Text fontWeight="bold">{item.name}</Text>
                  <Text fontSize="sm" color="gray.600">
                    Seller: {item.sellerName} | Qty: {item.quantity} | Price: ₹
                    {item.price * item.quantity}
                  </Text>
                </Box>
              ))}
              <Divider my={4} />
              <Text fontSize="xl" fontWeight="bold">
                Total Amount: ₹{totalCartAmount}
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onOrderClose}>
                Cancel
              </Button>
              <Button colorScheme="green" onClick={placeOrder}>
                Place Order
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
      <Footer />
    </>
  );
};

export default B2BMarketplace;
