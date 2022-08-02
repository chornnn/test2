import classNames from 'classnames';
import React, { ButtonHTMLAttributes } from 'react';

interface BaseButtonProps {
  iconSrc?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const SidePanel: React.FC<BaseButtonProps> = (props) => {
  const { className, children, onClick } = props;

  return (
    <div
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
      className={className}
    >
      {children}
    </div>
  );
};

export default SidePanel;
