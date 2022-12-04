import * as fs from "fs";

export function sum(list: number[]): number {
  return list.reduce((acc, elem) => acc + elem);
}

export function readInput(day: number): string {
  return fs.readFileSync(`./inputs/day${day}.txt`).toString();
}

export function chunks<T>(list: T[], size: number): T[][] {
  const result: T[][] = [];
  let inner: T[] = [];

  list.forEach((value) => {
    inner.push(value);

    if (inner.length % size == 0) {
      result.push(inner);
      inner = [];
    }
  });

  if (inner.length > 0) result.push(inner);

  return result;
}
