import React from 'react';
import { CSSTransition } from 'react-transition-group';

import styles from './index.module.scss';

interface ZoomInProps {
  in: boolean;
}

const ZoomIn: React.FC<ZoomInProps> = (props) => {
  const { in: isIn, children } = props;
  return (
    <CSSTransition
      in={isIn}
      timeout={30000}
      classNames={{
        enter: styles['zoom-in-enter'],
        enterActive: styles['zoom-in-enter-active'],
        eixt: styles['zoom-in-exit'],
        exitActive: styles['zoom-in-exit-active'],
      }}
      appear
      unmountOnExit
    >
      {children}
    </CSSTransition>
  );
};

export default ZoomIn;
