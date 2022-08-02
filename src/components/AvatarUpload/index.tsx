import React, { InputHTMLAttributes, useState } from 'react';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import classNames from 'classnames';
import Image from 'next/image';

import upload from '@images/upload.png';
import { hideLoading, showLoading } from '@components/Loading';

import styles from './index.module.scss';

interface BaseTextProps extends InputHTMLAttributes<HTMLElement> {
  currentImage?: string;
  onChange?: (file: any) => void;
}

const AvatarUpload: React.FC<BaseTextProps> = (props) => {
  const { currentImage, className, onChange } = props;

  const [myUpload, setMyUpload] = useState(currentImage || upload);
  const classes = classNames(styles['upload-container'], className);

  function uploadFile(file) {
    var storage = getStorage();
    const imageRef = ref(storage, 'avatar/' + file.name);
    showLoading('Upload image. Please wait...');

    const uploadTask = uploadBytesResumable(imageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        console.log(error);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          onChange(downloadURL);
          hideLoading();
        });
      }
    );
  }

  return (
    <div className={classes}>
      <input
        id="file"
        accept="image/*"
        type="file"
        className={styles['upload-input']}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onloadend = () => {
              const url = reader.result as string;
              setMyUpload(url);
            };

            uploadFile(e.target.files[0]);
          }
        }}
      />
      <label htmlFor="file" className={styles['upload-label']}>
        <div className={styles['upload-label-image']}>
          <Image src={myUpload} width={80} height={80} />
        </div>
      </label>
    </div>
  );
};

export default AvatarUpload;
