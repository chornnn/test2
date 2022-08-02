import React, { InputHTMLAttributes } from 'react';
import classNames from 'classnames';

import styles from './index.module.scss';

interface BaseTextProps extends InputHTMLAttributes<HTMLElement> {
  className?: string;
  placeholder?: string;
  children: React.ReactNode;
  inputClassName?: string;
  required?: boolean;
  showLabel?: boolean;
}

const CommonInput: React.FC<BaseTextProps> = (props) => {
  const {
    value,
    children,
    className,
    placeholder,
    onChange,
    inputClassName,
    defaultValue,
    disabled,
    required = false,
    type,
    showLabel = true,
    step,
    min,
    max,
  } = props;
  const classes = classNames(styles['simple-input-container'], className);
  const mixInputClassName = classNames(
    styles['simple-input-container-input'],
    inputClassName
  );

  return (
    <div className={classes}>
      {showLabel && (
        <div className={styles['simple-input-container-title']}>
          {children}{' '}
          {required && (
            <span className={styles['simple-input-container-title-required']}>
              *
            </span>
          )}{' '}
        </div>
      )}

      <input
        type={type}
        disabled={disabled}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        className={mixInputClassName}
        placeholder={placeholder}
        step={step}
        min={min}
        max={max}
      />
    </div>
  );
};

export default CommonInput;
