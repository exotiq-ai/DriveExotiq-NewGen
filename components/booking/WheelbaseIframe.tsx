'use client';

import { useEffect, useRef, useState } from 'react';

export default function WheelbaseIframe() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Generate a unique key on each component mount to force fresh iframe load
  // This helps bypass any cached vehicle selection from previous sessions
  const [iframeKey] = useState(() => Date.now());

  useEffect(() => {
    let iframeResizerInstance: any = null;
    const currentIframe = iframeRef.current;

    // Dynamically import iframe-resizer to avoid SSR issues
    const loadIframeResizer = async () => {
      try {
        // @ts-ignore - iframe-resizer doesn't have perfect TypeScript support
        const iframeResizer = (await import('iframe-resizer/js/iframeResizer')).default;
        
        if (currentIframe && iframeResizer) {
          // Initialize iframe resizer
          iframeResizerInstance = iframeResizer({
            log: false,
            checkOrigin: false,
            heightCalculationMethod: 'lowestElement',
          }, currentIframe);
        }
      } catch (error) {
        console.error('Failed to load iframe-resizer:', error);
      }
    };

    loadIframeResizer();

    // Cleanup
    return () => {
      if (currentIframe && iframeResizerInstance) {
        try {
          // @ts-ignore
          if (iframeResizerInstance.removeListeners) {
            iframeResizerInstance.removeListeners(currentIframe);
          }
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    };
  }, [iframeKey]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  // Wheelbase checkout URL using owner_id parameter
  // This format lands on the fleet grid view showing all available vehicles
  const wheelbaseUrl = 'https://checkout.wheelbasepro.com/reserve?color=000000&newfilters=true&owner_id=4533628';

  return (
    <div className="w-full relative">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10" style={{ minHeight: '400px' }}>
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-gulf-blue border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-500 text-sm">Loading fleet...</span>
          </div>
        </div>
      )}
      
      {/* Iframe - key prop forces React to recreate on remount for fresh state */}
      <iframe
        key={iframeKey}
        ref={iframeRef}
        src={wheelbaseUrl}
        className="w-full border-0"
        title="Wheelbase Booking"
        allow="payment"
        onLoad={handleIframeLoad}
        style={{ 
          minHeight: '2400px',  // Accommodates full fleet grid + detail views
          height: 'auto',
          display: 'block',
        }}
      />
    </div>
  );
}
