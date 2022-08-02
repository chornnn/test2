import React from 'react';
import classNames from 'classnames';

import styles from './index.module.scss';

interface BaseTextProps {
  middleText?: string;
  className?: string;
}

const DividedLine: React.FC<BaseTextProps> = (props) => {
  const { middleText, className } = props;
  const classes = classNames(styles['divided-area'], className);

  return (
    <div className={classes}>
      <div className={styles['line-area']}>
        <div className={styles['middle-text']}>{middleText}</div>
      </div>
    </div>
  );
};

export default DividedLine;
