import React, { memo } from 'react';
import { SiInternetcomputer } from 'react-icons/si';
import { RiShieldKeyholeLine } from 'react-icons/ri';
import { GiHammerBreak } from 'react-icons/gi';

// Features data with icon components
const FEATURES = [
  {
    id: 'motoko-icp',
    Icon: SiInternetcomputer,
    title: 'Built on Motoko & ICP',
    description:
      'Leverages Motoko’s actor-based model for scalable, secure, and decentralized NFT lending on the Internet Computer.',
  },
  {
    id: 'dynamic-risk',
    Icon: RiShieldKeyholeLine,
    title: 'Dynamic Risk Modeling',
    description:
      'Uses on-chain risk scoring and adjustable LTV ratios to ensure safe lending, powered by real-time market data.',
  },
  {
    id: 'on-chain-liquidation',
    Icon: GiHammerBreak,
    title: 'On-Chain Liquidation',
    description:
      'Automated liquidation and auction system ensures fairness and transparency for overdue loans.',
  },
];

// Feature Card component
const FeatureCard = ({ feature }) => {
  const { Icon, title, description, id } = feature;

  return (
    <article
      className="bg-[#2a1a3a]/50 rounded-2xl p-6 text-center transition-transform duration-300 hover:scale-105 hover:shadow-lg"
      data-testid={`feature-card-${id}`}
    >
      <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white text-3xl rounded-full shadow-lg">
        <Icon />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-300 text-sm">{description}</p>
    </article>
  );
};

// Main Features component
const Features = () => {
    return (
        <section
            className="w-full py-20 px-6 bg-gradient-to-r from-black via-[#1a0a2a] to-black"
            aria-labelledby="features-heading"
        >
            <div className="max-w-6xl mx-auto">
                <h2
                    id="features-heading"
                    className="text-4xl md:text-5xl font-bold text-center text-white mb-12 leading-tight"
                >
                    Why Choose Us
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {FEATURES.map((feature) => (
                        <FeatureCard key={feature.id} feature={feature} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default memo(Features);