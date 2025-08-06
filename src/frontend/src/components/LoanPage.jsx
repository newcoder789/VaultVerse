// src/components/LoanPage.jsx
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { createActor as createNFTActor, canisterId as nftCanisterId } from "../../../../src/declarations/dip721_nft_container/index.js";
import { useAuth } from "@nfid/identitykit/react";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  hover: {
    scale: 1.1,
    boxShadow: "0 0 30px rgba(147, 51, 234, 0.8)",
    background: "rgba(255, 255, 255, 0.1)",
  },
  tap: { scale: 0.95 },
};

const inputVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  focus: {
    scale: 1.02,
    borderColor: "rgba(147, 51, 234, 0.8)",
    boxShadow: "0 0 15px rgba(147, 51, 234, 0.5)",
  },
};

const LoanPage = () => {
  const { user } = useAuth();
  const [loanAmount, setLoanAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [interestRate] = useState("5");
  const [userNFTs, setUserNFTs] = useState([]);
  const [selectedNFT, setSelectedNFT] = useState("");
  const [activeTab, setActiveTab] = useState("new-loan");
  const [myLoans, setMyLoans] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const nftActor = createNFTActor(nftCanisterId);
        const nfts = await nftActor.get_user_nfts(user?.principal);
        setUserNFTs(nfts);
        if (nfts.length > 0) setSelectedNFT(nfts[0].id);
        // Fetch loans and offers from core_protocol_canister
        // Replace with real canister calls
        // const coreActor = createCoreActor(coreCanisterId);
        // setMyLoans(await coreActor.get_my_loans(user?.principal));
        // setOffers(await coreActor.get_my_offers(user?.principal));
      } catch (err) {
        setError("Failed to load NFT/loan data.");
      } finally {
        setLoading(false);
      }
    };
    if (user?.principal) fetchData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Call canister to request loan
    // await coreActor.request_loan(...)
    alert(`Loan Submitted!\nAmount: ${loanAmount} ICP\nDuration: ${duration} months\nInterest: ${interestRate}%\nNFT: ${selectedNFT}`);
  };

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
        <div className="absolute inset-0 bg-black opacity-40 z-0" />

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
                animation: `float ${Math.random() * 15 + 10}s infinite ease-in-out`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        <Header />

        {/* Tabs */}
        <div className="border-b border-gray-600 pb-3 text-white text-lg font-medium">
          <div className="max-w-7xl mx-auto px-0 flex items-center justify-between mt-4">
            <div className="flex items-center space-x-12">
              {["new-loan", "my-loans", "offers"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative ${activeTab === tab ? "text-white font-bold" : "text-gray-300"} transition duration-200`}
                >
                  <span>
                    {tab === "new-loan" ? "Get a new loan" : tab === "my-loans" ? "My Loans" : "Offers received"}
                  </span>
                  {activeTab === tab && (
                    <div className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-white" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-gray-300 hover:text-white transition duration-200 cursor-pointer">
              <img src="/icons/multiple-nfts-icon.svg" alt="icon" className="w-4 h-4" />
              <span>Get a loan on multiple NFTs</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <motion.main
          className="flex-1 container mx-auto py-20 px-4 flex flex-col items-center relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {activeTab === "new-loan" && (
            <>
              <motion.h1 className="text-5xl font-bold mb-8 text-center" variants={sectionVariants}>
                Request a{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 drop-shadow-[0_0_15px_rgba(147,51,234,0.7)]">
                  Loan
                </span>
              </motion.h1>

              <motion.p className="text-xl text-gray-200 mb-12 text-center max-w-xl" variants={sectionVariants}>
                Securely borrow assets on-chain with VAULTIC PROTOCOL.
              </motion.p>

              <motion.form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-gray-800 bg-opacity-30 backdrop-blur-sm rounded-lg p-8 shadow-[0_0_20px_rgba(147,51,234,0.3)]"
                variants={containerVariants}
              >
                {/* Amount */}
                <motion.div className="mb-6" variants={sectionVariants}>
                  <label htmlFor="loanAmount" className="block text-sm mb-2">Loan Amount (ICP)</label>
                  <motion.input
                    type="number"
                    id="loanAmount"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="w-full bg-gray-900 text-white border-2 border-purple-300/50 rounded-lg py-3 px-4 focus:outline-none"
                    placeholder="Enter amount"
                    required
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                    whileFocus="focus"
                  />
                </motion.div>

                {/* Duration */}
                <motion.div className="mb-6" variants={sectionVariants}>
                  <label htmlFor="duration" className="block text-sm mb-2">Duration (months)</label>
                  <motion.input
                    type="number"
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-gray-900 text-white border-2 border-purple-300/50 rounded-lg py-3 px-4 focus:outline-none"
                    placeholder="Enter duration"
                    required
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                    whileFocus="focus"
                  />
                </motion.div>

                {/* NFT */}
                <motion.div className="mb-6" variants={sectionVariants}>
                  <label htmlFor="collateralNFT" className="block text-sm mb-2">Collateral NFT</label>
                  <motion.select
                    id="collateralNFT"
                    value={selectedNFT}
                    onChange={(e) => setSelectedNFT(e.target.value)}
                    className="w-full bg-gray-900 text-white border-2 border-purple-300/50 rounded-lg py-3 px-4"
                    required
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                    whileFocus="focus"
                  >
                    {userNFTs.length === 0 ? (
                      <option value="">No NFTs available</option>
                    ) : (
                      userNFTs.map((nft) => (
                        <option key={nft.id} value={nft.id}>
                          {nft.name}
                        </option>
                      ))
                    )}
                  </motion.select>
                </motion.div>

                {/* Interest Rate */}
                <motion.div className="mb-8" variants={sectionVariants}>
                  <label htmlFor="interestRate" className="block text-sm mb-2">Interest Rate (%)</label>
                  <motion.input
                    type="text"
                    id="interestRate"
                    value={interestRate}
                    readOnly
                    className="w-full bg-gray-900 text-gray-400 border-2 border-purple-300/50 rounded-lg py-3 px-4"
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                  />
                </motion.div>

                {/* Submit */}
                <motion.div className="flex justify-center" variants={sectionVariants}>
                  <motion.button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 px-10 rounded-full font-medium text-lg shadow-[0_0_20px_rgba(147,51,234,0.5)] hover:shadow-[0_0_30px_rgba(147,51,234,0.8)]"
                    variants={buttonVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Submit Loan Request
                  </motion.button>
                </motion.div>
              </motion.form>
            </>
          )}

          {activeTab === "my-loans" && (
          <motion.div className="w-full max-w-3xl mt-10 space-y-10" variants={sectionVariants}>
            {/* Active Loans */}
            <div>
              <h2 className="text-2xl font-semibold mb-3">Active Loans</h2>
              <div className="bg-gray-900 p-5 rounded-lg shadow-md text-gray-300">
                You don’t have any active loans.
              </div>
            </div>

            {/* Past Loans */}
            <div>
              <h2 className="text-2xl font-semibold mb-3">Past Loans</h2>
              <div className="bg-gray-900 p-5 rounded-lg shadow-md text-gray-300 space-y-4">
                <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                  <div>
                    <div className="text-white font-medium">Loan #001</div>
                    <div className="text-sm text-gray-400">Bored Ape #5678 • 10 ICP • 3 months</div>
                  </div>
                  <div className="text-sm text-green-400">Repaid</div>
                </div>

                <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                  <div>
                    <div className="text-white font-medium">Loan #002</div>
                    <div className="text-sm text-gray-400">Cool Cat #9012 • 8 ICP • 2 months</div>
                  </div>
                  <div className="text-sm text-red-400">Liquidated</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

          {activeTab === "offers" && (
            <motion.div className="w-full max-w-3xl mt-10 space-y-6" variants={sectionVariants}>
              <h2 className="text-2xl font-semibold">Offers Received</h2>
              <div className="bg-gray-900 p-5 rounded-lg shadow-md text-gray-300">
                No loan offers received yet.
              </div>
            </motion.div>
          )}

          {loading ? (
  <div className="text-center text-white py-20">Loading loan data...</div>
) : error ? (
  <div className="text-center text-red-400 py-20">{error}</div>
) : (
            <>
              {/* Active Loans Section - Only visible if there are active loans */}
              {myLoans.length > 0 && (
                <motion.div className="w-full max-w-3xl mt-10 space-y-10" variants={sectionVariants}>
                  <div>
                    <h2 className="text-2xl font-semibold mb-3">Active Loans</h2>
                    <div className="bg-gray-900 p-5 rounded-lg shadow-md text-gray-300 space-y-4">
                      {myLoans.map((loan) => (
                        <div key={loan.id} className="flex justify-between items-center border-b border-gray-700 pb-3">
                          <div>
                            <div className="text-white font-medium">{`Loan #${loan.id.split("-")[1]}`}</div>
                            <div className="text-sm text-gray-400">{`${loan.nft_name} • ${loan.amount} ICP • ${loan.duration} months`}</div>
                          </div>
                          <div className={`text-sm ${loan.status === "Repaid" ? "text-green-400" : "text-red-400"}`}>
                            {loan.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Offers Section - Only visible if there are offers */}
              {offers.length > 0 && (
                <motion.div className="w-full max-w-3xl mt-10 space-y-6" variants={sectionVariants}>
                  <h2 className="text-2xl font-semibold">Offers Received</h2>
                  <div className="bg-gray-900 p-5 rounded-lg shadow-md text-gray-300 space-y-4">
                    {offers.map((offer) => (
                      <div key={offer.id} className="flex justify-between items-center border-b border-gray-700 pb-3">
                        <div>
                          <div className="text-white font-medium">{`Offer #${offer.id.split("-")[1]}`}</div>
                          <div className="text-sm text-gray-400">{`${offer.nft_name} • ${offer.amount} ICP • ${offer.duration} months`}</div>
                        </div>
                        <div className="text-sm text-yellow-400">
                          Pending
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </motion.main>

        <Footer />
      </div>
    </>
  );
};

export default LoanPage;
