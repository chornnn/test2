import React, {
  useEffect,
  InputHTMLAttributes,
  LegacyRef,
  Ref,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import TextareaAutosize from 'react-textarea-autosize';
import styles from './index.module.scss';
import { showToast } from '../Toast';

interface BaseTextProps extends InputHTMLAttributes<HTMLElement> {
  className?: string;
  placeholder?: string;
  children?: React.ReactNode;
  inputClassName?: string;
  required?: boolean;
  showLabel?: boolean;
  myTextAreaClass?: string;
  focus?: Number;
  errorMessage?: string;
}

const CommonTextAreaAutoSize: React.FC<BaseTextProps> = (props) => {
  const {
    value,
    focus,
    children,
    className,
    placeholder,
    onChange,
    errorMessage,
    inputClassName,
    defaultValue,
    disabled,
    myTextAreaClass,
    required = false,
    type,
    showLabel = true,
  } = props;
  const baseElement = useRef<HTMLTextAreaElement>();
  useEffect(() => {
    if (baseElement && focus !== 0) {
      baseElement.current.focus();
    }
  }, [focus]);

  const classes = classNames(styles['common-text-area-container'], className);
  const mixInputClassName = classNames(
    styles['common-text-area-container-input'],
    inputClassName
  );
  const myTextAreaClasses = classNames(styles['my-text-area'], myTextAreaClass);
  return (
    <div className={classes}>
      {showLabel && (
        <div className={styles['common-text-area-container-title']}>
          {children}{' '}
          {required && (
            <span className={styles['common-text-area-container-title-required']}>
              *
            </span>
          )}{' '}
        </div>
      )}
      <TextareaAutosize
        ref={baseElement}
        placeholder={placeholder}
        style={{
          display: 'block',
          boxShadow: 'none',
          boxSizing: 'border-box',
        }}
        rows={4}
        value={value}
        className={myTextAreaClasses}
        onChange={(e) => {
          // setCommentText(e.target.value)
          // count.current = e.target.value.length;
          if (e.target.value.length > 200 || e.target.value.length < 5000) {
            // setInputStr(e.target.value)
          } else {
            showToast(errorMessage, 3000);
          }
          if (onChange) {
            onChange(e);
          }
        }}
      />
      {/* <input type={type} disabled={disabled} defaultValue={defaultValue} onChange={onChange} className={mixInputClassName} placeholder={placeholder} /> */}
    </div>
  );
};

export default CommonTextAreaAutoSize;
