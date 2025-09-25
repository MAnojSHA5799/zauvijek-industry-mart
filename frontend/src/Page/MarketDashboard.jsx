import React from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList
} from "recharts";

const data = [
  { metal: "Platinum", price: 4800, surcharge: 6 },
  { metal: "Copper", price: 720, surcharge: 3 },
  { metal: "Aluminum", price: 267, surcharge: 2 },
  { metal: "Zinc", price: 307, surcharge: 2 },
  { metal: "Lead", price: 118, surcharge: 1 },
  { metal: "Brass", price: 480, surcharge: 2 },
  { metal: "Gun Metal", price: 691, surcharge: 2 },
  { metal: "Stainless Steel", price: 42.75, surcharge: 1 },
];

const metalUsage = [
  "Auto catalytic converters, industrial equipment",
  "Electric wires, motors, pipelines",
  "Utensils, wires, sheets",
  "Batteries, coatings, construction materials",
  "Battery scrap, recycling",
  "Plumbing fittings, hardware",
  "Machine parts, industrial use",
  "Sink, pipes, plates, sheets",
];

export default function MetalPricingTrendsCard() {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        border: "1px solid #e0e0e0",
      }}
    >
      <h2 style={{ marginBottom: "20px", color: "#2f74c0" }}>
        Metal Price vs Surcharge Trends
      </h2>

      <div style={{ display: "flex", gap: "40px" }}>
        {/* Chart Section */}
        <div style={{ flex: 2, height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metal" angle={-40} textAnchor="end" height={70} />
              <YAxis yAxisId="left" orientation="left" domain={[0, 10]} unit="%" />
              <YAxis yAxisId="right" orientation="right" unit="₹" />

              <Tooltip 
                formatter={(value, name) => 
                  name === "Surcharge (%)" ? `${value}%` : `₹${value.toLocaleString()}`
                } 
              />
              <Legend />

              <Bar
                yAxisId="left"
                dataKey="surcharge"
                fill="#2f74c0"
                name="Surcharge (%)"
                radius={[1,1, 0, 0]}
              />

              <Line
                yAxisId="right"
                type="monotone"
                dataKey="price"
                stroke="#ff7300"
                strokeWidth={3}
                name="Metal Price (₹/kg)"
                dot={{ r: 4 }}
              >
                <LabelList
                  dataKey="price"
                  position="top"
                  formatter={(val) => `₹${val.toLocaleString()}`}
                />
              </Line>
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Table Section */}
        <div style={{ flex: 1, overflowY: "auto", maxHeight: 400 }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "center",
              border: "2px solid #2f74c0",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ background: "#f4f6f9", color: "#333" }}>
                <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>Metal</th>
                <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>Surcharge (%)</th>
                <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>Price (₹/kg)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>{row.metal}</td>
                  <td style={{ padding: "8px", color: "#2f74c0", fontWeight: "bold" }}>
                    {row.surcharge}%
                  </td>
                  <td style={{ padding: "8px", color: "#ff7300", fontWeight: "bold" }}>
                    ₹{row.price.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
