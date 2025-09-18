// src/components/AuctionForm.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  Textarea,
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
  SimpleGrid,
  Heading,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Kaushik/Navbar";
import Footer from "../Kaushik/Footer";

const AuctionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 

  const [formData, setFormData] = useState({
    title: "",
    materialGrade: "",
    quantity: "",
    unit: "kg",
    description: "",
    auctionType: "forward",
    startingPrice: "",
    bidIncrement: "",
    startDate: "",
    endDate: "",
    companyName: "",
    contactPerson: "",
    phone: "",
    email: "",
    pickupLocation: "",
    deliveryOption: "pickup",
    materialCertificate: null,
    photos: null,
    terms: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      fetch(`https://zauvijek-industry-mart.onrender.com/api/auctions/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            ...formData,
            ...data,
            startDate: data.startDate ? data.startDate.slice(0, 16) : "",
            endDate: data.endDate ? data.endDate.slice(0, 16) : "",
          });
        })
        .catch((err) => console.error(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.title) tempErrors.title = "Required";
    if (!formData.quantity) tempErrors.quantity = "Required";
    if (!formData.startingPrice) tempErrors.startingPrice = "Required";
    if (!formData.startDate) tempErrors.startDate = "Required";
    if (!formData.endDate) tempErrors.endDate = "Required";
    if (!formData.companyName) tempErrors.companyName = "Required";
    if (!formData.contactPerson) tempErrors.contactPerson = "Required";
    if (!formData.phone) tempErrors.phone = "Required";
    if (!formData.email) tempErrors.email = "Required";
    if (!formData.pickupLocation) tempErrors.pickupLocation = "Required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const form = new FormData();
        Object.keys(formData).forEach((key) => {
          if (key === "photos" || key === "materialCertificate") {
            if (formData[key]) {
              if (key === "photos") {
                Array.from(formData.photos).forEach((file) =>
                  form.append("photos", file)
                );
              } else {
                form.append(key, formData[key][0]);
              }
            }
          } else {
            form.append(key, formData[key]);
          }
        });

        let res;
        if (id) {
          res = await fetch(`https://zauvijek-industry-mart.onrender.com/api/auctions/${id}`, {
            method: "PUT",
            body: form,
          });
        } else {
          res = await fetch("https://zauvijek-industry-mart.onrender.com/api/auctions", {
            method: "POST",
            body: form,
          });
        }

        const data = await res.json();

        if (res.ok) {
          alert(id ? "Auction updated successfully!" : "Auction created successfully!");
          navigate("/auction/list");
        } else {
          alert("Error: " + data.message);
        }
      } catch (err) {
        console.error(err);
        alert("Server error. Check console.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <Box p={6} mt={20} maxW="1200px" mx="auto" bg="gray.50" borderRadius="md">
        <Heading mb={6} size="lg">
          {id ? "Edit Auction" : "Add Auction"}
        </Heading>
        <form onSubmit={handleSubmit}>
          {/* Row 1 */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
            <FormControl isRequired isInvalid={errors.title}>
              <FormLabel>Material Name</FormLabel>
              <Input name="title" value={formData.title} onChange={handleChange} />
              <FormErrorMessage>{errors.title}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Material Grade</FormLabel>
              <Select name="materialGrade" value={formData.materialGrade} onChange={handleChange}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </Select>
            </FormControl>

            <FormControl isRequired isInvalid={errors.quantity}>
              <FormLabel>Quantity</FormLabel>
              <Input type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
              <FormErrorMessage>{errors.quantity}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Unit</FormLabel>
              <Select name="unit" value={formData.unit} onChange={handleChange}>
                <option>kg</option>
                <option>ton</option>
                <option>bag</option>
              </Select>
            </FormControl>
          </SimpleGrid>

          {/* Row 2 */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mt={4}>
            <FormControl>
              <FormLabel>Auction Type</FormLabel>
              <Select name="auctionType" value={formData.auctionType} onChange={handleChange}>
                <option value="forward">Forward</option>
                <option value="backward">Backward</option>
              </Select>
            </FormControl>

            <FormControl isRequired isInvalid={errors.startingPrice}>
              <FormLabel>Starting Price</FormLabel>
              <Input type="number" name="startingPrice" value={formData.startingPrice} onChange={handleChange} />
              <FormErrorMessage>{errors.startingPrice}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Bid Increment</FormLabel>
              <Input type="number" name="bidIncrement" value={formData.bidIncrement} onChange={handleChange} />
            </FormControl>

            <FormControl isRequired isInvalid={errors.startDate}>
              <FormLabel>Start Date</FormLabel>
              <Input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleChange} />
              <FormErrorMessage>{errors.startDate}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          {/* Row 3 */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mt={4}>
            <FormControl isRequired isInvalid={errors.endDate}>
              <FormLabel>End Date</FormLabel>
              <Input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} />
              <FormErrorMessage>{errors.endDate}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={errors.companyName}>
              <FormLabel>Company Name</FormLabel>
              <Input name="companyName" value={formData.companyName} onChange={handleChange} />
              <FormErrorMessage>{errors.companyName}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={errors.contactPerson}>
              <FormLabel>Contact Person</FormLabel>
              <Input name="contactPerson" value={formData.contactPerson} onChange={handleChange} />
              <FormErrorMessage>{errors.contactPerson}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={errors.phone}>
              <FormLabel>Phone</FormLabel>
              <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
              <FormErrorMessage>{errors.phone}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          {/* Row 4 */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mt={4}>
            <FormControl isRequired isInvalid={errors.email}>
              <FormLabel>Email</FormLabel>
              <Input type="email" name="email" value={formData.email} onChange={handleChange} />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={errors.pickupLocation}>
              <FormLabel>Pickup Location</FormLabel>
              <Input name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} />
              <FormErrorMessage>{errors.pickupLocation}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Delivery Option</FormLabel>
              <Select name="deliveryOption" value={formData.deliveryOption} onChange={handleChange}>
                <option value="pickup">Pickup</option>
                <option value="delivery">Delivery</option>
              </Select>
            </FormControl>
          </SimpleGrid>

          {/* Full Width Fields */}
          <Box mt={4}>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea name="description" value={formData.description} onChange={handleChange} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Material Certificate</FormLabel>
              <Input type="file" name="materialCertificate" onChange={handleChange} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Photos</FormLabel>
              <Input type="file" name="photos" onChange={handleChange} multiple />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Terms & Conditions</FormLabel>
              <Textarea name="terms" value={formData.terms} onChange={handleChange} />
            </FormControl>
          </Box>

          <Button colorScheme="purple" type="submit" mt={6}>
            {id ? "Update Auction" : "Submit Auction"}
          </Button>
        </form>
      </Box>
      <Footer />
    </>
  );
};

export default AuctionForm;
