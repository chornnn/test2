import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import ArrowLeft from '@images/ArrowLeft.png';

import styles from './index.module.scss';

interface BackHeaderProps {
  title: string;
}

const Header: React.FC<BackHeaderProps> = (props) => {
  const router = useRouter();

  return (
    <div className={styles['header-back-fixed']}>
      <div className={styles['header-back-image']}>
        <Image
          onClick={() => {
            router.back();
          }}
          src={ArrowLeft}
        />
      </div>
      <div className={styles['header-back-title']}>{props.title}</div>
    </div>
  );
};

export const BackHeader = React.memo(Header);
