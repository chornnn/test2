import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';

import Slider from '../Slider';
import SlideUpModal from '@components/SlideUpModal';
import { Selection } from '@types';

import styles from './index.module.scss';

interface FilterProps {
  onClose?: () => void;
  value: Selection[];
  show?: boolean;
  title?: string;
  onApply: (selection: Selection[]) => void;
}

const FiterModal: React.FC<FilterProps> = (props) => {
  const { onClose, show, value, onApply, title } = props;
  const [buttons, setButtons] = useState<Selection[]>(
    JSON.parse(JSON.stringify(value))
  );
  const confirmCount = useRef(value.filter((item) => item.selected).length);
  const confirmed = useRef<string[]>(
    value.filter((item) => item.selected).map((item) => item.title)
  );

  useEffect(() => {
    confirmCount.current = value.filter((item) => item.selected).length;
    confirmed.current = value
      .filter((item) => item.selected)
      .map((item) => item.title);
    setButtons(value);
  }, [value]);

  return (
    <SlideUpModal onClose={onClose} title={title} show={show}>
      {/* <div className={styles['all-filter-section']}>
          <div className={styles['all-filter-sort-by-title']}>Sort by</div>
          <Slider></Slider>
        </div> */}

      <div className={styles['all-filter-section']}>
        <div
          className={
            styles['all-filter-multiple-selection-model-panel-buttons']
          }
        >
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
                  while (confirmCount.current > 1) {
                    const pop = confirmed.current.shift();
                    confirmCount.current--;
                    copyButtons.forEach((button) => {
                      if (button.title === pop) {
                        button.selected = false;
                      }
                    });
                  }

                  setButtons(copyButtons);
                }}
                className={classes}
                key={index}
              >
                {button.title}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={`${styles['all-filter-section']} ${styles['filter-button-area']}`}
      >
        <button
          className={styles['filter-clear-button']}
          onClick={() => {
            const cleared = [...buttons];
            cleared.forEach((item) => (item.selected = false));
            setButtons(cleared);
          }}
        >
          Clear
        </button>
        <button
          className={styles['filter-clear-apply']}
          onClick={() => {
            onApply(JSON.parse(JSON.stringify(buttons)));
            onClose();
          }}
        >
          Apply
        </button>
      </div>
    </SlideUpModal>
  );
};

export default FiterModal;
