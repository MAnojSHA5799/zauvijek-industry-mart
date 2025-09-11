import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  Heading,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Spacer,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import {
  SearchIcon,
  CheckIcon,
  CloseIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import Navbar from "../Kaushik/Navbar";
import Footer from "../Kaushik/Footer";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userFilter, setUserFilter] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const toast = useToast();

  const token = JSON.parse(localStorage.getItem("token"));
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));

  useEffect(() => {
    if (userDetails?.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "Only administrators can access this page",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    fetchDashboardData();
    fetchUsers();
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("https://zauvijek-industry-mart.onrender.com/admin/dashboard", {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("https://zauvijek-industry-mart.onrender.com/admin/users", {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://zauvijek-industry-mart.onrender.com/admin/products", {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch {
      setProducts([]);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("https://zauvijek-industry-mart.onrender.com/admin/orders", {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch {
      setOrders([]);
    }
  };

  const handleUserStatusUpdate = async (userId, status) => {
    try {
      const response = await fetch(
        `https://zauvijek-industry-mart.onrender.com/admin/users/${userId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        toast({
          title: "User Status Updated",
          description: `User status has been updated to ${status}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchUsers();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleProductStatusUpdate = async (productId, status) => {
    try {
      const response = await fetch(
        `https://zauvijek-industry-mart.onrender.com/admin/products/${productId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        toast({
          title: "Product Status Updated",
          description: `Product status has been updated to ${status}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchProducts();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(
          `https://zauvijek-industry-mart.onrender.com/admin/users/${userId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          toast({
            title: "User Deleted",
            description: "User has been deleted successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          fetchUsers();
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(
          `https://zauvijek-industry-mart.onrender.com/admin/products/${productId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          toast({
            title: "Product Deleted",
            description: "Product has been deleted successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          fetchProducts();
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
      case "delivered":
        return "green";
      case "pending":
        return "yellow";
      case "rejected":
      case "blocked":
        return "red";
      case "shipped":
        return "blue";
      default:
        return "gray";
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(userFilter.toLowerCase()) ||
      user.email.toLowerCase().includes(userFilter.toLowerCase()) ||
      user.role.toLowerCase().includes(userFilter.toLowerCase())
  );

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(productFilter.toLowerCase()) ||
      product.category.toLowerCase().includes(productFilter.toLowerCase()) ||
      product.status.toLowerCase().includes(productFilter.toLowerCase())
  );

  if (userDetails?.role !== "admin") {
    return (
      <>
        <Navbar />
        <Box p={8} textAlign="center">
          <Heading color="red.600" mb={4}>
            Access Denied
          </Heading>
          <Text fontSize="lg">
            Only administrators can access this page.
          </Text>
        </Box>
        <Footer />
      </>
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <Box
        p={8}
        mt={10}
        maxW="1400px"
        mx="auto"
        bgGradient="linear(to-r, gray.50, white)"
        borderRadius="2xl"
        boxShadow="xl"
      >
        <Heading mb={6} color="teal.600" textAlign="center">
          Admin Dashboard
        </Heading>

        {/* Stats */}
        {dashboardData && dashboardData.summary && (
          <Grid
            templateColumns="repeat(auto-fit, minmax(250px, 1fr))"
            gap={6}
            mb={8}
          >
            {[
              {
                label: "Total Users",
                value: dashboardData.summary.users?.total || 0,
                help: `${dashboardData.summary.users?.buyers || 0} buyers, ${
                  dashboardData.summary.users?.sellers || 0
                } sellers`,
                gradient: "linear(to-r, teal.100, teal.300)",
              },
              {
                label: "Pending Sellers",
                value: dashboardData.summary.users?.pendingSellers || 0,
                help: "Awaiting approval",
                gradient: "linear(to-r, orange.100, orange.300)",
              },
              {
                label: "Total Products",
                value: dashboardData.summary.products?.total || 0,
                help: `${dashboardData.summary.products?.pending || 0} pending approval`,
                gradient: "linear(to-r, purple.100, purple.300)",
              },
              {
                label: "Total Orders",
                value: dashboardData.summary.orders?.total || 0,
                help: `${dashboardData.summary.orders?.completed || 0} completed`,
                gradient: "linear(to-r, pink.100, pink.300)",
              },
            ].map((stat, i) => (
              <GridItem key={i}>
                <Card
                  bgGradient={stat.gradient}
                  borderRadius="xl"
                  boxShadow="lg"
                  _hover={{ transform: "scale(1.03)", transition: "0.3s" }}
                >
                  <CardBody>
                    <Stat>
                      <StatLabel fontWeight="bold" color="gray.700">
                        {stat.label}
                      </StatLabel>
                      <StatNumber fontSize="2xl">{stat.value}</StatNumber>
                      <StatHelpText>{stat.help}</StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>
              </GridItem>
            ))}
          </Grid>
        )}

        {/* Tabs */}
        <Tabs variant="enclosed-colored" colorScheme="teal">
          <TabList>
            <Tab _selected={{ color: "white", bg: "teal.500" }}>Users</Tab>
            <Tab _selected={{ color: "white", bg: "purple.500" }}>
              Products
            </Tab>
            <Tab _selected={{ color: "white", bg: "orange.500" }}>
              Orders
            </Tab>
          </TabList>

          <TabPanels>
            {/* Users */}
            <TabPanel>
              <Flex mb={4}>
                <Heading size="md">User Management</Heading>
                <Spacer />
                <InputGroup maxW="300px">
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.300" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search users..."
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                  />
                </InputGroup>
              </Flex>

              <TableContainer>
                <Table variant="striped" colorScheme="teal" size="md">
                  <Thead bg="teal.100">
                    <Tr>
                      <Th>Name</Th>
                      <Th>Email</Th>
                      <Th>Role</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredUsers.map((user) => (
                      <Tr key={user._id} _hover={{ bg: "gray.50" }}>
                        <Td>{user.name}</Td>
                        <Td>{user.email}</Td>
                        <Td>
                          <Badge
                            colorScheme={
                              user.role === "admin"
                                ? "red"
                                : user.role === "seller"
                                ? "green"
                                : "blue"
                            }
                          >
                            {user.role}
                          </Badge>
                        </Td>
                        <Td>
                          <Badge colorScheme={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </Td>
                        <Td>
                          {user.role !== "admin" && (
                            <>
                              {user.status === "pending" && (
                                <Button
                                  size="sm"
                                  bgGradient="linear(to-r, green.400, green.600)"
                                  color="white"
                                  mr={2}
                                  onClick={() =>
                                    handleUserStatusUpdate(user._id, "approved")
                                  }
                                  _hover={{ transform: "scale(1.05)" }}
                                >
                                  <CheckIcon />
                                </Button>
                              )}
                              {user.status === "approved" && (
                                <Button
                                  size="sm"
                                  bgGradient="linear(to-r, red.400, red.600)"
                                  color="white"
                                  mr={2}
                                  onClick={() =>
                                    handleUserStatusUpdate(user._id, "blocked")
                                  }
                                  _hover={{ transform: "scale(1.05)" }}
                                >
                                  <CloseIcon />
                                </Button>
                              )}
                              {user.status === "blocked" && (
                                <Button
                                  size="sm"
                                  bgGradient="linear(to-r, green.400, green.600)"
                                  color="white"
                                  mr={2}
                                  onClick={() =>
                                    handleUserStatusUpdate(user._id, "approved")
                                  }
                                  _hover={{ transform: "scale(1.05)" }}
                                >
                                  <CheckIcon />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                colorScheme="red"
                                variant="outline"
                                onClick={() => handleDeleteUser(user._id)}
                              >
                                <DeleteIcon />
                              </Button>
                            </>
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </TabPanel>

            {/* Products */}
            <TabPanel>
              <Flex mb={4}>
                <Heading size="md">Product Management</Heading>
                <Spacer />
                <InputGroup maxW="300px">
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.300" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search products..."
                    value={productFilter}
                    onChange={(e) => setProductFilter(e.target.value)}
                  />
                </InputGroup>
              </Flex>

              <TableContainer>
                <Table variant="striped" colorScheme="purple" size="md">
                  <Thead bg="purple.100">
                    <Tr>
                      <Th>Name</Th>
                      <Th>Category</Th>
                      <Th>Price</Th>
                      <Th>Seller</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredProducts.map((product) => (
                      <Tr key={product._id} _hover={{ bg: "gray.50" }}>
                        <Td>{product.name}</Td>
                        <Td>{product.category}</Td>
                        <Td>₹{product.price}</Td>
                        <Td>{product.sellerId?.name}</Td>
                        <Td>
                          <Badge colorScheme={getStatusColor(product.status)}>
                            {product.status}
                          </Badge>
                        </Td>
                        <Td>
                          {product.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                bgGradient="linear(to-r, green.400, green.600)"
                                color="white"
                                mr={2}
                                onClick={() =>
                                  handleProductStatusUpdate(
                                    product._id,
                                    "approved"
                                  )
                                }
                              >
                                <CheckIcon />
                              </Button>
                              <Button
                                size="sm"
                                bgGradient="linear(to-r, red.400, red.600)"
                                color="white"
                                mr={2}
                                onClick={() =>
                                  handleProductStatusUpdate(
                                    product._id,
                                    "rejected"
                                  )
                                }
                              >
                                <CloseIcon />
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            colorScheme="red"
                            variant="outline"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            <DeleteIcon />
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </TabPanel>

            {/* Orders */}
            <TabPanel>
              <Heading size="md" mb={4}>
                All Orders
              </Heading>
              <TableContainer>
                <Table variant="striped" colorScheme="orange" size="md">
                  <Thead bg="orange.100">
                    <Tr>
                      <Th>Order ID</Th>
                      <Th>Buyer</Th>
                      <Th>Seller</Th>
                      <Th>Amount</Th>
                      <Th>Status</Th>
                      <Th>Date</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {orders.map((order) => (
                      <Tr key={order._id} _hover={{ bg: "gray.50" }}>
                        <Td>{order._id.slice(-8)}</Td>
                        <Td>{order.buyerId?.name}</Td>
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
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <Footer />
    </>
  );
};

export default AdminDashboard;
