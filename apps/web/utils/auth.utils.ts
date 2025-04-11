import Cookies from 'js-cookie';

export const getAuthToken = (): string => {
  return Cookies.get('token') || '';
};
