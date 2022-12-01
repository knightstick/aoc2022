import * as fs from "fs";

const sum: (list: number[]) => number = (list) => list.reduce((acc, elem) => acc + elem);
const readInput: (day: number) => string = (number) => fs.readFileSync(`./inputs/day${number}.txt`).toString();

function stringToElfCaloriesTotal(str: string): number[] {
  return str
    .trim()
    .split("\n\n")
    .map((str) => str.split("\n"))
    .map((list) => list.map((x) => parseInt(x)))
    .map((elem) => sum(elem));
}

function mostCalories(str: string): number {
  const calories = stringToElfCaloriesTotal(str);
  return Math.max(...calories);
}

function threeMostCalories(str: string): number[] {
  return stringToElfCaloriesTotal(str)
    .sort((a, b) => b - a)
    .slice(0, 3);
}

const input = readInput(1);

console.log(mostCalories(input.toString()));
console.log(sum(threeMostCalories(input.toString())));
