import React, { InputHTMLAttributes, useState } from 'react';
import classNames from 'classnames';
import { BiSearch, BiX } from 'react-icons/bi';

import styles from './index.module.scss';

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  placeholder?: string;
  children?: React.ReactNode;
  inputClassName?: string;
  value?: string;
  onClear?: () => void;
  onCancel?: () => void;
}

const SearchInput: React.FC<SearchInputProps> = (props) => {
  const [cancelAppear, setCancelAppear] = useState(false);
  const {
    className,
    placeholder = 'Find groups',
    onChange,
    onFocus,
    autoFocus,
    value,
    onClear,
    onCancel,
  } = props;

  const clearClass = classNames(styles['clear-icon'], {
    [styles['clear-icon-appear']]: value !== undefined && value.length > 0,
  });

  const classes = classNames(styles['search-input'], className);
  return (
    <>
      <div className={classes}>
        <div className={styles['search-icon']}>
          <BiSearch />
        </div>
        <input
          placeholder={placeholder}
          value={value}
          autoFocus={autoFocus}
          onChange={(event) => {
            if (onChange) {
              onChange(event);
            }
          }}
          onFocus={(event) => {
            if (onFocus) {
              onFocus(event);
            }
            setCancelAppear(true);
          }}
          className={styles['inner-input']}
        />
        <div className={clearClass} onClick={onClear}>
          <BiX />
        </div>
      </div>
      {cancelAppear && (
        <div className={styles['cancel']} onClick={onCancel}>
          Cancel
        </div>
      )}
    </>
  );
};

export default SearchInput;
