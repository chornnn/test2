import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { IGroup } from '@types';
import ShareButton from '@components/ShareModal/ShareButton';
import { AiOutlineClose } from 'react-icons/ai';
import { IoShareOutline } from 'react-icons/io5';
import styles from './index.module.scss';

interface IToastPros {
  show: (
    group: IGroup,
    messageFirst: string,
    messageSecond: string,
  ) => void;
  destroy: () => void;
}

function destory() {
  ReactDOM.unmountComponentAtNode(div);
  document.getElementById('__next').removeChild(div);
}

let div: HTMLDivElement;
function createShareModal(): IToastPros {

  return {
    show(group, messageFirst, messageSecond): void {
      div = document.createElement('div');
      document.getElementById('__next').appendChild(div);

      ReactDOM.render(
        <ShareModal
          group={group}
          messageFirst={messageFirst}
          messageSecond={messageSecond}
          cancelCallback={destory}
        />,
        div
      );
    },
    destroy: destory,
  };
}

let modal: IToastPros;
const showShareModal = (group, messageFirst, messageSecond) => {
  modal = createShareModal();
  modal.show(group, messageFirst, messageSecond);
};


interface IBasePros {
  group: IGroup;
  messageFirst: string;
  messageSecond?: string;
  cancelCallback: () => void;
}

const ShareModal: React.FC<IBasePros> = (props) => {
  const { group, messageFirst, messageSecond, cancelCallback } = props;

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
        <div className={styles['close-btn']} onClick={cancelCallback}>
          <AiOutlineClose />
        </div>
        <div className={styles['modal-text']}>
          {messageFirst}
          <br />
          {messageSecond}
        </div>
        <div className={styles['modal-buttons']}>
          <ShareButton group={group} onClick={cancelCallback} />
        </div>
      </div>
    </>
  );
};

export { showShareModal };
