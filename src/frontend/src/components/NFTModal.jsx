// src/components/NFTModal.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const NFTModal = ({ nft, isOpen, onClose }) => {
  if (!nft) return null;

  // If nft is a canister object, map fields accordingly
  const attributes = nft.attributes || nft.metadata || [];
  const bids = nft.bids || nft.bidHistory || [];

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
        >
          <div className="bg-gray-900 text-white rounded-xl max-w-2xl w-full p-6 relative shadow-lg border border-purple-500/30">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">
              ✖
            </button>
            <img src={nft.image || nft.imageUrl} alt={nft.name} className="w-full h-64 object-cover rounded mb-4" />
            <h2 className="text-2xl font-semibold mb-2">{nft.name}</h2>
            <p className="text-gray-400 mb-4">
              {nft.description || "This NFT has no description."}
            </p>

            <div className="mb-4">
              <h3 className="font-bold text-purple-400 mb-1">Attributes</h3>
              <ul className="text-sm text-gray-300 grid grid-cols-2 gap-x-6">
                {attributes.map((attr, i) => (
                  <li key={i}>
                    <strong>{attr.trait_type || attr.key}</strong>: {attr.value}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-purple-400 mb-2">Bid History</h3>
              {bids.length > 0 ? (
                <ul className="text-sm space-y-1 text-gray-300">
                  {bids.map((bid, i) => (
                    <li key={i}>
                      <span className="text-purple-300 font-medium">{bid.user || bid.bidder}</span> bid {bid.amount} ICP • {bid.timeAgo || bid.timestamp}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No bids yet.</p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NFTModal;
