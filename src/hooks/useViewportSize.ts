import { useState, useEffect } from 'react';

interface ViewportSize {
  width: number;
  height: number;
  scale: number;
}

export const useViewportSize = (maxWidth: number = 720): ViewportSize => {
  const [size, setSize] = useState<ViewportSize>({
    width: window.innerWidth,
    height: window.innerHeight,
    scale: Math.min(1, window.innerWidth / maxWidth)
  });

  useEffect(() => {
    const updateSize = () => {
      const width = Math.min(window.innerWidth, maxWidth);
      const scale = Math.min(1, window.innerWidth / maxWidth);
      const height = window.innerHeight;
      
      setSize({ width, height, scale });
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, [maxWidth]);

  return size;
};