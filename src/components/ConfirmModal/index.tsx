import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

import styles from './index.module.scss';

interface IToastPros {
  show: (
    message: string,
    confirmCallback: () => void,
    confirmText?: string
  ) => void;
  destroy: () => void;
}

let div: HTMLDivElement;
function createConfirmModal(): IToastPros {
  function destory() {
    ReactDOM.unmountComponentAtNode(div);
    document.getElementById('__next').removeChild(div);
  }

  return {
    show(message, confirmCallback, confirmText) {
      div = document.createElement('div');
      document.getElementById('__next').appendChild(div);

      ReactDOM.render(
        <ConfirmModal
          message={message}
          confirmCallback={() => {
            confirmCallback();
            destory();
          }}
          cancelCallback={destory}
          confirmText={confirmText}
        />,
        div
      );
    },
    destroy: destory,
  };
}

let modal: IToastPros;
const showConfirmModal = (message, confirmCallback, confirmText?) => {
  modal = createConfirmModal();
  modal.show(message, confirmCallback, confirmText);
};

const hideConfirmModal = () => {
  modal.destroy();
};

interface IBasePros {
  message: string;
  confirmText?: string;
  confirmCallback: () => void;
  cancelCallback: () => void;
}

const ConfirmModal: React.FC<IBasePros> = (props) => {
  const { message, confirmText, confirmCallback, cancelCallback } = props;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <>
      <div className={styles.backdrop} />
      <div className={styles['modal-container']}>
        <div className={styles['modal-text']}>{message}</div>
        <div className={styles['modal-buttons']}>
          <button className={styles.cancel} onClick={cancelCallback}>
            Cancel
          </button>
          <button className={styles.confirm} onClick={confirmCallback}>
            {confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </>
  );
};

export { showConfirmModal, hideConfirmModal, ConfirmModal };
