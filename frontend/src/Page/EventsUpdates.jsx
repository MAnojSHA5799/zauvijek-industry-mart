// src/components/EventsUpdates.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const EventsUpdates = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("https://newsapi.org/v2/everything", {
          params: {
            q: "steel OR metal OR machinery",
            sortBy: "publishedAt",
            language: "en",
            pageSize: 22, // show max 12 events
            apiKey: "3a2dcdaefb8b4867a5775854cc121c11", // replace with your key
          },
        });
        setEvents(res.data.articles);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", color: "#606FC4", marginBottom: "30px" }}>
        Events & Updates
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {events.map((event, idx) => (
          <div
            key={idx}
            style={{
              background: "#d7dbf7",
              border: "1px solid #606FC4",
              borderRadius: "12px",
              boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
              overflow: "hidden",
              transition: "transform 0.3s, box-shadow 0.3s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.15)";
            }}
          >
            {event.urlToImage && (
              <img
                src={event.urlToImage}
                alt={event.title}
                style={{ width: "100%", height: "150px", objectFit: "cover" }}
              />
            )}
            <div style={{ padding: "15px" }}>
              <h3 style={{ color: "#606FC4", marginBottom: "10px", fontSize: "16px" }}>
                {event.title.length > 70 ? event.title.slice(0, 70) + "..." : event.title}
              </h3>
              <p style={{ fontSize: "12px", color: "#555", marginBottom: "10px" }}>
                {new Date(event.publishedAt).toLocaleDateString()}
              </p>
              <a
                href={event.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  textDecoration: "none",
                  color: "#fff",
                  background: "#606FC4",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              >
                Read More
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsUpdates;
