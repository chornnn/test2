import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import classNames from 'classnames';

import styles from './index.module.scss';

interface BaseTextProps {
  className?: string;
  children: React.ReactNode;
}

const FlexableText: React.FC<BaseTextProps> = (props: BaseTextProps) => {
  const { children, className } = props;
  const baseElement = useRef<HTMLDivElement>();

  const [showButton, setShowButton] = useState(false);
  const [showText, setShowText] = useState('Read more');
  const [normalHeight, setHeight] = useState<String>('200px');
  const [maxHeight, setMaxOffsetHeight] = useState<number>();
  const [minHeight, setMinOffsetHeight] = useState<number>();
  const [myLineHeight, setLineHeight] = useState('20px');
  const [transition, setTransition] = useState('none');

  const classes = classNames(className);

  useEffect(() => {
    countLines();
  }, [children]);

  function countLines() {
    if (baseElement.current != null) {
      if (baseElement.current.clientWidth > 500) {
        setLineHeight('30px');
      }
      const number = Math.max(
        baseElement.current.clientHeight,
        baseElement.current.offsetHeight
      );
      const max = number;
      const min = 20 * 2;
      setMaxOffsetHeight(max);
      setMinOffsetHeight(min);
      if (max > min) {
        setShowButton(true);
        setHeight(min + 'px');
      } else {
        setHeight('200px');
      }
    }
  }

  return (
    <div className={classes}>
      <div
        ref={baseElement}
        className={styles['text-content']}
        style={{
          lineHeight: myLineHeight,
          maxHeight: `${normalHeight}`,
          overflow: 'hidden',
          whiteSpace: 'pre-line',
          transition: `${transition}`,
        }}
      >
        {children}
      </div>

      {showButton && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (showText === 'Read more') {
              setHeight('200px');
              setTransition('max-height 0.5s ease-in-out');
              setShowText('Show less');
            } else {
              setHeight(minHeight + 'px');
              setShowText('Read more');
            }
          }}
          className={styles['link-button']}
        >
          {showText}
        </div>
      )}
    </div>
  );
};

export default FlexableText;
