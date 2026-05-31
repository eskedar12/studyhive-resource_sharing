import { useEffect, useRef } from 'react';

const useInfiniteScroll = (callback, hasMore) => {
  const observerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          callback();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [callback, hasMore]);

  return observerRef;
};

export default useInfiniteScroll;