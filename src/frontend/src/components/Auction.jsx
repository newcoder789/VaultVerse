// src/components/Auction.jsx
import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { motion } from "framer-motion";
import NFTModal from "./NFTModal";
import { createActor as createAuctionActor, canisterId as auctionCanisterId } from "../../declarations/core_protocol_canister";
import { useAuth } from "@nfid/identitykit/react";

// ✅ Animation variant
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const Auction = () => {
  const { user } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [bidInputs, setBidInputs] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const actor = createAuctionActor(auctionCanisterId);
        // Replace with real canister call
        const liveAuctions = await actor.get_live_auctions();
        setAuctions(liveAuctions);
      } catch (err) {
        setError("Failed to load auctions.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  const handleBid = async (id) => {
    const enteredBid = parseFloat(bidInputs[id]);
    if (isNaN(enteredBid)) return alert("Enter a valid bid amount");
    try {
      const actor = createAuctionActor(auctionCanisterId);
      await actor.place_bid(id, enteredBid, user?.principal);
      alert("Bid placed!");
      // Optionally refetch auctions
    } catch (err) {
      alert("Failed to place bid.");
    }
    setBidInputs((prev) => ({ ...prev, [id]: "" }));
  };

  const getTimeRemaining = (endTime) => {
    const total = Date.parse(endTime) - Date.now();
    if (total < 0) return "Auction ended";

    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor(total / 1000 / 60 / 60);
    const seconds = Math.floor((total / 1000) % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 via-purple-950 to-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-40 z-0" />
      {/* 🌌 Particle Background */}
      <style>{`
        .particle {
          position: absolute;
          border-radius: 50%;
          opacity: 0.2;
          pointer-events: none;
        }
        @keyframes float {
          0% { transform: translateY(0); opacity: 0.2; }
          50% { opacity: 0.4; }
          100% { transform: translateY(-100vh); opacity: 0; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>


      {/* Particle Effect */}
      <div className="absolute inset-0 z-1 pointer-events-none">
        {[...Array(35)].map((_, i) => (
          <span
            key={i}
            className="particle bg-purple-400 opacity-20"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 15 + 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <Header />

      <main className="max-w-7xl mx-auto px-6 lg:px-20 py-20 relative z-10 min-h-[90vh]">
        {isLoading ? (
          <div className="flex justify-center items-center" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: "20" }}>
            <div className="w-16 h-16 border-4 border-t-4 border-purple-500 border-solid rounded-full" style={{ borderTopColor: "#9333ea", animation: "spin 1s linear infinite" }} />
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-20">{error}</div>
        ) : (
          <>
            <motion.h1
              className="text-5xl font-bold mb-8 text-center"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              Live{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 drop-shadow-[0_0_15px_rgba(147,51,234,0.7)]">
                Auction
              </span>
            </motion.h1>

            <div className="grid md:grid-cols-2 gap-8">
              {auctions.map((auction) => (
                <motion.div
                  key={auction.id}
                  className="bg-gray-800 rounded-lg p-6 border border-purple-600/40 shadow-md hover:shadow-purple-700 transition cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}

                >
                  <img
                    src={auction.nft.image}
                    alt={auction.nft.name}
                    className="w-full h-60 object-cover rounded mb-4"
                    onClick={() => setSelectedNFT(auction.nft)}
                  />
                  <h2 className="text-xl font-semibold">{auction.nft.name}</h2>
                  <p className="text-gray-400 text-sm mt-1 mb-4">
                    Ends in:{" "}
                    <span className="text-purple-300">
                      {getTimeRemaining(auction.endTime)}
                    </span>
                  </p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-300">Current Bid:</span>
                    <span className="text-green-400 font-semibold">
                      {auction.currentBid} ICP
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Your bid in ICP"
                      value={bidInputs[auction.id] || ""}
                      onChange={(e) =>
                        setBidInputs((prev) => ({
                          ...prev,
                          [auction.id]: e.target.value,
                        }))
                      }
                      className="flex-1 px-4 py-2 rounded bg-gray-900 text-white border border-purple-500 focus:outline-none"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBid(auction.id);
                      }}
                      className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded text-white font-semibold"
                    >
                      Bid
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </main>

      <NFTModal
        nft={selectedNFT}
        isOpen={!!selectedNFT}
        onClose={() => setSelectedNFT(null)}
      />

      <Footer />
    </div>
  );
};

export default Auction;
