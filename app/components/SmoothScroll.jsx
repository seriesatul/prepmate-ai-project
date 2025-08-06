"use client"; // 1. Mark this component as a Client Component

import { useEffect, useRef } from 'react';

const SmoothScroll = ({ children }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    // 2. Use a dynamic import for the library.
    // This ensures LocomotiveScroll is only imported on the client-side.
    const importLocomotiveScroll = async () => {
      try {
        const LocomotiveScroll = (await import('locomotive-scroll')).default;

        if (scrollRef.current) {
          // 3. Initialize Locomotive Scroll inside useEffect.
          // useEffect with an empty dependency array [] only runs in the browser
          // after the component has mounted.
          const scroll = new LocomotiveScroll({
            el: scrollRef.current,
            smooth: true,
            // Add any other options you need
          });

          // 4. It's crucial to destroy the instance on unmount to avoid memory leaks
          return () => {
            if (scroll) scroll.destroy();
          };
        }
      } catch (error) {
        console.error("Could not import Locomotive Scroll", error);
      }
    };

    importLocomotiveScroll();
  }, []); // The empty array ensures this effect runs only once

  return (
    // 5. Apply the required data attribute to the main container
    <div ref={scrollRef} data-scroll-container>
      {children}
    </div>
  );
};

export default SmoothScroll;