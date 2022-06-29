import { Position } from '../types/common';
import { Enemy } from './Enemy';
import { Projectile } from './Projectile';

export const getRandomNumberInRange = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const removeElementFromArray = (arr: any[], index: number) => {
  const firstArr = arr.slice(0, index);
  const secondArr = arr.slice(index + 1);
  return [...firstArr, ...secondArr];
};

export const getDistance = (point1: Position, point2: Position) => {
  let dx = point2.x - point1.x;
  let dy = point2.y - point1.y;

  return Math.sqrt(dx * dx + dy * dy);
};

export const uuid = () =>
  String(Date.now().toString(32) + Math.random().toString(16)).replace(/\./g, '');
