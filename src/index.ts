import {WAIT_MS} from './constant';

export const add = (num1: number, num2: number): number => num1 + num2;

const wait          = (): Promise<void> => new Promise(resolve => setTimeout(resolve, WAIT_MS));
export const repeat = (callback: () => void, times: number): Promise<void> => {
  return [...Array(times).keys()].reduce(async(prev) => {
    await prev;
    callback();
    await wait();
  }, Promise.resolve());
};
