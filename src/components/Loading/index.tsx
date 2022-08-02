import React, { ReactElement } from 'react';
import ReactDOM from 'react-dom';
import styles from './index.module.scss';

interface ILoadingPros {
  show: (text?: string) => void;
  destroy: () => void;
}

function createNotification(): ILoadingPros {
  const div = document.createElement('div');
  div.className = styles['loading-model-container'];
  document.getElementById('__next').appendChild(div);

  return {
    show(text) {
      ReactDOM.render(<LoadingModel text={text} />, div);
    },
    destroy() {
      ReactDOM.unmountComponentAtNode(div);
      document.getElementById('__next').removeChild(div);
    },
  };
}

let notification: ILoadingPros;
const showLoading = (text?: string) => {
  if (notification !== undefined) {
    return;
  }
  notification = createNotification();
  notification.show(text);
};

const hideLoading = () => {
  if (notification) {
    notification.destroy();
    notification = undefined;
  }
};

interface ILoadingModelProps {
  text?: string;
}

const LoadingModel: React.FC<ILoadingModelProps> = (props) => {
  const { text } = props;
  return (
    <div className={styles['loading-model-panel-dark']}>
      <div className={styles['loading-text']}>{text}</div>
      <div className={styles['sk-chase']}>
        <div className={styles['sk-chase-dot']}></div>
        <div className={styles['sk-chase-dot']}></div>
        <div className={styles['sk-chase-dot']}></div>
        <div className={styles['sk-chase-dot']}></div>
        <div className={styles['sk-chase-dot']}></div>
        <div className={styles['sk-chase-dot']}></div>
      </div>
    </div>
  );
};

export { showLoading, hideLoading };
