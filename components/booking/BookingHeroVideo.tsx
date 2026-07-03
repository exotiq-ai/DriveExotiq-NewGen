'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function BookingHeroVideo() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Detect mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Check user preferences for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Check connection quality (if supported)
    // @ts-ignore - experimental API
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const hasGoodConnection = !connection || connection.effectiveType === '4g' || connection.effectiveType === '3g';

    // Only load video if good connection and no reduced motion preference
    if (!prefersReducedMotion && hasGoodConnection) {
      // Delay video load slightly to prioritize critical content
      const timer = setTimeout(() => setShouldLoadVideo(true), 300);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', checkMobile);
      };
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Pause video when scrolled past hero section
    const handleScroll = () => {
      if (videoRef.current) {
        if (window.scrollY > window.innerHeight * 0.7) {
          videoRef.current.pause();
        } else if (shouldLoadVideo && window.scrollY < window.innerHeight * 0.7) {
          videoRef.current.play().catch(() => {
            // Autoplay failed, video will remain paused
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [shouldLoadVideo]);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Poster/Fallback Image - Always shows immediately */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isLoaded && shouldLoadVideo ? 'opacity-0' : 'opacity-100'}`}>
        <Image
          src="/images/cars/Audi_S8_tortillaflats_adamkiss.jpg"
          alt="Audi S8 at Tortilla Flats"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* Video - Loads conditionally based on connection and preferences */}
      {shouldLoadVideo && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setIsLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* WebM for modern browsers (better compression) */}
          <source
            src={isMobile ? "/videos/booking-hero-mobile.webm" : "/videos/booking-hero-desktop.webm"}
            type="video/webm"
          />
          {/* MP4 fallback for broader compatibility */}
          <source
            src={isMobile ? "/videos/booking-hero-mobile.mp4" : "/videos/booking-hero-desktop.mp4"}
            type="video/mp4"
          />
        </video>
      )}

      {/* Lighter gradient overlay - let the video shine through */}
      <div className="absolute inset-0 bg-gradient-to-b from-deep-black/50 via-deep-black/20 to-deep-black/60" />
    </div>
  );
}
