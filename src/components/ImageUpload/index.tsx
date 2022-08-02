import React, { InputHTMLAttributes, useState } from 'react';
import classNames from 'classnames';
import { AiOutlinePlus } from 'react-icons/ai';

import styles from './index.module.scss';

interface BaseTextProps extends InputHTMLAttributes<HTMLElement> {
  onChange?: (file: any) => void;
}

const ImageUpload: React.FC<BaseTextProps> = (props) => {
  const { className, onChange } = props;

  const classes = classNames(styles['upload-container'], className);
  return (
    <div className={classes}>
      <input
        id="file"
        type="file"
        accept="image/*"
        className={styles['upload-input-normal']}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);

            onChange(e.target.files[0]);
          }
        }}
      />
      <label htmlFor="file" className={styles['upload-label-normal']}>
        <AiOutlinePlus size={60} />
      </label>
    </div>
  );
};

export default ImageUpload;
