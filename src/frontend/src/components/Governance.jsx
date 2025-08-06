// src/components/Governance.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Header from "./header"
import Footer from "./Footer";

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Governance = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <style>{`
        .particle {
          position: absolute;
          border-radius: 50%;
        }
        @keyframes float {
          0% { transform: translateY(0); opacity: 0.2; }
          50% { opacity: 0.4; }
          100% { transform: translateY(-100vh); opacity: 0; }
        }
      `}</style>

      <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 via-purple-950 to-black text-white relative overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black opacity-40 z-0" />

        {/* Particle Animation */}
        <div className="particles absolute inset-0 z-1 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <span
              key={i}
              className="particle bg-purple-400 opacity-20"
              style={{
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${
                  Math.random() * 15 + 10
                }s infinite ease-in-out`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        <Header />

        <motion.main
          className="flex-1 container mx-auto py-20 px-4 relative z-10"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
          <motion.h1
            className="text-5xl font-bold mb-8 text-center"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 drop-shadow-[0_0_15px_rgba(147,51,234,0.7)]">
              Governance
            </span>
          </motion.h1>
          <motion.p
            className="text-center text-gray-300 max-w-2xl mx-auto mb-12"
            variants={sectionVariants}
          >
            The Vaultic Protocol is governed by the community. Token holders can
            participate in decision-making, propose changes, and vote on the
            future of the platform.
          </motion.p>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
            variants={sectionVariants}
          >
            {[
              { label: "Total Votes Cast", value: "32,486" },
              { label: "Active Proposals", value: "3" },
              { label: "Voting Power (Total)", value: "2.4M VLT" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-gray-800 p-6 rounded-xl shadow-md text-center hover:shadow-purple-500 transition"
              >
                <h2 className="text-3xl font-bold text-purple-400">
                  {stat.value}
                </h2>
                <p className="text-gray-400 mt-2">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Proposals */}
          <motion.h2
            className="text-3xl font-semibold mb-6 text-white"
            variants={sectionVariants}
          >
            Current Proposals
          </motion.h2>
          <motion.div className="space-y-6" variants={sectionVariants}>
            {[
              {
                title: "Enable Lending for Azuki NFTs",
                description:
                  "Allow Azuki NFTs as collateral on Vaultic Protocol.",
                status: "Voting Open",
                votes: "1.2M VLT",
              },
              {
                title: "Update Collateral Ratio to 150%",
                description:
                  "Increase collateralization requirements for new borrowers.",
                status: "Voting Open",
                votes: "850K VLT",
              },
              {
                title: "Burn 10% of Treasury Tokens",
                description: "Proposal to burn unused tokens to reduce supply.",
                status: "Ended",
                votes: "450K VLT",
              },
            ].map((proposal, index) => (
              <div
                key={index}
                className="bg-gray-800 p-6 rounded-lg border-l-4 border-purple-500 hover:bg-gray-700 transition"
              >
                <h3 className="text-xl font-semibold text-white">
                  {proposal.title}
                </h3>
                <p className="text-gray-400 mt-1">{proposal.description}</p>
                <div className="flex justify-between mt-4 text-sm text-gray-400">
                  <span>
                    Status:{" "}
                    <span className="text-purple-400">{proposal.status}</span>
                  </span>
                  <span>Votes: {proposal.votes}</span>
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div className="text-center mt-16" variants={sectionVariants}>
            <button className="bg-purple-600 hover:bg-purple-700 transition px-8 py-3 rounded-full font-semibold text-white shadow-lg">
              Create Proposal
            </button>
          </motion.div>
        </motion.main>

        <Footer />
      </div>
    </>
  );
};

export default Governance;
