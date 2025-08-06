import React from 'react';

const CallToAction = () => {
  return (
    <div className="w-full py-16 px-6 bg-gradient-to-r from-black via-[#1a0a2a] to-black flex justify-center items-center">
      <div className="max-w-6xl w-full text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Start Lending or Borrowing NFTs Today!
        </h2>
        <p className="text-gray-300 text-lg mb-8">
          Join thousands of users already using our platform to unlock the value of their NFTs.
        </p>
        <a
          href="/connect-wallet"
          className="inline-block bg-purple-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-purple-700 transition-all duration-300"
        >
          Connect Your Wallet
        </a>
      </div>
    </div>
  );
};

export default CallToAction;