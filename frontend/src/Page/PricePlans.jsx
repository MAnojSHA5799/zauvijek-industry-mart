// src/components/PricePlans.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Kaushik/Navbar";
import Footer from "../Kaushik/Footer";

const PricePlans = ({ user }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const plans =  [
    {
      name: "Monthly Plan",
      basePrice: 2000,
      finalPrice: 2000,
      discountAmount: 0,
      discountPercent: 0
    },
    {
      name: "Annual Plan",
      basePrice: 22000,
      finalPrice: 20000,
      discountAmount: 2000,
      discountPercent: 9.09
    },
    {
      name: "2 Year Plan",
      basePrice: 42000,
      finalPrice: 33500,
      discountAmount: 8500,
      discountPercent: 20.24
    },
    {
      name: "3 Year Plan",
      basePrice: 66000,
      finalPrice: 47500,
      discountAmount: 18500,
      discountPercent: 28.03
    }
  ]
  

  // ✅ Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => console.error("Razorpay SDK failed to load");
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    if (!selectedPlan) {
      alert("⚠️ Please select a plan first!");
      return;
    }

    if (!razorpayLoaded) {
      alert("❌ Razorpay SDK not loaded. Please try again later.");
      return;
    }

    try {
      // ✅ Create order on backend
      const { data: order } = await axios.post(
        "https://zauvijek-industry-mart.onrender.com/api/payment/create-order",
        { amount: selectedPlan.finalPrice }
      );

      // ✅ Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY || "rzp_test_jXtU63C342FF9B",
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "Zauvijek MetalX Mart Subscription",
        description: selectedPlan.name,
        handler: async function (response) {
          try {
            // ✅ Verify payment + save in DB
            const verifyRes = await axios.post(
              "https://zauvijek-industry-mart.onrender.com/api/payment/verify-payment",
              {
                userId: user?.id || user?._id,
                planName: selectedPlan.name,
                amount: selectedPlan.finalPrice,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );
            alert(verifyRes.data.message);
          } catch (err) {
            console.error("Payment verification error:", err.response || err);
            alert("❌ Payment verification failed");
          }
        },
        prefill: {
          name: user?.name || "Manoj Shakya",
          email: user?.email || "customer@example.com",
          contact: user?.contact || "7860544872",
        },
        theme: { color: "#0d9488" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      console.error("Payment initiation error:", err.response || err);
      alert("❌ Payment initiation failed");
    }
  };

  return (
    <>
      <Navbar />

      <div style={{ textAlign: "center", padding: "40px 20px", marginTop: "5%" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "10px", color: "#606FC4" }}>
        Zauvijek MetalX Mart Plans
        </h2>
        <p style={{ color: "#666", marginBottom: "40px" }}>
          Choose the best plan for your needs
        </p>

        {/* Plans Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          {plans.map((plan, index) => (
            <div
              key={index}
              onClick={() => setSelectedPlan(plan)}
              style={{
                border:
                  selectedPlan?.name === plan.name
                    ? "2px solid #0d9488"
                    : "1px solid #ddd",
                borderRadius: "12px",
                padding: "20px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                background:
                  selectedPlan?.name === plan.name ? "#f0fdfa" : "#fff",
                boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
              }}
            >
              <h3 style={{ marginBottom: "10px", color: "#0d9488",fontSize:'20px', fontWeight:'600' }}>
                {plan.name}
              </h3>
              <p
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  margin: "10px 0",
                }}
              >
                ₹{plan.finalPrice.toLocaleString()}
              </p>
              <p style={{ color: "#666" }}>{plan.duration}</p>
              {plan.discountPercent > 0 && (
                <p style={{ color: "red", fontSize: "0.9rem" }}>
                  Save {plan.discountPercent}% (₹{plan.discountAmount})
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Pay Button */}
        <div style={{ marginTop: "40px" }}>
          <button
            onClick={handlePayment}
            style={{
              padding: "12px 28px",
              background: "#0d9488",
              color: "#fff",
              fontSize: "1rem",
              fontWeight: "bold",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }}
          >
            Pay Now
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PricePlans;
