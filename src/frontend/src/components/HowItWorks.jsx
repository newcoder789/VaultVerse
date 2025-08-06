import React from 'react';

// 1. Data Definition (Moved from separate file for single-file structure)
const stepsData = [
  {
    id: 1,
    title: "1. Connect Your Wallet", // Added numbers for clarity in titles
    description: "Securely connect your preferred crypto wallet to get started.",
    detailsLinkText: null,
    videoUrl: 'https://www.youtube.com/watch?v=your-video-id-1',
    thumbnailUrl: '/img/Nfts/video-thumbnail-1.jpg',
    altText: "Video Thumbnail: How to Connect Your Wallet",
    layoutType: 'textBesideVideo',
    textOrder: 'left',
    videoThumbnailSize: 'large',
  },
  {
    id: 2,
    title: "2. List Your NFT",
    description: "Easily list your NFT for lending and set your desired terms.",
    detailsLinkText: "Find out more at our Shop",
    videoUrl: 'https://www.youtube.com/watch?v=your-video-id-2',
    thumbnailUrl: '/img/Nfts/video-thumbnail-2.jpg',
    altText: "Video Thumbnail: How to List Your NFT",
    layoutType: 'card',
    videoThumbnailSize: 'small',
  },
  {
    id: 3,
    title: "3. Accept a Loan Offer",
    description: "Review and accept loan offers that best suit your needs.",
    detailsLinkText: "Find out more at our Shop",
    videoUrl: 'https://www.youtube.com/watch?v=your-video-id-3',
    thumbnailUrl: '/img/Nfts/video-thumbnail-3.jpg',
    altText: "Video Thumbnail: How to Accept a Loan Offer",
    layoutType: 'card',
    videoThumbnailSize: 'small',
  },
  {
    id: 4,
    title: "4. Repay the Loan",
    description: "Complete the transaction by repaying the loan and retrieving your NFT.",
    detailsLinkText: null,
    videoUrl: 'https://www.youtube.com/watch?v=your-video-id-4',
    thumbnailUrl: '/img/Nfts/video-thumbnail-4.jpg',
    altText: "Video Thumbnail: How to Repay the Loan",
    layoutType: 'textBesideVideo',
    textOrder: 'left', // Consider alternating this: textOrder: 'right' for variety
    videoThumbnailSize: 'large',
  },
];

// 2. Helper Icon Component
const PlayIcon = () => (
  <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

// 3. VideoThumbnail Component
const VideoThumbnail = ({ videoUrl, thumbnailUrl, altText, size = 'large' }) => {
  const wrapperSizeClass = size === 'large' ? "w-full max-w-[400px] h-[225px]" : "w-full max-w-[300px] h-[169px]";
  const playIconWrapperSizeClass = size === 'large' ? "w-16 h-16" : "w-12 h-12";
  const playIconSizeAdjustment = size === 'large' ? "ml-1" : "ml-1";

  return (
    <a href={videoUrl} target="_blank" rel="noopener noreferrer" aria-label={`Watch video: ${altText}`}>
      <div
        className={`relative ${wrapperSizeClass} rounded-xl overflow-hidden shadow-lg cursor-pointer group mx-auto`}
      >
        <img
          src={thumbnailUrl}
          alt={altText}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all duration-300">
          <div className={`${playIconWrapperSizeClass} bg-red-600 rounded-full flex items-center justify-center p-3 group-hover:bg-red-700 transition-colors duration-300`}>
            <div className={`w-full h-full ${playIconSizeAdjustment}`}>
                 <PlayIcon />
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

// 4. HowItWorksStep Component
const HowItWorksStep = ({ step }) => {
  const {
    title,
    description,
    detailsLinkText,
    videoUrl,
    thumbnailUrl,
    altText,
    layoutType,
    textOrder,
    videoThumbnailSize,
  } = step;

  const textContent = (textAlign = 'text-left md:text-left', titleAlign = 'text-left md:text-left', isCard = false) => (
    <div className={`space-y-4 ${isCard ? 'md:space-y-3' : 'md:space-y-6'} ${textAlign}`}>
      <h3 className={`text-2xl ${isCard ? 'md:text-2xl' : 'md:text-3xl'} font-semibold text-white ${titleAlign}`}>
        {title}
      </h3>
      <p className={`text-gray-300 ${isCard ? 'text-base' : 'text-lg'}`}>{description}</p>
      {detailsLinkText ? (
        <p className={`text-purple-400 text-lg flex items-center ${titleAlign.includes('center') || isCard ? 'justify-center' : ''}`}>
          {detailsLinkText}
          <span className="ml-2">→</span>
        </p>
      ) : (
        // For descriptions that are already call-to-actions (Steps 1 & 4 in the data)
        // Only show arrow if description doesn't already imply an action (like the original step 1 and 4)
        // This logic is a bit specific to the original content, adjust if needed.
        (title.startsWith("1.") || title.startsWith("4.")) && !detailsLinkText && (
          <p className={`text-purple-400 text-lg flex items-center ${titleAlign.includes('center') || isCard ? 'justify-center' : ''}`}>
              Securely connect your preferred crypto wallet to get started.
            <span className="ml-2">→</span>
          </p>
        )
      )}
    </div>
  );

  if (layoutType === 'textBesideVideo') {
    return (
      <div className="bg-[#2a1a3a] bg-opacity-70 rounded-2xl p-6 sm:p-8 md:p-12 shadow-xl">
        <div className={`flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 ${textOrder === 'right' ? 'md:flex-row-reverse' : ''}`}>
          <div className="md:w-1/2 mb-6 md:mb-0 text-center md:text-left">
            {textContent()}
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end"> {/* Ensure video is pushed to edge in desktop */}
            <VideoThumbnail videoUrl={videoUrl} thumbnailUrl={thumbnailUrl} altText={altText} size={videoThumbnailSize} />
          </div>
        </div>
      </div>
    );
  }

  // layoutType === 'card'
  return (
    <div className="flex flex-col flex-1 bg-[#2a1a3a] bg-opacity-70 rounded-2xl p-6 sm:p-8 md:p-10 text-center shadow-xl">
      {textContent('text-center', 'text-center', true)}
      <div className="mt-auto pt-4"> {/* Pushes thumbnail to bottom if text is short */}
        <VideoThumbnail videoUrl={videoUrl} thumbnailUrl={thumbnailUrl} altText={altText} size={videoThumbnailSize} />
      </div>
    </div>
  );
};

// 5. Main HowItWorks Component
const HowItWorks = () => {
  const fullWidthSteps = stepsData.filter(step => step.layoutType === 'textBesideVideo');
  const cardSteps = stepsData.filter(step => step.layoutType === 'card');

  return (
    <section id="how-it-works" className="w-full py-12 md:py-16 px-4 sm:px-6 bg-gradient-to-r from-black via-[#1a0a2a] to-black flex flex-col items-center">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-10 md:mb-16 text-center">
        How Does It Work?
      </h2>

      <div className="max-w-6xl w-full space-y-8 md:space-y-12">
        {/* Render first full-width step (Connect Wallet) */}
        {fullWidthSteps[0] && <HowItWorksStep step={fullWidthSteps[0]} />}

        {/* Two-Column Section for Cards (List NFT, Accept Loan) */}
        {cardSteps.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {cardSteps.map(step => (
              <HowItWorksStep key={step.id} step={step} />
            ))}
          </div>
        )}

        {/* Render second full-width step (Repay Loan) */}
        {fullWidthSteps[1] && <HowItWorksStep step={fullWidthSteps[1]} />}
      </div>
    </section>
  );
};

export default HowItWorks;
