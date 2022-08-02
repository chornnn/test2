import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import { FaRegWindowClose } from 'react-icons/fa';

import SlideUpModal from '@components/SlideUpModal';
import { Selection } from '@types';

import styles from './index.module.scss';

interface MultipleSelectionModalProps {
  className?: string;
  title?: string;
  children?: React.ReactNode;
  show?: boolean;
  myConfirmCount?: number;
  maxSelect?: number;
  onSelect: (data: Selection[]) => void;
  onClose?: () => void;
  datas?: Selection[];
}

const MultipleSelectionModal: React.FC<MultipleSelectionModalProps> = (
  props
) => {
  const {
    onClose,
    myConfirmCount = 0,
    className,
    show = false,
    onSelect,
    datas = [],
    maxSelect = 1,
    title = 'Categories',
  } = props;

  const [buttons, setButtons] = useState<Selection[]>(datas);
  const confirmCount = useRef(0);
  const confirmed = useRef<string[]>([]);

  const classesApply = classNames(styles['multiple-filter-clear-apply'], {
    [styles['multiple-filter-clear-apply-selected']]:
      confirmCount.current !== 0,
  });

  return (
    <SlideUpModal
      onClose={onClose}
      show={show}
      className={className}
      title={title}
    >
      {/* <div className={styles['multiple-selection-model-panel-subtitle']}>
          You can choose more than one interest.
        </div> */}
      <div className={styles['multiple-selection-model-panel-buttons']}>
        {buttons.map((button, index) => {
          const classes = classNames(
            styles['multiple-selection-model-panel-button'],
            {
              [styles['multiple-selection-model-panel-button-selected']]:
                button.selected,
            }
          );

          return (
            <button
              onClick={() => {
                const copyButtons = [...buttons];
                copyButtons[index].selected = !copyButtons[index].selected;
                if (copyButtons[index].selected) {
                  confirmCount.current++;
                } else {
                  confirmCount.current--;
                }

                confirmed.current = [
                  ...confirmed.current,
                  copyButtons[index].title,
                ];
                while (confirmCount.current > maxSelect) {
                  const pop = confirmed.current.shift();
                  confirmCount.current--;
                  copyButtons.forEach((button) => {
                    if (button.title === pop) {
                      button.selected = false;
                    }
                  });
                }

                setButtons(copyButtons);
                onSelect(copyButtons);
              }}
              className={classes}
              key={index}
            >
              {button.title}
            </button>
          );
        })}
      </div>

      <div className={styles['multiple-filter-button-area']}>
        <button
          className={styles['multiple-filter-clear-button']}
          onClick={() => {
            const choice: Selection[] = [];
            buttons.forEach((button) => {
              button.selected = false;
              choice.push(button);
            });
            setButtons(buttons);
          }}
        >
          clear
        </button>
        <button
          className={classesApply}
          disabled={confirmCount.current < myConfirmCount}
          onClick={() => {
            onSelect(buttons);
            onClose();
          }}
        >
          Apply
        </button>
      </div>
    </SlideUpModal>
  );
};

export default MultipleSelectionModal;
