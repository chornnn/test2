import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import logoUrl from '@images/logo-group.png';

import styles from './index.module.scss';

const Footer: React.FC = (props) => {
  const router = useRouter();

  return (
    <footer className={styles['simple-header']} onClick={() => router.push('/')}>
      <div className={styles['logo-img']}>
        <Image src={logoUrl} layout="fill" objectFit="cover" alt="logo" />
      </div>
      <div className={styles['logo-title']}>Grouphub</div>
    </footer>
  );
};

export default Footer;
