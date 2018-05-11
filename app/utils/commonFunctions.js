import { MONTH_ARRAY } from './const';

export const bytes2Gbytes = bytes => bytes / (1024 * 1024 * 1024);

export const gbytes2Tbytes = gb => gb / 1024;

export const timestamp2date = timestamp => {
  const date = new Date(timestamp * 1000);
  const month = MONTH_ARRAY[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month.substr(0, 3)} ${day}, ${year}`;
};
