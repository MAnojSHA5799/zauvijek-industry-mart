import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Button,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Kaushik/Navbar";
import Footer from "../Kaushik/Footer";

const NotificationsTable = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false); // ✅ track SDK
  const navigate = useNavigate();

  // ✅ Load Razorpay SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      console.log("Razorpay SDK loaded");
      setRazorpayLoaded(true);
    };
    script.onerror = () => console.error("Razorpay SDK failed to load");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://zauvijek-industry-mart.onrender.com/seller/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" h="80vh">
        <Spinner size="xl" color="blue.500" />
      </Box>
    );

  async function handlePayment(notification) {
    if (!razorpayLoaded) {
      alert("Razorpay SDK not loaded yet. Please try again in a few seconds.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `https://zauvijek-industry-mart.onrender.com/seller/pay-2percent/${notification._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { order } = res.data;

      const options = {
        key: 'rzp_test_jXtU63C342FF9B',
        amount: order.amount,
        currency: order.currency,
        name: "Zauvijek MetalX Mart",
        description: notification.productDetails.name,
        order_id: order.id,
        handler: async function (response) {
          await axios.post(
            `https://zauvijek-industry-mart.onrender.com/seller/confirm-payment/${notification._id}`,
            { razorpayPaymentId: response.razorpay_payment_id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          alert("Payment successful!");
          window.location.reload();
        },
        prefill: {
          name: notification.buyerDetails?.name,
          email: notification.buyerDetails?.email,
          contact: '7860544872',
        },
        theme: { color: "#606FC4" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Payment failed. Try again.");
    }
  }

  return (
    <>
      <Navbar />

      <Box mt={20} p={6} overflowX="auto">
        {notifications.length === 0 ? (
          <Box textAlign="center" mt={10}>
            <Text fontSize="lg" color="gray.600">
              No Notifications Found
            </Text>
          </Box>
        ) : (
          <Table variant="striped" colorScheme="blue" borderRadius="lg" shadow="md">
            <Thead bg="blue.100">
              <Tr>
                <Th>Message</Th>
                <Th>Date</Th>
                <Th>Buyer Name</Th>
                <Th>Buyer Email</Th>
                <Th>Buyer Phone</Th>
                <Th textAlign="center">Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {notifications.map((n) => {
                const hasPaid = n.productDetails?.pricePaidPercent >= 2;

                return (
                  <Tr key={n._id}>
                    <Td>{n.message}</Td>
                    <Td>{new Date(n.createdAt).toLocaleString()}</Td>

                    {hasPaid ? (
                      <>
                        <Td>{n.buyerDetails?.name || "N/A"}</Td>
                        <Td>{n.buyerDetails?.email || "N/A"}</Td>
                        <Td>{n.buyerDetails?.phone || "N/A"}</Td>
                      </>
                    ) : (
                      <Td colSpan={3} textAlign="center">
                        <Text color="gray.500">Payment pending</Text>
                      </Td>
                    )}

                    <Td textAlign="center">
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => navigate(`/notifications/${n._id}`)}
                        mr={2}
                      >
                        View
                      </Button>
                      {!hasPaid && n.type === "payment" && (
                        <Button size="sm" colorScheme="green" onClick={() => handlePayment(n)}>
                          Pay 2%
                        </Button>
                      )}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        )}
      </Box>

      <Footer />
    </>
  );
};

export default NotificationsTable;
