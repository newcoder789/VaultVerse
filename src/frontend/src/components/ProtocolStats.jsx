import React from 'react';

const stats = [
  { label: 'Total Loan Volume', value: '$250M' },
  { label: 'Active Loans', value: '1,245' },
  { label: 'Total Value Locked', value: '$180M' },
  { label: 'Liquidation Rate', value: '0.8%' },
];

const ProtocolStats = () => {
  return (
    <section
      className="w-full py-16 px-6 bg-gradient-to-r from-black via-[#1a0a2a] to-black"
      aria-labelledby="protocol-stats-heading"
    >
      <div className="max-w-6xl mx-auto">
        <h2
          id="protocol-stats-heading"
          className="text-4xl md:text-5xl font-bold text-white mb-12 text-center leading-tight"
        >
          Protocol Stats
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-[#2a1a3a]/50 rounded-2xl p-6 text-center transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            >
              <p className="text-3xl font-bold text-purple-400">{stat.value}</p>
              <p className="text-gray-300 text-sm mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProtocolStats;
