import { localStorage } from './util';

export const getRedirect = () => {
  const redirect = localStorage.getItem('redirect');
  if (!redirect) {
    return '/';
  }
  return redirect;
};

export const setRedirect = (redirect) => {
  localStorage.setItem('redirect', redirect);
};

export const getOrigin = () => {
  const origin = localStorage.getItem('origin');
  if (!origin) {
    return null;
  }
  return origin;
};

export const setOrigin = (origin) => {
  localStorage.setItem('origin', origin);
};

export const removeOrigin = () => {
  localStorage.removeItem('origin');
};

export const getScrollPosition = () => {
  const position = localStorage.getItem('scrollPosition');
  if (!position) {
    return 0;
  }
  return Number(position);
};

export const setScrollPosition = (position) => {
  localStorage.setItem('scrollPosition', position);
};
