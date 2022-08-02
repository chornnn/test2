import React from 'react';
import ReactDOM from 'react-dom';
import Image from 'next/image';
import { AiOutlineClose } from 'react-icons/ai';

import logoUrl from '@images/logo-group.png';

import styles from './index.module.scss';

interface IToastPros {
  show: (message: string, delay?, showLogo?) => void;
  showLogo?: boolean;
  destroy: () => void;
}

function createToastNotification(): IToastPros {
  const div = document.createElement('div');
  div.className = 'toast';
  document.getElementById('__next').appendChild(div);

  return {
    show(message, delay, showLogo) {
      ReactDOM.render(
        <Toast
          showLogo={showLogo}
          showClose={delay === 0}
          onClose={() => {
            this.destroy();
            notification = undefined;
          }}
        >
          {message}
        </Toast>,
        div
      );

      let clear;
      if (delay) {
        if (clear) {
          clearTimeout(clear);
        }
        clear = setTimeout(() => {
          ReactDOM.unmountComponentAtNode(div);
          document.getElementById('__next').removeChild(div);
          notification = undefined;
        }, delay);
      }
    },
    destroy() {
      ReactDOM.unmountComponentAtNode(div);
      document.getElementById('__next').removeChild(div);
    },
  };
}

let notification: IToastPros;
const showToast = (message, delay?, showLogo?) => {
  if (notification !== undefined) {
    return;
  }
  notification = createToastNotification();
  // notification
  notification.show(message, delay);
};

const hiddenToast = () => {
  notification.destroy();
  notification = undefined;
};

interface IBasePros {
  children: React.ReactNode;
  showLogo?: boolean;
  showClose?: boolean;
  onClose?: () => void;
}

const Toast: React.FC<IBasePros> = (props) => {
  const { children, showLogo, showClose, onClose } = props;

  return (
    <div className={styles['toast-container']}>
      {showLogo && (
        <div className={styles['board-img']}>
          <Image src={logoUrl} layout="fill" objectFit="contain" />
        </div>
      )}
      {showClose && (
        <div className={styles['close-btn']} onClick={onClose}>
          <AiOutlineClose color="#fff" />
        </div>
      )}
      <div className={styles['toast']}>{children}</div>
    </div>
  );
};

export { showToast, hiddenToast };
