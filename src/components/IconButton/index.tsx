import classNames from 'classnames';
import React, { ButtonHTMLAttributes } from 'react';
import { FcGoogle, FcPhoneAndroid } from 'react-icons/fc';

import styles from './index.module.scss';

interface BaseButtonProps {
  name?: string;
  className?: string;
  children: React.ReactNode;
}

type NativeButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLElement>;

function icon(name) {
  switch (name) {
    case 'google':
      return <FcGoogle size={20} />;
    case 'phone':
      return <FcPhoneAndroid size={20} />;
    default:
      return null;
  }
}

const IconButton: React.FC<NativeButtonProps> = (props) => {
  const { children, className, name, onClick } = props;
  const classes = classNames(styles['icon-button'], className);
  return (
    <button className={classes} onClick={onClick}>
      <div className={styles['icon-image']}>{icon(name)}</div>
      <div className={styles['icon-title']}>{children}</div>
    </button>
  );
};

export default IconButton;
