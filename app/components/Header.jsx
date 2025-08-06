"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, useScroll, useTransform } from 'framer-motion';

const DynamicHeader = () => {
  const [banners, setBanners] = useState([]);
  const targetRef = useRef(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get('/api/random-banners');
        setBanners(response.data.slice(0, 6));
      } catch (error) {
        console.error("Failed to fetch banners for the header:", error);
      }
    };
    fetchBanners();
  }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  // --- THIS IS THE FIX ---
  // All Hooks are now called at the top level, in the same order on every render.
  
  // 1. Create all opacity transforms upfront.
  const opacities = [
    useTransform(scrollYProgress, [0, 0.15], [0, 1]),
    useTransform(scrollYProgress, [0.15, 0.3], [0, 1]),
    useTransform(scrollYProgress, [0.3, 0.45], [0, 1]),
    useTransform(scrollYProgress, [0.45, 0.6], [0, 1]),
    useTransform(scrollYProgress, [0.6, 0.75], [0, 1]),
    useTransform(scrollYProgress, [0.75, 0.9], [0, 1]),
  ];

  // 2. Create all scale transforms upfront, based on the opacity transforms.
  const scales = opacities.map(opacity => 
    useTransform(opacity, [0, 1], [0.9, 1])
  );

  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div ref={targetRef} className="relative w-full h-[300vh]">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        <motion.div className="relative flex justify-center items-start z-20 text-center text-black p-4">
          <h1 className="text-[20vw] font-semibold leading-none drop-shadow-lg">prepMate<span className='text-4xl headline'>@i</span></h1>
        </motion.div>

        <div className="absolute inset-0">
            {banners.map((banner, index) => {
                const positions = [
              { top: '15%', left: '10%' },
              { top: '25%', right: '12%' },
              { bottom: '20%', left: '18%' },
              { bottom: '10%', right: '30%' },
              { top: '5%', right: '35%' },
              { bottom: '20%', left: '40%' },
                ];

                return (
                    <motion.div
                        key={index}
                        style={{
                            opacity: opacities[index],
                            scale: scales[index],
                            ...positions[index],
                        }}
                        className="absolute  w-80 h-[30vh] rounded-xl overflow-hidden shadow-2xl border-2 border-white/20"
                    >
                        <img 
                            src={banner.bannerImageUrl} 
                            alt={banner.courseName || `Course banner ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default DynamicHeader;