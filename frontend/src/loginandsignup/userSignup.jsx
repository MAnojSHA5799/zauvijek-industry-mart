import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  HStack,
  Stack,
  Button,
  Heading,
  Text,
  useToast,
  Select,
  RadioGroup,
  Radio,
  Image,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Kaushik/Navbar";
import Footer from "../Kaushik/Footer";

const initdata = {
  name: "",
  username: "",
  email: "",
  password: "",
  phone: "",
  gender: "",
  role: "buyer",
  companyName: "",
  gstNumber: "",
  warehouseLocation: "",
  productCategories: "",
  interests: "",
  preferredLocation: "",
  aadharNumber: "",
  panNumber: "",
  newsletter: false,
  terms: false,
};

const signup = async (data) => {
  try {
    const res = await fetch("https://zauvijek-industry-mart.onrender.com/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    return { message: "Server error" };
  }
};

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState(initdata);
  const [step, setStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  const planAmounts = {
    monthly: 19900,
    threeMonth: 49900,
    sixMonth: 89900,
    yearly: 149900,
  };

  // Load Razorpay script
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => setRazorpayLoaded(true);
      script.onerror = () => console.error("Razorpay SDK failed to load");
      document.body.appendChild(script);
      return () => document.body.removeChild(script);
    } else {
      setRazorpayLoaded(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData({
      ...data,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleNext = () => {
    if (validateStep(step)) setStep(step + 1);
  };
  const handlePrev = () => setStep(step - 1);

  const validateStep = (currentStep) => {
    let valid = true;
    if (currentStep === 0) {
      if (
        !data.name ||
        !data.username ||
        !data.email ||
        !data.password ||
        !data.phone ||
        !data.gender ||
        !data.aadharNumber ||
        !data.panNumber
      ) {
        toast({ title: "Please fill all required fields in Step 1", status: "error", duration: 2000, isClosable: true });
        valid = false;
      }
    } else if (currentStep === 1) {
      if (data.role === "seller") {
        if (!data.companyName || !data.gstNumber || !data.warehouseLocation || !data.productCategories) {
          toast({ title: "Please fill all seller fields", status: "error", duration: 2000, isClosable: true });
          valid = false;
        }
      } else {
        if (!data.interests || !data.preferredLocation) {
          toast({ title: "Please fill buyer interests and location", status: "error", duration: 2000, isClosable: true });
          valid = false;
        }
      }
    } else if (currentStep === 2) {
      if (!data.terms) {
        toast({ title: "You must accept the terms and conditions", status: "error", duration: 2000, isClosable: true });
        valid = false;
      }
    }
    return valid;
  };

  const handlePayment = async () => {
    if (!selectedPlan) {
      toast({ title: "Select a Plan", status: "warning" });
      return;
    }
    if (!razorpayLoaded || !window.Razorpay) {
      toast({ title: "Razorpay SDK not loaded", status: "error" });
      return;
    }

    try {
      setPaymentProcessing(true);

      const amount = planAmounts[selectedPlan];

      const orderRes = await fetch("https://zauvijek-industry-mart.onrender.com/user/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message);

      const options = {
        key: "rzp_test_jXtU63C342FF9B",
        amount: orderData.amount,
        currency: "INR",
        name: "Zauvijek Mart",
        description: `${selectedPlan} Plan Payment`,
        order_id: orderData.id,
        handler: function (response) {
          setPaymentSuccess(true);
          setPaymentDetails({
            plan: selectedPlan,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });
          toast({ title: "Payment Successful", description: "You can now complete registration.", status: "success" });
          onClose();
        },
        prefill: { name: data.name, email: data.email },
        theme: { color: "#606FC4" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast({ title: "Payment Failed", description: err.message, status: "error" });
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Auto-open payment modal after Step 3 if terms accepted
  useEffect(() => {
    if (step === 2 && data.terms && !paymentSuccess) {
      onOpen();
    }
  }, [step, data.terms, paymentSuccess, onOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(step)) return;
    if (!paymentSuccess) {
      toast({ title: "Complete payment first", status: "warning" });
      return;
    }

    try {
      const payload = { ...data, ...paymentDetails };
      const res = await signup(payload);
      if (res.userId) {
        toast({ title: "Registration Successful", status: "success" });
        navigate("/login");
        setData(initdata);
        setPaymentSuccess(false);
        setPaymentDetails(null);
      } else {
        toast({ title: "Registration Failed", description: res.message, status: "error" });
      }
    } catch (err) {
      toast({ title: "Error", description: err.message, status: "error" });
    }
  };

  return (
    <>
      <Navbar />
      <Flex mt="3%" minH="100vh" bg="gray.50" direction={{ base: "column", md: "row" }} align="stretch">
        <Box flex="1" display={{ base: "none", md: "block" }} position="relative">
          <Image src="/as.jpg" alt="Signup Illustration" objectFit="cover" h="100%" w="100%" />
          <Box
            position="absolute"
            top="0"
            left="0"
            w="100%"
            h="100%"
            bg="linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.1))"
          />
        </Box>

        <Flex flex="1" align="center" justify="center" p={8}>
          <Box w="100%" maxW="md" bg="white" p={8} rounded="sm">
            <Stack textAlign="center" mb={6}>
              <Heading fontSize="3xl" color="#606FC4">Create Your Account</Heading>
              <Text fontSize="1xl" color="gray.600">Welcome to Zauvijek MetalX Mart</Text>
            </Stack>

            <Tabs index={step} isFitted variant="soft-rounded" colorScheme="purple">
              <TabList mb="1em">
                <Tab>Step 1</Tab>
                <Tab>Step 2</Tab>
                <Tab>Step 3</Tab>
              </TabList>

              <form onSubmit={handleSubmit}>
                <TabPanels>
                  {/* Step 1 */}
                  <TabPanel>
                    <Stack spacing={4}>
                      <HStack spacing={4}>
                        <FormControl isRequired>
                          <FormLabel>Name</FormLabel>
                          <Input name="name" value={data.name} onChange={handleChange} />
                        </FormControl>
                        <FormControl isRequired>
                          <FormLabel>Username</FormLabel>
                          <Input name="username" value={data.username} onChange={handleChange} />
                        </FormControl>
                      </HStack>

                      <HStack spacing={4}>
                        <FormControl isRequired>
                          <FormLabel>Phone</FormLabel>
                          <Input type="number" name="phone" value={data.phone} onChange={handleChange} />
                        </FormControl>
                        <FormControl isRequired>
                          <FormLabel>Gender</FormLabel>
                          <Select name="gender" value={data.gender} onChange={handleChange}>
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </Select>
                        </FormControl>
                      </HStack>

                      <HStack spacing={4}>
                        <FormControl isRequired>
                          <FormLabel>Email</FormLabel>
                          <Input type="email" name="email" value={data.email} onChange={handleChange} />
                        </FormControl>
                        <FormControl isRequired>
                          <FormLabel>Password</FormLabel>
                          <InputGroup>
                            <Input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={data.password}
                              onChange={handleChange}
                            />
                            <InputRightElement h="full">
                              <Button variant="ghost" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                              </Button>
                            </InputRightElement>
                          </InputGroup>
                        </FormControl>
                      </HStack>

                      <FormControl isRequired>
                        <FormLabel>Account Type</FormLabel>
                        <RadioGroup
                          value={data.role}
                          onChange={(value) => setData({ ...data, role: value })}
                        >
                          <HStack spacing={4}>
                            <Radio value="buyer" colorScheme="blue">Buyer</Radio>
                            <Radio value="seller" colorScheme="green">Seller</Radio>
                            <Radio value="betauction" colorScheme="purple">Bet Auction</Radio>
                          </HStack>
                        </RadioGroup>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Aadhar Number</FormLabel>
                        <Input type="number" name="aadharNumber" value={data.aadharNumber} onChange={handleChange} />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>PAN Number</FormLabel>
                        <Input name="panNumber" value={data.panNumber} onChange={handleChange} />
                      </FormControl>

                      <Button colorScheme="purple" mt={4} onClick={handleNext}>Next</Button>
                    </Stack>
                  </TabPanel>

                  {/* Step 2 */}
                  <TabPanel>
                    {data.role === "buyer" ? (
                      <Stack spacing={4}>
                        <FormControl isRequired>
                          <FormLabel>Interests / Categories</FormLabel>
                          <Input name="interests" value={data.interests} onChange={handleChange} placeholder="e.g. Steel, Aluminum" />
                        </FormControl>
                        <FormControl>
                          <Checkbox name="newsletter" isChecked={data.newsletter} onChange={handleChange}>
                            Subscribe to newsletter
                          </Checkbox>
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel>Preferred Location</FormLabel>
                          <Input name="preferredLocation" value={data.preferredLocation} onChange={handleChange} placeholder="Enter your city or area" />
                        </FormControl>

                        <HStack spacing={4} mt={4}>
                          <Button onClick={handlePrev}>Previous</Button>
                          <Button colorScheme="purple" onClick={handleNext}>Next</Button>
                        </HStack>
                      </Stack>
                    ) : (
                      <Stack spacing={4}>
                        <FormControl isRequired>
                          <FormLabel>Company Name</FormLabel>
                          <Input name="companyName" value={data.companyName} onChange={handleChange} />
                        </FormControl>
                        <FormControl isRequired>
                          <FormLabel>GST Number</FormLabel>
                          <Input name="gstNumber" value={data.gstNumber} onChange={handleChange} />
                        </FormControl>
                        <FormControl isRequired>
                          <FormLabel>Warehouse Location</FormLabel>
                          <Input name="warehouseLocation" value={data.warehouseLocation} onChange={handleChange} />
                        </FormControl>
                        <FormControl isRequired>
                          <FormLabel>Product Categories</FormLabel>
                          <Input name="productCategories" value={data.productCategories} onChange={handleChange} />
                        </FormControl>

                        <HStack spacing={4} mt={4}>
                          <Button onClick={handlePrev}>Previous</Button>
                          <Button colorScheme="purple" onClick={handleNext}>Next</Button>
                        </HStack>
                      </Stack>
                    )}
                  </TabPanel>

                  {/* Step 3 */}
                  <TabPanel>
                    <Stack spacing={4}>
                      <FormControl isRequired>
                        <Checkbox name="terms" isChecked={data.terms} onChange={handleChange}>
                          I accept terms and conditions
                        </Checkbox>
                      </FormControl>

                      <HStack spacing={4} mt={4}>
                        <Button onClick={handlePrev}>Previous</Button>
                        <Button
                          colorScheme="purple"
                          onClick={handleSubmit}
                          isDisabled={!paymentSuccess}
                        >
                          Sign Up
                        </Button>
                      </HStack>
                    </Stack>
                  </TabPanel>
                </TabPanels>
              </form>
            </Tabs>
          </Box>
        </Flex>
      </Flex>

      {/* Plan Modal */}
      {/* Plan Modal */}
<Modal 
  isOpen={isOpen} 
  onClose={onClose}
  trapFocus={false}         // 🔑 disables focus trapping
  autoFocus={false}         // 🔑 disables autofocus
  blockScrollOnMount={false} // optional: prevents body scroll lock
>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Select a Payment Plan</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      <RadioGroup onChange={setSelectedPlan} value={selectedPlan}>
        <Stack direction="column" spacing={3}>
          <Radio value="monthly">Monthly - ₹199</Radio>
          <Radio value="threeMonth">3 Months - ₹499</Radio>
          <Radio value="sixMonth">6 Months - ₹899</Radio>
          <Radio value="yearly">Yearly - ₹1499</Radio>
        </Stack>
      </RadioGroup>
    </ModalBody>
    <ModalFooter>
      <Button 
        colorScheme="purple" 
        mr={3} 
        onClick={handlePayment} 
        isDisabled={paymentProcessing}
      >
        {paymentProcessing ? <Spinner size="sm" /> : "Pay Now"}
      </Button>
      <Button onClick={onClose}>Cancel</Button>
    </ModalFooter>
  </ModalContent>
</Modal>


      <Footer />
    </>
  );
}
