// src/components/Seller/ProductModal.jsx
import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  useToast,
} from "@chakra-ui/react";

const ProductModal = ({ isOpen, onClose, fetchProducts, token }) => {
  const toast = useToast();

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    brand: "",
    minOrderQuantity: 1,
    maxOrderQuantity: 1000,
    image: null,
  });

  // ✅ handle form submit
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
      if (productForm.image) {
        formData.append("image", productForm.image);
      }

      const response = await fetch("https://zauvijek-industry-mart.onrender.com/seller/products", {
        method: "POST",
        headers: {
          Authorization: token, // 🔹 sirf auth bhejna hai
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
          minOrderQuantity: 1,
          maxOrderQuantity: 1000,
          image: null,
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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Product</ModalHeader>
        <ModalBody>
          <form onSubmit={handleAddProduct}>
            <FormControl mb={3} isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                value={productForm.name}
                onChange={(e) =>
                  setProductForm({ ...productForm, name: e.target.value })
                }
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>Description</FormLabel>
              <Input
                value={productForm.description}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    description: e.target.value,
                  })
                }
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>Price</FormLabel>
              <Input
                type="number"
                value={productForm.price}
                onChange={(e) =>
                  setProductForm({ ...productForm, price: e.target.value })
                }
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>Stock</FormLabel>
              <Input
                type="number"
                value={productForm.stock}
                onChange={(e) =>
                  setProductForm({ ...productForm, stock: e.target.value })
                }
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Category</FormLabel>
              <Input
                value={productForm.category}
                onChange={(e) =>
                  setProductForm({ ...productForm, category: e.target.value })
                }
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Brand</FormLabel>
              <Input
                value={productForm.brand}
                onChange={(e) =>
                  setProductForm({ ...productForm, brand: e.target.value })
                }
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Min Order Quantity</FormLabel>
              <Input
                type="number"
                value={productForm.minOrderQuantity}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    minOrderQuantity: e.target.value,
                  })
                }
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Max Order Quantity</FormLabel>
              <Input
                type="number"
                value={productForm.maxOrderQuantity}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    maxOrderQuantity: e.target.value,
                  })
                }
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>Product Image</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setProductForm({ ...productForm, image: e.target.files[0] })
                }
              />
            </FormControl>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                Add
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ProductModal;
