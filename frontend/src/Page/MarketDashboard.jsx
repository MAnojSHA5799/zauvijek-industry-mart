import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const products = [
  "CR Coil",
  "MS Loose Bundle",
  "MS Side Trim",
  "MS Packing Strip Scrap",
];

const MarketDashboard = () => {
  const [marketData, setMarketData] = useState({});
  const [auctionData, setAuctionData] = useState({});

  useEffect(() => {
    // 🔹 Sample Market Data (replace with API)
    const data = {};
    products.forEach((p) => {
      data[p] = Array.from({ length: 10 }, () =>
        25000 + Math.floor(Math.random() * 15000)
      );
    });
    setMarketData(data);

    // 🔹 Sample Auction H1/L1 Data
    const auction = {};
    products.forEach((p) => {
      auction[p] = {
        H1: Array.from({ length: 10 }, () =>
          26000 + Math.floor(Math.random() * 14000)
        ),
        L1: Array.from({ length: 10 }, () =>
          24000 + Math.floor(Math.random() * 12000)
        ),
      };
    });
    setAuctionData(auction);
  }, []);

  const colors = [
    { market: "#606FC4", h1: "#3f51b5", l1: "#90a4ff" },
    { market: "#606FC4", h1: "#ff7043", l1: "#64b5f6" },
  ];
  

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px",fontSize:"25px", fontWeight:"500", color: "#606FC4" }}>
        Market Trends Dashboard
      </h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {products.map((product, index) => (
            <div
  key={product}
  style={{
    flex: "1 1 45%",
    minWidth: "300px",
    background: "#d7dbf7", // light shade of #606FC4
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    border: "1px solidrgb(159, 164, 195)", // subtle border for primary color feel
  }}
>

            <h3 style={{ textAlign: "center", marginBottom: "10px", fontSize:"25px", fontWeight:"500", color: "#606FC4"}}>
              {product}
            </h3>
            <Line
              data={{
                labels: Array.from({ length: 10 }, (_, i) => `Day ${i + 1}`),
                datasets: [
                  {
                    label: "Market Price",
                    data: marketData[product] || [],
                    borderColor: colors[index % 2].market,
                    backgroundColor: colors[index % 2].market + "33",
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                  },
                  {
                    label: "H1 Bid",
                    data: auctionData[product]?.H1 || [],
                    borderColor: colors[index % 2].h1,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                  },
                  {
                    label: "L1 Bid",
                    data: auctionData[product]?.L1 || [],
                    borderColor: colors[index % 2].l1,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  tooltip: {
                    mode: "index",
                    intersect: false,
                    callbacks: {
                      label: function (context) {
                        return `${context.dataset.label}: ₹${context.raw}`;
                      },
                    },
                  },
                },
                interaction: { mode: "nearest", axis: "x", intersect: false },
                scales: {
                  y: {
                    beginAtZero: false,
                    ticks: { stepSize: 5000 },
                    title: { display: true, text: "Price (₹)" },
                  },
                  x: {
                    title: { display: true, text: "Days" },
                  },
                },
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketDashboard;
