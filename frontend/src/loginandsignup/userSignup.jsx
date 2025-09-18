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
} from "@chakra-ui/react";

import { Link } from "react-router-dom";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Kaushik/Navbar";
import Footer from "../Kaushik/Footer";

const initdata = {
  name: "",
  email: "",
  password: "",
  username: "",
  phone: "",
  gender: "",
  role: "buyer",
};

const signup = async (data) => {
  try {
    const res = await fetch("https://zauvijek-industry-mart.onrender.com/user/register", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    return { message: "Server error" };
  }
};

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setdata] = useState(initdata);
  const toast = useToast();
  const navigate = useNavigate();

  const handlechange = (e) => {
    const { name, value } = e.target;
    setdata({ ...data, [name]: value });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    const res = await signup(data);
    if (res.message) {
      toast({
        title: res.message,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      navigate("/login");
    }
    setdata(initdata);
  };

  const { name, email, password, username, gender, phone, role } = data;

  return (
    <>
      <Navbar />
      <Flex  mt="3%" minH="100vh" bg="gray.50" direction={{ base: "column", md: "row" }} align="stretch">
        {/* Left Side Image */}
        <Box flex="1" display={{ base: "none", md: "block" }} position="relative">
          <Image
            src="/as.jpg"
            alt="Signup Illustration"
            objectFit="cover"
            h="100%"
            w="100%"
          />
          <Box
            position="absolute"
            top="0"
            left="0"
            w="100%"
            h="100%"
            bg="linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.1))"
          />
        </Box>

        {/* Right Side Signup Form */}
        <Flex flex="1" align="center" justify="center" p={8} bg="gray.60">
          <Box w="100%" maxW="md" bg="white" p={8} rounded="sm" 
          // boxShadow="sm"
          >
            <Stack textAlign="center" mb={6}>
              <Heading fontSize="3xl" color="#606FC4">
                Create Your Account
              </Heading>
              <Text fontSize="1xl" color="gray.600">
                Welcome to Zauvijek MetalX Mart
              </Text>
            </Stack>

            <form onSubmit={handlesubmit}>
              <Stack spacing={4}>
                {/* Name + User Name */}
                <HStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel color="black">Name</FormLabel>
                    <Input
                      type="text"
                      value={username}
                      name="username"
                      onChange={handlechange}
                      color="black"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color="black">User Name</FormLabel>
                    <Input
                      type="text"
                      value={name}
                      name="name"
                      onChange={handlechange}
                      color="black"
                    />
                  </FormControl>
                </HStack>

                {/* Phone + Gender */}
                <HStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel color="black">Phone</FormLabel>
                    <Input
                      type="number"
                      value={phone}
                      name="phone"
                      onChange={handlechange}
                      color="black"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color="black">Gender</FormLabel>
                    <Select
                      placeholder="Select gender"
                      value={gender}
                      name="gender"
                      onChange={handlechange}
                      color="black"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Select>
                  </FormControl>
                </HStack>

                {/* Email + Password */}
                <HStack spacing={4}>
                  <FormControl id="email" isRequired>
                    <FormLabel>Email address</FormLabel>
                    <Input
                      type="email"
                      value={email}
                      name="email"
                      onChange={handlechange}
                      color="black"
                    />
                  </FormControl>

                  <FormControl id="password" isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        name="password"
                        onChange={handlechange}
                        color="black"
                      />
                      <InputRightElement h="full">
                        <Button variant="ghost" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                </HStack>

                {/* Account Type */}
                <FormControl isRequired>
                  <FormLabel color="black">Account Type</FormLabel>
                  <RadioGroup value={role} onChange={(value) => setdata({ ...data, role: value })}>
                    <Stack direction="row" spacing={4}>
                      <Radio value="buyer" colorScheme="blue">
                        Buyer
                      </Radio>
                      <Radio value="seller" colorScheme="green">
                        Seller
                      </Radio>
                    </Stack>
                  </RadioGroup>
                  <Text fontSize="sm" color="gray.600" mt={1}>
                    {role === "buyer"
                      ? "Browse and purchase products"
                      : "Sell your products (requires admin approval)"}
                  </Text>
                </FormControl>

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  w="full"
                  borderRadius="full"
                  bg="#606FC4"
                  color="white"
                  _hover={{ bg: "#4a55a1" }}
                >
                  Register
                </Button>

                <Text align="center" color="black" fontWeight="bold">
                  Already have an account?{" "}
                  <Link to="/login" style={{ color: "#606FC4" }}>
                    Login
                  </Link>
                </Text>
              </Stack>
            </form>
          </Box>
        </Flex>
      </Flex>

      <Footer />
    </>
  );
}
