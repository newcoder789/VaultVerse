import React from "react";
import { motion } from "framer-motion";

const NFTDetailsModal = ({ isOpen, onClose, loan, borrowerProfile }) => {
  if (!isOpen || !loan) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 text-white rounded-lg p-6 max-w-md w-full relative border border-purple-700"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-red-400 text-xl"
        >
          ✕
        </button>

        <img
          src={loan.asset.image}
          alt={loan.asset.name}
          className="w-full h-56 object-cover rounded mb-4"
        />
        <h2 className="text-2xl font-bold mb-2">{loan.asset.name}</h2>

        <div className="mb-3 text-sm text-gray-300">
          <p><strong>Loan ID:</strong> {loan.id}</p>
          <p><strong>Rate:</strong> {loan.rate}%</p>
          <p><strong>Duration:</strong> {loan.duration} days</p>
          <p><strong>Principle:</strong> {loan.principle} {loan.currency}</p>
        </div>

        {borrowerProfile && (
          <div className="bg-gray-800 p-3 rounded mb-2 text-sm">
            <p><strong>Borrower:</strong> {borrowerProfile.name}</p>
            <p><strong>Reputation:</strong> {borrowerProfile.reputation}</p>
            <p>{borrowerProfile.loan_history}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default NFTDetailsModal;
