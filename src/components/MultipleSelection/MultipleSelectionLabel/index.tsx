import React, { useState } from 'react';
import classNames from 'classnames';

import { BsFillCaretDownFill } from 'react-icons/bs';

import styles from './index.module.scss';
interface BaseTextProps {
  className?: string;
  placeholder?: string;
  children?: React.ReactNode;
  inputClassName?: string;
  onClick: () => void;
  datas?: string[];
  required?: boolean;
}

const MultipleSelectionLabel: React.FC<BaseTextProps> = (props) => {
  const {
    children,
    className,
    placeholder,
    inputClassName,
    onClick,
    datas = [],
    required = false,
  } = props;
  const classes = classNames(styles['multiple-selection-container'], className);

  const [choose, setChoose] = useState('');

  return (
    <div className={classes}>
      <div className={styles['multiple-selection-container-title']}>
        {children}{' '}
        {required && (
          <span className={styles['simple-input-container-title-required']}>
            *
          </span>
        )}
      </div>
      <div onClick={onClick} className={styles['multiple-selection-items']}>
        {datas.length === 0 && (
          <span className={styles['span-placeholder']}>
            Choose your interests
          </span>
        )}
        {datas.length > 0 && (
          <div className={styles['show-datas']}>
            {datas.map((name) => {
              return <div className={styles['item-data']}>{name}</div>;
            })}
          </div>
        )}
        <div className={styles['right-arrow']}>
          <BsFillCaretDownFill />
        </div>
      </div>
    </div>
  );
};

export default MultipleSelectionLabel;
