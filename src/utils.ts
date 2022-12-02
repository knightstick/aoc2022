import * as fs from "fs";

export function sum(list: number[]): number {
  return list.reduce((acc, elem) => acc + elem);
}

export function readInput(day: number): string {
  return fs.readFileSync(`./inputs/day${day}.txt`).toString();
}
