import React, { useState } from 'react';
import classNames from 'classnames';
import { AiOutlineClose } from 'react-icons/ai';

import SlideUpModal from '@components/SlideUpModal';
import { Selection } from '@types';

import styles from './index.module.scss';

interface SingleSelectionModalProps {
  className?: string;
  show?: boolean;
  onSelect?: (data: string) => void;
  onClose?: () => void;
  data?: Selection[];
  title?: string;
}

const SingleSelectionModal: React.FC<SingleSelectionModalProps> = (props) => {
  const {
    onClose,
    className,
    show = false,
    onSelect,
    data = [],
    title,
  } = props;

  const [buttons, setButtons] = useState<Selection[]>(data);
  const [selectIndex, setSelectIndex] = useState(-1);
  const [selectStr, setSelectStr] = useState('');

  const classesApply = classNames(styles['single-filter-clear-apply'], {
    [styles['single-filter-clear-apply-selected']]: selectIndex !== -1,
  });

  return (
    <SlideUpModal
      onClose={onClose}
      className={className}
      title={title}
      show={show}
    >
      <div className={styles['single-selection-model-panel-buttons']}>
        {buttons.map((button, index) => {
          const classes = classNames(
            styles['single-selection-model-panel-button'],
            {
              [styles['single-selection-model-panel-button-selected']]:
                index === selectIndex,
              [styles['single-selection-model-panel-button-stacked']]:
                buttons.length > 10,
            }
          );

          return (
            <button
              key={index}
              onClick={() => {
                if (index === selectIndex) {
                  setSelectIndex(-1);
                  setSelectStr('');
                  onSelect('');
                } else {
                  setSelectIndex(index);
                  setSelectStr(button.title);
                  onSelect(button.title);
                }
              }}
              className={classes}
            >
              {button.title}
            </button>
          );
        })}
      </div>

      <div className={styles['single-filter-button-area']}>
        <button
          className={styles['single-filter-clear-button']}
          onClick={() => {
            const choice = [...buttons];
            choice.forEach((button) => {
              button.selected = false;
            });
            setButtons(choice);
            setSelectIndex(-1);
            setSelectStr('');
            onSelect('');
          }}
        >
          clear
        </button>
        <button
          className={classesApply}
          disabled={selectIndex === -1}
          onClick={() => {
            onSelect(selectStr);
            onClose();
          }}
        >
          Apply
        </button>
      </div>
    </SlideUpModal>
  );
};

export default SingleSelectionModal;
