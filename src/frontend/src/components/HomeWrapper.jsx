import React, { useState } from "react";
import { motion } from "framer-motion";

const HomeWrapper = () => {
    const positions = [
        { top: 0, left: -50, rotate: -10, zIndex: 10 },
        { top: 0, left: 80, rotate: 0, zIndex: 20 },
        { top: 0, left: 210, rotate: 10, zIndex: 10 },
    ];

    const [imagePositions, setImagePositions] = useState([
        { id: "left-img", posIndex: 0 },
        { id: "top-img", posIndex: 1 },
        { id: "right-img", posIndex: 2 },
    ]);

    const handleImageClick = () => {
        setImagePositions((prev) =>
            prev.map((img) => ({
                ...img,
                posIndex: (img.posIndex + 1) % 3,
            }))
        );
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-r from-black via-[#1a0a2a] to-black flex items-center justify-center px-6">
            <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between">
                {/* Text section */}
                <motion.div
                    className="text-white space-y-4 mb-10 md:mb-0 w-full md:w-1/2"
                    initial={{ x: -150, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.7 }}
                >
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                        Decentralized NFT Lending
                    </h1>
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                        Made <span className="text-purple-400">Seamless</span>
                    </h1>
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                        That People <span className="text-purple-500">Love</span>.
                    </h1>
                </motion.div>

                {/* Image section */}
                <motion.div
                    className="relative w-[520px] h-[280px]"
                    initial={{ x: 150, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                    viewport={{ once: true, amount: 0.7 }}
                >
                    {imagePositions.map((img, index) => {
                        const pos = positions[img.posIndex];
                        return (
                            <motion.div
                                key={img.id}
                                onClick={handleImageClick}
                                className="absolute w-[320px] h-[280px] rounded-xl shadow-xl border border-green-400 overflow-hidden bg-black cursor-pointer"
                                animate={{
                                    top: pos.top,
                                    left: pos.left,
                                    rotate: pos.rotate,
                                    zIndex: pos.zIndex,
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                                <img
                                    src={`/img/Nfts/${index === 0 ? "1.webp" : index === 1 ? "3.png" : "2.webp"
                                        }`}
                                    alt={`NFT ${img.id}`}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    );
};

export default HomeWrapper;