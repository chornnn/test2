import { localStorage } from './util';

export const getLocation = () => {
  const location = localStorage.getItem('location');
  if (!location) {
    return '';
  }
  return location;
};

export const getLocationObject = () => {
  let location = getLocation().split(', ');

  if (location[0] === 'World Wide') {
    return {
      city: location[0] && location[0].trim(),
      state: location[0] && location[0].trim(),
    };
  }

  if (location[0] && location[0].trim() === 'undefined') {
    return {};
  }

  return {
    state: location[0] && location[0].trim(),
    city: location[1] && location[1].trim(),
    locationName: location[2] && location[2].trim(),
  };
};

export const getLocationName = () => {
  const location = getLocationObject();

  if (location.state === 'World Wide') {
    return (location.state);
  }

  if (!location.city) return '';

  return (location.locationName || location.city) + ', ' + location.state;
};

export const setLocation = (location: string) => {
  localStorage.setItem('location', location);
};

export const setLocationObjectId = (objectId: string) => {
  localStorage.setItem('locationObjectId', objectId);
};

export const getLocationObjectId = () => {
  return localStorage.getItem('locationObjectId');
};
