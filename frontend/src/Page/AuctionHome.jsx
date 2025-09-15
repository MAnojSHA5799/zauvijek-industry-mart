import { useNavigate } from "react-router-dom";
import Navbar from "../Kaushik/Navbar";
import Footer from "../Kaushik/Footer";

const AuctionHome = () => {
  const navigate = useNavigate();
  const primaryColor = "#606FC4";

  return (
    <>
      <Navbar />
      <div
        style={{
          textAlign: "center",
          marginTop: "80px",
          padding: "20px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h1 style={{ color: primaryColor, fontSize: "2.5rem" }}>
          Auction Management
        </h1>
        <p style={{ color: "#555", fontSize: "1.1rem", marginTop: "10px" }}>
          Manage all your auctions in one place — create, edit and view them.
        </p>

        <div style={{ marginTop: "40px" }}>
          <button
            onClick={() => navigate("/auction/list")}
            style={{
              padding: "12px 25px",
              margin: "10px",
              cursor: "pointer",
              background: primaryColor,
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "bold",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.target.style.background = "#4E5BB5")
            }
            onMouseOut={(e) => (e.target.style.background = primaryColor)}
          >
            Show All Auctions
          </button>

          <button
            onClick={() => navigate("/auction/add")}
            style={{
              padding: "12px 25px",
              margin: "10px",
              cursor: "pointer",
              background: "white",
              color: primaryColor,
              border: `2px solid ${primaryColor}`,
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "bold",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.background = primaryColor;
              e.target.style.color = "white";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "white";
              e.target.style.color = primaryColor;
            }}
          >
            Add Auction
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AuctionHome;
