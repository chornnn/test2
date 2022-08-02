import React, { InputHTMLAttributes } from 'react';
import classNames from 'classnames';
import { BsFillCaretDownFill } from 'react-icons/bs';

import styles from './index.module.scss';

interface BaseTextProps extends InputHTMLAttributes<HTMLElement> {
  className?: string;
  placeholder?: string;
  children?: React.ReactNode;
  inputClassName?: string;
  data?: string;
}

const SingleSelectionLabel: React.FC<BaseTextProps> = (props) => {
  const {
    children,
    className,
    placeholder = 'Choose your interests',
    required = false,
    onChange,
    onClick,
    data,
  } = props;
  const classes = classNames(styles['singer-selection-container'], className);

  return (
    <div className={classes}>
      <div className={styles['singer-selection-container-title']}>
        {children}{' '}
        {required && (
          <span className={styles['simple-input-container-title-required']}>
            *
          </span>
        )}
      </div>
      <div onClick={onClick} className={styles['single-selection-container']}>
        {!data && (
          <span className={styles['span-placeholder']}>{placeholder}</span>
        )}
        {data && <span className={styles['span-text']}>{data}</span>}
        <div className={styles['right-arrow']}>
          <BsFillCaretDownFill />
        </div>
      </div>
    </div>
  );
};

export default SingleSelectionLabel;
