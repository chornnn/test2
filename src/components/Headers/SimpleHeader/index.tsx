import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import logoUrl from '@images/logo-group.png';

import styles from './index.module.scss';

const Header: React.FC = (props) => {
  const router = useRouter();

  return (
    <div className={styles['simple-header']} onClick={() => router.push('/')}>
      <div className={styles['logo-img']}>
        <Image src={logoUrl} layout="fill" objectFit="cover" alt="Logo" />
      </div>
      <div className={styles['logo-title']}>Grouphub</div>
    </div>
  );
};

export const SimpleHeader = React.memo(Header);
