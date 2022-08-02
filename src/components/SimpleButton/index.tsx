import React, { ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';

import styles from './index.module.scss';

interface BaseButtonProps {
  children: React.ReactNode;
  className?: string;
}
type NativeButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLElement>;

const SimpleButton: React.FC<NativeButtonProps> = (props) => {
  const { children, className, onClick } = props;

  const classes = classNames(styles['simple-button'], className);
  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
};

export default SimpleButton;
