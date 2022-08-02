import React, {
  ChangeEvent,
  InputHTMLAttributes,
  useState,
  useEffect,
  useRef,
} from 'react';
import classNames from 'classnames';

import { useDebounce } from '@hooks';
import { search } from '@search';
import { setLocation, setLocationObjectId, getLocationObjectId } from '@storage/location';

import styles from './index.module.scss';

interface DataSourceObject {
  value: string;
  state: string;
  city: string;
  type: string;
  locationName: string;
  objectID: string;
}

export type DataSourceType<T = {}> = T & DataSourceObject;

interface BaseTextProps
  extends Omit<InputHTMLAttributes<HTMLElement>, 'onSelect'> {
  useDefaultFetchSuggestions?: boolean;
  fetchSuggestions?: (
    str: string
  ) => DataSourceType[] | Promise<DataSourceType[]>;
  className?: string;
  placeholder?: string;
  children?: React.ReactNode;
  required?: boolean;
  showLabel?: boolean;
  mappinUrl?: string;
  onSelect?: (item: DataSourceType) => void;
  onClear?: () => void;
  clientCurrentLocation?: () => void;
}

// const getCoords = async () => {
//   const pos = (await new Promise((resolve, reject) => {
//     navigator.geolocation.getCurrentPosition(resolve, reject);
//   })) as any;

//   return {
//     longitude: pos.coords.longitude,
//     latitude: pos.coords.latitude,
//   };
// };

// const location = async () => {
//   let location: ILocation = await getCoords();
//   const res = await reverseGeocodingRequest(location);
//   if (res['data']['code'] === 200) {
//     return res['data']['data']['address']['state'];
//   }
//   return 'fail';
// };

const AutoCompleteMainPage: React.FC<BaseTextProps> = (props) => {
  const [suggestions, setSugestions] = useState<DataSourceType[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const {
    children,
    clientCurrentLocation,
    className,
    placeholder = 'College (optional)',
    value,
    useDefaultFetchSuggestions,
    fetchSuggestions,
    required = false,
    showLabel = true,
    onSelect,
    onClear,
  } = props;
  const [inputValue, setInputValue] = useState(value as string);
  const debouncedValue = useDebounce(inputValue, 300);
  const triggerSearch = useRef(false);

  const inputClassName = classNames(
    styles['auto-simple-input-container-input'],
    {
      [styles['white-input']]: showDropdown,
    }
  );
  const classes = classNames(styles['auto-simple-input-container'], className);
  const searchContainer = classNames(styles['auto-search-container-normal'], {
    [styles['search-container']]: showDropdown,
  });

  const defaultFetchSuggestions = (query: string) => {
    return search(query).then(({ hits }) => {
      return hits.map((item: any) => {
        if (item.type === 'university') {
          return { value: item.locationName + ', ' + item.state, ...item };
        } else if (item.type === 'city') {
          return { value: item.city + ', ' + item.state, ...item };
        }
      });
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    triggerSearch.current = true;
    setInputValue(value);
    if (value && value.length > 0) {
      setShowDropdown(true);
    } else {
      onClear && onClear();
      setShowDropdown(false);
    }
    if (value == "") {
      setLocation("World Wide");
      setLocationObjectId("world-wide");
    }
  };

  useEffect(() => {
    if (debouncedValue && triggerSearch.current) {
      setSugestions([]);
      if (useDefaultFetchSuggestions) {
        const results = defaultFetchSuggestions(debouncedValue);
        if (results instanceof Promise) {
          results.then((data) => {
            setSugestions(data);
            if (data.length > 0) {
              setShowDropdown(true);
            }
          });
        }
      }
    } else {
      setShowDropdown(false);
    }
  }, [debouncedValue]);

  useEffect(() => {
    setInputValue(value as string);
  }, [value]);

  const handleSelect = (item: DataSourceType) => {
    triggerSearch.current = false;
    setInputValue(item.value);
    setShowDropdown(false);
    if (onSelect) {
      onSelect(item);
    }
  };

  return (
    <div className={classes}>
      <div className={searchContainer}>
        <input
          value={inputValue}
          onChange={handleChange}
          className={inputClassName}
          placeholder={placeholder}
        />
        {/* <div className={styles['selected']}>{inputValue}</div> */}
        {showDropdown && (
          <div className={styles['showDropdown-area']}>
            <div className={styles['search-results']}>
              {suggestions.map((item) => {
                // keywords highlight ignore lower or up case
                const original = item.value?.toLocaleLowerCase();
                const keyword = debouncedValue.toLocaleLowerCase() as string;
                const start = original.indexOf(keyword);
                let showValue = item.value;

                if (start !== -1) {
                  const end = keyword.length + start;
                  showValue =
                    item.value.substring(0, start) +
                    `<span class='${styles['suggestion-color']}'>` +
                    item.value.substring(start, end) +
                    '</span>' +
                    item.value.substring(end);
                }

                return (
                  <div
                    key={item.objectID}
                    onClick={() => {
                      handleSelect(item);
                    }}
                    className={styles['search-result']}
                    dangerouslySetInnerHTML={{ __html: showValue }}
                  ></div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoCompleteMainPage;
