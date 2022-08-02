import ReactPlaceholder from 'react-placeholder';
import {
  TextBlock,
  TextRow,
  RoundShape,
} from 'react-placeholder/lib/placeholders';

import 'react-placeholder/lib/reactPlaceholder.css';
import styles from './user.module.scss';

export const User: React.FC = (props) => {
  const component = (
    <div className={styles.container}>
      <RoundShape
        color="rgb(230, 230, 230)"
        style={{ width: '68px', height: '68px' }}
      />
      <TextBlock
        rows={2}
        color="rgb(230, 230, 230)"
        style={{ width: '100px' }}
      />
      <TextBlock rows={2} color="rgb(230, 230, 230)" style={{ width: '80%' }} />
      <TextRow
        color="rgb(230, 230, 230)"
        style={{ width: '100px', height: '32px', margin: '16px' }}
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
