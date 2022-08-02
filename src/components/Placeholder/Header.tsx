import ReactPlaceholder from 'react-placeholder';
import { TextRow } from 'react-placeholder/lib/placeholders';

import 'react-placeholder/lib/reactPlaceholder.css';
import styles from './follow.module.scss';

export const Header: React.FC = (props) => {
  const component = (
    <div className={styles.container}>
      <TextRow
        color="rgb(230, 230, 230)"
        style={{ width: '100px', height: '30px', margin: '8px' }}
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
