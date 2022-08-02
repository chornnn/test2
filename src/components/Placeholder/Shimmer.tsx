import React from 'react';

import styles from './shimmer.module.scss';

interface IShimmerProps {
  width?: string;
  height?: string;
  margin?: string;
}

export const Shimmer: React.FC<IShimmerProps> = (props) => {
  const { width = '40px', height = '40px', margin = '0' } = props;
  return (
    <div
      className={styles.shimmer}
      style={{
        width,
        height,
        margin,
      }}
    />
  );
};
