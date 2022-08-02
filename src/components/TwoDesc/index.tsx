import React from 'react';

import styles from './index.module.scss';

interface BaseTextProps {
  title?: string;
  desc?: string;
  actionDesc?: string;

  clickEvent: () => void;
}

const TwoDesc: React.FC<BaseTextProps> = (props) => {
  const { title, desc, actionDesc, clickEvent } = props;

  return (
    <div className={styles['login-desc']}>
      <div className={styles['login-desc-title']}>{title}</div>
      <div className={styles['login-desc-subtitle']}>
        {desc}

        <span className={styles['login-desc-sign-up']} onClick={clickEvent}>
          {actionDesc}
        </span>
      </div>
    </div>
  );
};

export default TwoDesc;
