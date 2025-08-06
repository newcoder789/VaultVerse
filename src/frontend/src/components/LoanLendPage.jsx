// src/components/LoanLendPage.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "./Header"; // Import Header for consistency

// Animation variants for the page
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.1,
    boxShadow: "0 0 30px rgba(147, 51, 234, 0.8)", // Stronger purple glow on hover
    background: "rgba(255, 255, 255, 0.1)", // Glassmorphism effect on hover
  },
  tap: { scale: 0.95 },
};

const LoanLendPage = () => {
  return (
    <>
      {/* Embed CSS directly in the component */}
      <style>
        {`
          .particle {
            position: absolute;
            border-radius: 50%;
          }

          @keyframes float {
            0% {
              transform: translateY(0) translateX(0);
              opacity: 0.2;
            }
            50% {
              opacity: 0.4;
            }
            100% {
              transform: translateY(-100vh) translateX(${Math.random() * 20 - 10}px);
              opacity: 0;
            }
          }
        `}
      </style>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-950 to-black text-white relative overflow-hidden">
        {/* Subtle Background Overlay */}
        <div className="absolute inset-0 bg-black opacity-40 z-0" />

        {/* Particle Effects */}
        <div className="particles absolute inset-0 z-1 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <span
              key={i}
              className="particle absolute rounded-full bg-purple-400 opacity-20"
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

        {/* Header */}
        <Header /> {/* Already rendered via App.jsx, included for clarity */}

        {/* Main Content */}
        <motion.main
          className="container mx-auto py-20 px-4 flex flex-col items-center relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Heading */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-8 text-center"
            variants={sectionVariants}
          >
            VAULTIC PROTOCOL{' '}
            <span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 drop-shadow-[0_0_15px_rgba(147,51,234,0.7)]">
                Smart
              </span>{' '}
              Loans for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 drop-shadow-[0_0_15px_rgba(147,51,234,0.7)]">
                Web3
              </span>
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            className="text-lg sm:text-xl tracking-wide text-gray-200 max-w-[28rem] mt-4 text-center"
            variants={sectionVariants}
          >
            Borrow and lend securely on-chain, with no middleman.
            <br />
            Built on Internet Computer using{' '}
            <span className="text-white font-semibold">Motoko</span>.
          </motion.p>

          {/* Buttons */}
          <motion.div className="flex gap-6 mt-12" variants={sectionVariants}>
            <Link to="/loan">
              <motion.button
                className="relative bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 px-10 rounded-full border-2 border-purple-300/50 font-medium text-lg backdrop-blur-sm bg-opacity-30 shadow-[0_0_20px_rgba(147,51,234,0.5)] hover:shadow-[0_0_30px_rgba(147,51,234,0.8)]"
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
              >
                LOAN
              </motion.button>
            </Link>

            <Link to="/lend">
              <motion.button
                className="relative bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 px-10 rounded-full border-2 border-purple-300/50 font-medium text-lg backdrop-blur-sm bg-opacity-30 shadow-[0_0_20px_rgba(147,51,234,0.5)] hover:shadow-[0_0_30px_rgba(147,51,234,0.8)]"
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
              >
                LEND
              </motion.button>
            </Link>
          </motion.div>
        </motion.main>
      </div>
    </>
  );
};

export default LoanLendPage;