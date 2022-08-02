import classNames from 'classnames';
import React from 'react';

import styles from './index.module.scss';
interface BaseSliderProps {
  children?: React.ReactNode;
  className?: string;
}

// import IconButton from "@/components/IconButton";
const Slider: React.FC<BaseSliderProps> = (props) => {
  const { children, className } = props;

  const classes = classNames(styles['slider-model-panel-areas'], className);
  return (
    <div className={classes}>
      <div className={styles['slider-model-panel-area-active']}>Relevance</div>
      <div className={styles['slider-model-panel-area']}>Hottest</div>
      <div className={styles['slider-model-panel-area']}>Newest</div>
    </div>
  );
};

export default Slider;
