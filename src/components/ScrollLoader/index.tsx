import React, { useRef, useEffect, useState } from 'react';

import styles from './style.module.scss';

interface ScrollLoaderProps {
  loadMore?: any;
  isInitialLoading?: boolean;
  hasMore?: boolean;
  onScrollUp?: () => void;
  onScrollDown?: () => void;
  className?: string;
  swipeHandlers?: any;
}

const ScrollLoader: React.FC<ScrollLoaderProps> = (props) => {
  const { children, className, hasMore, loadMore, isInitialLoading } = props;

  const [isLoading, setIsLoading] = useState(false);
  const scrollEl = useRef<HTMLDivElement>(null);
  const loading = isLoading || isInitialLoading;

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });
    if (scrollEl.current && !loading) {
      observer.observe(scrollEl.current.lastElementChild);
    }
    return () => {
      observer.disconnect();
    };
  }, [scrollEl.current, loading]);

  function handleObserver(entries: any) {
    if (entries[0].isIntersecting && hasMore) {
      setIsLoading(true);
      if (loadMore) {
        loadMore(() => {
          setIsLoading(false);
        });
      }
    }
  }

  const footer = hasMore ? (
    <div className={styles['tloader-footer']}>
      <div className={styles['tloader-loading']}>
        <i className={styles['ui-loading']} />
      </div>
    </div>
  ) : (
    children !== 0 && (
      <div className={styles['tloader-footer']}>
        <div className={styles['tloader-no-more']}>there are no more items</div>
      </div>
    )
  );

  return (
    <div className={className} id="myScroll">
      <div className={styles['tloader-body']} ref={scrollEl}>
        {children !== 0 && children}
      </div>
      {footer}
    </div>
  );
};

export default ScrollLoader;
