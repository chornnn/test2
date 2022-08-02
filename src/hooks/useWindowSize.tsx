import { useState, useEffect } from 'react';
import throttle from 'lodash/throttle';

export function useWindowSize() {
  const isWindowClient = typeof window === 'object';

  const [isDesktop, setIsDesktop] = useState(
    isWindowClient ? window.innerWidth > 768 : false
  );

  useEffect(() => {
    function setSize() {
      setIsDesktop(window.innerWidth > 768);
    }

    const throttledSetSize = throttle(setSize, 200);

    if (isWindowClient) {
      window.addEventListener('resize', throttledSetSize);

      //un-register the listener
      return () => window.removeEventListener('resize', setSize);
    }
  }, [isWindowClient, setIsDesktop]);

  return { isDesktop };
}
