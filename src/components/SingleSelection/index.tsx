import React, { useState, useEffect } from 'react';

import SingleSelectionLabel from './SingleSelectionLabel';
import SingleSelectionModal from './SingleSelectionModal';
import { useWindowSize } from '@hooks';
import { Selection } from '@types';

import styles from './index.module.scss';

interface SingleSelectionProps {
  className?: string;
  onSelect?: (data: string) => void;
  data?: Selection[];
  selected?: string;
  title?: string;
  required?: boolean;
  placeholder?: string;
}

const SingleSelection: React.FC<SingleSelectionProps> = (props) => {
  const {
    className,
    onSelect,
    selected,
    required,
    data = [],
    title = 'Platform',
    placeholder,
  } = props;

  const [showModal, setShowModal] = useState(false);
  const { isDesktop } = useWindowSize();

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    document.addEventListener('click', closeModal);
    return () => {
      document.removeEventListener('click', closeModal);
    };
  }, []);

  return (
    <div className={styles['container'] + ' ' + className}>
      <SingleSelectionModal
        onSelect={(data) => {
          onSelect(data);
          if (isDesktop) {
            setShowModal(false);
          }
        }}
        data={data}
        show={showModal}
        onClose={() => setShowModal(false)}
        title={title}
      />
      <SingleSelectionLabel
        required={required}
        data={selected}
        onClick={(event) => {
          event.stopPropagation();
          setShowModal(!showModal);
        }}
        placeholder={placeholder}
      >
        {title}
      </SingleSelectionLabel>
    </div>
  );
};

export default SingleSelection;
