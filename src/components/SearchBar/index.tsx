import React from 'react';
import AutoCompleteMainPage from './AutoCompleteMainPage/AutoComplete';
import styles from './index.module.scss';

function SearchBar(props) {
  const { onChange, onSelect, onClick } = props;
  return (
    <div className={styles['container']}>
      <input
        type="text"
        className={styles['search-text']}
        placeholder="Group name"
        onChange={onChange}
      />
      <AutoCompleteMainPage
        onSelect={onSelect}
        useDefaultFetchSuggestions
        className={styles['search-location']}
      />
      <button
        className={styles['button']}
        onClick={onClick}>
        Search
      </button>
    </div >
  );
}

export default SearchBar;
