import React from 'react';

const GovernanceTokenomics = () => {
  return (
    <div className="w-full py-16 px-6 bg-gradient-to-r from-black via-[#1a0a2a] to-black">``
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
          Governance & Tokenomics
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-8">
          {/* Governance Section */}
          <div className="flex-1 bg-[#2a1a3a] bg-opacity-50 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Community Governance
            </h3>
            <p className="text-gray-300 text-lg mb-6">
              Participate in the future of the protocol by staking your governance tokens and voting on proposals.
            </p>
            <a
              href="/governance"
              className="text-purple-400 text-lg flex items-center justify-center"
            >
              Learn More About DAO
              <span className="ml-2">→</span>
            </a>
          </div>

          {/* Tokenomics Section */}
          <div className="flex-1 bg-[#2a1a3a] bg-opacity-50 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Token Rewards
            </h3>
            <p className="text-gray-300 text-lg mb-6">
              Earn rewards through staking, liquidity mining, or airdrops as part of our token distribution strategy.
            </p>
            <a
              href="/token-rewards"
              className="text-purple-400 text-lg flex items-center justify-center"
            >
              Explore Tokenomics
              <span className="ml-2">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernanceTokenomics;