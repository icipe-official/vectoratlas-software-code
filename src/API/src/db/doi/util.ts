import { randomInt } from 'crypto';

export const getRandomInt = (length: number) => {
  return randomInt(1001, 999999999).toString().substring(0, length);
};

export const getCurrentUser = () => {
  return 'stevenyaga@gmail.com';
};

export const getCurrentUserName = () => {
  return 'Steve Nyaga';
};
