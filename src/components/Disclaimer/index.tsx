import React from 'react';

import styles from './index.module.scss';

const Disclaimer: React.FC = () => {
  return (
    <div className={styles['privacy-policy']}>
      By continue, you acknowledge that you have read the
      <span className={styles['span-bold']}> Privacy Policy </span>
      and agree to the
      <span className={styles['span-bold']}> Term of Service. </span>
    </div>
  );
};

export default Disclaimer;
