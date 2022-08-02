import ReactPlaceholder from 'react-placeholder';
import {
  TextBlock,
  TextRow,
  RectShape,
} from 'react-placeholder/lib/placeholders';

import 'react-placeholder/lib/reactPlaceholder.css';
import styles from './card.module.scss';

export const Card: React.FC = (props) => {
  const component = (
    <div className={styles.container}>
      <div className={styles.header}>
        <RectShape
          color="rgb(230, 230, 230)"
          style={{ width: '65px', height: '65px' }}
        />
        <TextRow
          color="rgb(230, 230, 230)"
          style={{ width: '300px', height: '65px', margin: '0 16px' }}
        />
      </div>
      <TextBlock rows={5} color="rgb(230, 230, 230)" />
    </div>
  );

  return (
    <ReactPlaceholder
      showLoadingAnimation
      ready={false}
      customPlaceholder={component}
    >
      {props.children}
    </ReactPlaceholder>
  );
};
