import React from 'react';

const testimonials = [
  {
    id: 1,
    avatar: '/img/Nfts/male1.jpg',
    name: 'Ravi K.',
    quote:
      'Connecting my ICP wallet and listing my NFT for lending was seamless. I earned passive income in ICP tokens within days!',
  },
  {
    id: 2,
    avatar: '/img/Nfts/fem.jpg',
    name: 'Priya S.',
    quote:
      'The risk scoring system gave me confidence to borrow against my NFT. Repaying the loan was straightforward with the dashboard.',
  },
  {
    id: 3,
    avatar: '/img/Nfts/male2.jpg',
    name: 'Amit V.',
    quote:
      'I love the transparency of the on-chain auction system. My NFT was liquidated fairly, and I received surplus proceeds instantly.',
  },
];

const Testimonials = () => {
  return (
    <section
      className="w-full py-16 px-6 bg-gradient-to-r from-black via-[#1a0a2a] to-black"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-6xl mx-auto">
        <h2
          id="testimonials-heading"
          className="text-4xl md:text-5xl font-bold text-center text-white mb-12 leading-tight"
        >
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <article
              key={t.id}
              className="bg-[#2a1a3a]/50 rounded-2xl p-6 text-center transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            >
              <img
                src={t.avatar}
                alt={`${t.name} Avatar`}
                className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                loading="lazy"
                onError={(e) =>
                  (e.currentTarget.src = '/img/avatars/fallback-avatar.png')
                }
              />
              <h3 className="text-lg font-semibold text-white mb-2">{t.name}</h3>
              <p className="text-gray-300 text-sm italic">"{t.quote}"</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
