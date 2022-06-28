import { Enemy } from './Enemy';
import { Projectile } from './Projectile';

export const getRandomNumberInRange = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

// export const removeElementFromArray = (arr: (Projectile | Enemy)[], index: number) => {
export const removeElementFromArray = (arr: any[], index: number) => {
const firstArr = arr.slice(0, index);
  const secondArr = arr.slice(index + 1);
  return [...firstArr, ...secondArr];
};
