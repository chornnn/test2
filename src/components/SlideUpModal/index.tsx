import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { AiOutlineClose } from 'react-icons/ai';
import { CSSTransition } from 'react-transition-group';

import { useWindowSize } from '@hooks';

import styles from './index.module.scss';

interface SlideUpModalProps {
  className?: string;
  show?: boolean;
  onClose?: () => void;
  title: string;
}

const SlideUpModal: React.FC<SlideUpModalProps> = (props) => {
  const { onClose, className, show = false, children, title } = props;
  const [isShow, setIsShow] = useState(show);
  const classes = classNames(styles['modal-container'], className, {
    [styles['modal-container-hidden']]: !isShow,
  });
  const { isDesktop } = useWindowSize();
  const timeout = isDesktop ? { enter: 0, exit: 0 } : { enter: 200, exit: 400 };

  useEffect(() => {
    if (!show) {
      setTimeout(() => {
        setIsShow(show);
      }, timeout.enter);
    } else {
      setIsShow(show);
    }
  }, [show]);

  return (
    <div className={classes}>
      <CSSTransition
        in={show}
        timeout={timeout}
        classNames={{
          enter: styles['pageSlider-enter'],
          enterActive: styles['pageSlider-enter-active'],
          enterDone: styles['pageSlider-enter-done'],
          eixt: styles['pageSlider-exit'],
          exitActive: styles['pageSlider-exit-active'],
          exitDone: styles['pageSlider-exit-done'],
        }}
        appear
        unmountOnExit
      >
        <div className={styles['modal-panel']}>
          <div className={styles['modal-panel-title']}>
            <div>{title}</div>
            <div className={styles['close-icon']} onClick={onClose}>
              <AiOutlineClose />
            </div>
          </div>
          {children}
        </div>
      </CSSTransition>
    </div>
  );
};

export default SlideUpModal;
