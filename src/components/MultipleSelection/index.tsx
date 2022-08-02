import React, { useState } from 'react';

import MultipleSelectionLabel from './MultipleSelectionLabel';
import MultipleSelectionModal from './MultipleSelectionModal';
import { Selection } from '@types';

import styles from './index.module.scss';

interface MultipleSelectionProps {
  className?: string;
  confirmCount?: number;
  maxSelect?: number;
  onSelect?: (data: Selection[]) => void;
  data?: Selection[];
  title?: string;
  required?: boolean;
}

const MultipleSelectionModel: React.FC<MultipleSelectionProps> = (props) => {
  const {
    className,
    onSelect,
    confirmCount = 1,
    maxSelect = 10,
    required,
    data = [],
    title = 'Category',
  } = props;

  const [showModal, setShowModal] = useState(false);

  return (
    <div className={styles['container'] + ' ' + className}>
      <MultipleSelectionModal
        myConfirmCount={confirmCount}
        maxSelect={maxSelect}
        onClose={() => {
          setShowModal(!showModal);
        }}
        datas={data}
        title={title}
        show={showModal}
        onSelect={(selected) => {
          onSelect(selected);
        }}
      />
      <MultipleSelectionLabel
        required={required}
        datas={data.filter((c) => c.selected).map((c) => c.title)}
        onClick={() => {
          setShowModal(!showModal);
        }}
      >
        {title}
      </MultipleSelectionLabel>
    </div>
  );
};

export default MultipleSelectionModel;
