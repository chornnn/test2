import ReactPlaceholder from 'react-placeholder';
import {
  TextBlock,
  TextRow,
  RoundShape,
} from 'react-placeholder/lib/placeholders';

import 'react-placeholder/lib/reactPlaceholder.css';
import styles from './follow.module.scss';

export const Follow: React.FC = (props) => {
  const component = (
    <div className={styles.container}>
      <RoundShape
        color="rgb(230, 230, 230)"
        style={{ width: '40px', height: '40px' }}
      />
      <TextRow
        color="rgb(230, 230, 230)"
        style={{ height: '32px', margin: '16px 32px 16px 8px', flex: '1' }}
      />
      <TextRow
        color="rgb(230, 230, 230)"
        style={{ width: '72px', height: '32px', margin: '16px ' }}
      />
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
