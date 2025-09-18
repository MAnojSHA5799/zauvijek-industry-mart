import React, { useState, useEffect } from 'react';
import axios from "axios";
import {
  Box,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
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
  Flex,
  Spacer
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import Navbar from '../Kaushik/Navbar';
import Footer from '../Kaushik/Footer';
import ProductModal from './ProductModal';
const SellerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOrderOpen, onOpen: onOrderOpen, onClose: onOrderClose } = useDisclosure();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const toast = useToast();

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    brand: '',
    minOrderQuantity: 1,
    maxOrderQuantity: 1000,
    image: null   // 🔹 image ke liye
  });

  const token = JSON.parse(localStorage.getItem('token'));
  const userDetails = JSON.parse(localStorage.getItem('userDetails'));

  useEffect(() => {
    // Check if user is seller
    if (userDetails?.role !== 'seller') {
      toast({
        title: 'Access Denied',
        description: 'Only sellers can access this page',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    fetchDashboardData();
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:4000/seller/dashboard', {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        console.error('Failed to fetch dashboard data:', response.status);
        toast({
          title: 'Access Denied',
          description: 'You do not have seller privileges',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:4000/seller/products', {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:4000/seller/orders', {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // const handleAddProduct = async (e) => {
  //   e.preventDefault();
  
  //   try {
  //     const formData = new FormData();
  //     formData.append("name", productForm.name);
  //     formData.append("description", productForm.description);
  //     formData.append("price", productForm.price);
  //     formData.append("stock", productForm.stock);
  //     formData.append("category", productForm.category);
  //     formData.append("brand", productForm.brand);
  //     formData.append("minOrderQuantity", productForm.minOrderQuantity);
  //     formData.append("maxOrderQuantity", productForm.maxOrderQuantity);
  //     if (productForm.image) {
  //       formData.append("image", productForm.image);
  //     }
  //     console.log("182",formData)
  
  //     const response = await fetch("http://localhost:4000/seller/products", {
  //       method: "POST",
  //       headers: {
  //         Authorization: token, // 🔹 sirf auth bhejna hai, Content-Type nahi
  //       },
  //       body: formData,
  //     });
  
  //     const data = await response.json();
  
  //     if (response.ok) {
  //       toast({
  //         title: "Product Added",
  //         description: "Product has been added successfully",
  //         status: "success",
  //         duration: 3000,
  //         isClosable: true,
  //       });
  //       fetchProducts();
  //       onClose();
  
  //       setProductForm({
  //         name: '',
  //         description: '',
  //         price: '',
  //         stock: '',
  //         category: '',
  //         brand: '',
  //         minOrderQuantity: 1,
  //         maxOrderQuantity: 1000,
  //         image: null
  //       });
  //     } else {
  //       throw new Error(data.message);
  //     }
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: error.message,
  //       status: "error",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //   }
  // };
  

  // const handleAddProduct = async (e) => {
  //   e.preventDefault();
  
  //   try {
  //     const formData = new FormData();
  //     formData.append("name", productForm.name);
  //     formData.append("description", productForm.description);
  //     formData.append("price", productForm.price);
  //     formData.append("stock", productForm.stock);
  //     formData.append("category", productForm.category);
  //     formData.append("brand", productForm.brand);
  //     formData.append("minOrderQuantity", productForm.minOrderQuantity);
  //     formData.append("maxOrderQuantity", productForm.maxOrderQuantity);
  
  //     // 🔹 Image
  //     if (productForm.image) {
  //       formData.append("image", productForm.image);
  //     }
  
  //     // 🔹 Features (array → JSON string)
  //     if (productForm.features?.length > 0) {
  //       formData.append("features", JSON.stringify(productForm.features));
  //     }
  
  //     // 🔹 Specifications (object → JSON string)
  //     if (productForm.specifications) {
  //       formData.append("specifications", JSON.stringify(productForm.specifications));
  //     }
  
  //     const response = await fetch("http://localhost:4000/seller/products", {
  //       method: "POST",
  //       headers: {
  //         Authorization: token, // ✅ sirf auth header bhejna hai
  //       },
  //       body: formData,
  //     });
  
  //     const data = await response.json();
  
  //     if (response.ok) {
  //       toast({
  //         title: "Product Added",
  //         description: "Product has been added successfully",
  //         status: "success",
  //         duration: 3000,
  //         isClosable: true,
  //       });
  
  //       fetchProducts();
  //       onClose();
  
  //       // Reset form
  //       setProductForm({
  //         name: "",
  //         description: "",
  //         price: "",
  //         stock: "",
  //         category: "",
  //         brand: "",
  //         features: [],
  //         specifications: {
  //           product: "",
  //           specification: "",
  //           size: "",
  //           packing: "",
  //           origin: "",
  //         },
  //         minOrderQuantity: 1,
  //         maxOrderQuantity: 1000,
  //         image: null,
  //       });
  //     } else {
  //       throw new Error(data.message);
  //     }
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: error.message,
  //       status: "error",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //   }
  // };

  const handleAddProduct = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
      formData.append("name", productForm.name);
      formData.append("description", productForm.description);
      formData.append("price", productForm.price);
      formData.append("stock", productForm.stock);
      formData.append("category", productForm.category);
      formData.append("brand", productForm.brand);
      formData.append("minOrderQuantity", productForm.minOrderQuantity);
      formData.append("maxOrderQuantity", productForm.maxOrderQuantity);
  
      // 🔹 Condition (New, Refurbished, Resale)
      if (productForm.condition) {
        formData.append("condition", productForm.condition);
      }
  
      // 🔹 Image
      if (productForm.image) {
        formData.append("image", productForm.image);
      }
  
      // 🔹 Features (array → JSON string)
      if (productForm.features?.length > 0) {
        formData.append("features", JSON.stringify(productForm.features));
      }
  
      // 🔹 Specifications (object → JSON string)
      if (productForm.specifications) {
        formData.append("specifications", JSON.stringify(productForm.specifications));
      }
  
      const response = await fetch("http://localhost:4000/seller/products", {
        method: "POST",
        headers: {
          Authorization: token, // ✅ only auth header
        },
        body: formData,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast({
          title: "Product Added",
          description: "Product has been added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
  
        fetchProducts();
        onClose();
  
        // Reset form
        setProductForm({
          name: "",
          description: "",
          price: "",
          stock: "",
          category: "",
          brand: "",
          features: [],
          specifications: {
            product: "",
            specification: "",
            size: "",
            packing: "",
            origin: "",
          },
          minOrderQuantity: 1,
          maxOrderQuantity: 1000,
          image: null,
          condition: "", // ✅ reset condition
        });
      } else {
        throw new Error(data.message);
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
  
  

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`http://localhost:4000/seller/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      const data = await response.json();
      if (response.ok) {
        toast({
          title: 'Order Updated',
          description: 'Order status has been updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchOrders();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // ✅ Delete product function
// ✅ Delete product function with toast
const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this product?")) return;

  try {
    await axios.delete(`http://localhost:4000/seller/products/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    // ✅ Update state after delete
    setProducts((prev) => prev.filter((product) => product._id !== id));

    // ✅ Show success toast
    toast({
      title: "Product deleted",
      description: "The product has been removed successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  } catch (err) {
    console.error("Error deleting product", err);

    // ❌ Show error toast
    toast({
      title: "Error",
      description: "Failed to delete product",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }
};

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'green';
      case 'pending': return 'yellow';
      case 'rejected': return 'red';
      case 'shipped': return 'blue';
      case 'delivered': return 'green';
      default: return 'gray';
    }
  };

  // Check if user is seller
  if (userDetails?.role !== 'seller') {
    return (
      <>
        <Navbar />
        <Box p={8} textAlign="center">
          <Heading color="red.600" mb={4}>Access Denied</Heading>
          <Text fontSize="lg">Only sellers can access this page.</Text>
          <Text fontSize="md" color="gray.600" mt={2}>
            If you want to become a seller, please register as a seller account.
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
      <Box p={8} mt={10} maxW="1200px" mx="auto">
        <Heading mb={6} color="green.600">Seller Dashboard</Heading>
        
        {/* Dashboard Stats */}
        {dashboardData && (
          <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6} mb={8}>
            <GridItem>
              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Total Products</StatLabel>
                    <StatNumber>{dashboardData.summary.totalProducts}</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      {dashboardData.summary.approvedProducts} approved
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem>
              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Pending Products</StatLabel>
                    <StatNumber>{dashboardData.summary.pendingProducts}</StatNumber>
                    <StatHelpText>Awaiting approval</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem>
              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Total Orders</StatLabel>
                    <StatNumber>{dashboardData.summary.totalOrders}</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      {dashboardData.summary.pendingOrders} pending
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem>
              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Shipped Orders</StatLabel>
                    <StatNumber>{dashboardData.summary.shippedOrders}</StatNumber>
                    <StatHelpText>In transit</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        )}

        <Tabs>
          <TabList>
            <Tab>Products</Tab>
            <Tab>Orders</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Flex mb={4}>
                <Heading size="md">My Products</Heading>
                <Spacer />
                <Button leftIcon={<AddIcon />} colorScheme="green" onClick={onOpen}>
                  Add Product
                </Button>
              </Flex>

              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Category</Th>
                      <Th>Price</Th>
                      <Th>Stock</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {products.map((product) => (
                      <Tr key={product._id}>
                        <Td>{product.name}</Td>
                        <Td>{product.category}</Td>
                        <Td>₹{product.price}</Td>
                        <Td>{product.stock}</Td>
                        <Td>
                          <Badge colorScheme={getStatusColor(product.status)}>
                            {product.status}
                          </Badge>
                        </Td>
                        <Td>
                          <Button size="sm" mr={2}>
                            <EditIcon />
                          </Button>
                          <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDelete(product._id)}
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

            <TabPanel>
              <Heading size="md" mb={4}>Recent Orders</Heading>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Order ID</Th>
                      <Th>Buyer</Th>
                      <Th>Amount</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {orders.map((order) => (
                      <Tr key={order._id}>
                        <Td>{order._id.slice(-8)}</Td>
                        <Td>{order.buyerId?.name}</Td>
                        <Td>₹{order.totalAmount}</Td>
                        <Td>
                          <Badge colorScheme={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </Td>
                        <Td>
                          {order.status === 'pending' && (
                            <Button 
                              size="sm" 
                              colorScheme="blue" 
                              onClick={() => handleUpdateOrderStatus(order._id, 'confirmed')}
                            >
                              Confirm
                            </Button>
                          )}
                          {order.status === 'confirmed' && (
                            <Button 
                              size="sm" 
                              colorScheme="green" 
                              onClick={() => handleUpdateOrderStatus(order._id, 'shipped')}
                            >
                              Ship
                            </Button>
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Add Product Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Product</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handleAddProduct}>
              <ModalBody>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <FormControl isRequired>
                    <FormLabel>Product Name</FormLabel>
                    <Input
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Category</FormLabel>
                    <Select
                      value={productForm.category}
                      onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    >
                     <option value="">Select Category</option>
<option value="electronics">Electronics</option>
<option value="clothing">Clothing</option>
<option value="home">Home & Garden</option>
<option value="sports">Sports</option>
<option value="books">Books</option>
<option value="automotive">Automotive</option>
<option value="machinery">Machinery & Manufacturing</option>
<option value="steel">Steel Scrap</option>
<option value="agriculture">Agriculture & Heavy Equipment</option>
<option value="aerospace">Aerospace</option>
<option value="defense">Defense</option>
<option value="household">Household & Consumer</option>

                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Price (₹)</FormLabel>
                    <NumberInput
                      value={productForm.price}
                      onChange={(value) => setProductForm({...productForm, price: value})}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Stock</FormLabel>
                    <NumberInput
                      value={productForm.stock}
                      onChange={(value) => setProductForm({...productForm, stock: value})}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Brand</FormLabel>
                    <Input
                      value={productForm.brand}
                      onChange={(e) => setProductForm({...productForm, brand: e.target.value})}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Min Order Quantity</FormLabel>
                    <NumberInput
                      value={productForm.minOrderQuantity}
                      onChange={(value) => setProductForm({...productForm, minOrderQuantity: value})}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </Grid>
                <FormControl isRequired mt={4}>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    rows={4}
                  />
                </FormControl>
                <FormControl mt={4}>
  <FormLabel>Features</FormLabel>
  <Textarea
    placeholder="Enter features separated by commas (e.g., Flammable, Insoluble in water)"
    value={productForm.features}
    onChange={(e) =>
      setProductForm({ ...productForm, features: e.target.value })
    }
    rows={3}
  />
</FormControl>

<FormControl mt={4}>
  <FormLabel>Specifications</FormLabel>
  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
    <Input
      placeholder="Product"
      value={productForm.specifications?.product || ""}
      onChange={(e) =>
        setProductForm({
          ...productForm,
          specifications: { ...productForm.specifications, product: e.target.value },
        })
      }
    />
    <Input
      placeholder="Specification"
      value={productForm.specifications?.specification || ""}
      onChange={(e) =>
        setProductForm({
          ...productForm,
          specifications: { ...productForm.specifications, specification: e.target.value },
        })
      }
    />
    <Input
      placeholder="Size"
      value={productForm.specifications?.size || ""}
      onChange={(e) =>
        setProductForm({
          ...productForm,
          specifications: { ...productForm.specifications, size: e.target.value },
        })
      }
    />
    <Input
      placeholder="Packing"
      value={productForm.specifications?.packing || ""}
      onChange={(e) =>
        setProductForm({
          ...productForm,
          specifications: { ...productForm.specifications, packing: e.target.value },
        })
      }
    />
    <Input
      placeholder="Origin"
      value={productForm.specifications?.origin || ""}
      onChange={(e) =>
        setProductForm({
          ...productForm,
          specifications: { ...productForm.specifications, origin: e.target.value },
        })
      }
    />
  </Grid>
</FormControl>
<FormControl isRequired>
  <FormLabel>Condition</FormLabel>
  <Select
    value={productForm.condition}
    onChange={(e) =>
      setProductForm({ ...productForm, condition: e.target.value })
    }
  >
    <option value="">Select Condition</option>
    <option value="New">New</option>
    <option value="Refurbished">Refurbished</option>
    <option value="Resale">Resale</option>
  </Select>
</FormControl>

                <FormControl mt={4} isRequired>
  <FormLabel>Product Image</FormLabel>
  <Input
    type="file"
    accept="image/*"
    onChange={(e) => setProductForm({...productForm, image: e.target.files[0]})}
  />
</FormControl>


              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" colorScheme="green">
                  Add Product
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </Box>
      <Footer />
    </>
  );
};

export default SellerDashboard;
