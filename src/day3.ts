import { chunks, readInput, sum } from "./utils";

const letters = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
] as const;

type ItemType = typeof letters[number];

function partOne(lines: string[]): number {
  return sum(lines.map((line) => priority(itemInBoth(line))));
}

function partTwo(lines: string[]): number {
  return sum(chunks(lines, 3).map((chunk) => priority(itemInAll(...chunk))));
}

function priority(itemType: ItemType): number {
  return letters.indexOf(itemType) + 1;
}

function itemInBoth(line: string): ItemType {
  const length = line.length / 2;
  const first = itemTypeSet(line.slice(0, length));
  const second = itemTypeSet(line.slice(length));

  return firstIntersectingValue(first, second);
}

function itemInAll(...list: string[]): ItemType {
  const sets: Set<ItemType>[] = list.map((line) => itemTypeSet(line));
  return firstIntersectingValue(...sets);
}

function firstIntersectingValue<T>(...sets: Set<T>[]): T {
  const [inAll] = intersection(...sets);

  return inAll;
}

function itemTypeSet(str: string): Set<ItemType> {
  const set = new Set<ItemType>();
  for (const char of str) {
    if (letters.includes(char as ItemType)) {
      set.add(char as ItemType);
    } else {
      throw new Error(`Unknown ItemType: ${char}`);
    }
  }

  return set;
}

function intersection<T>(...sets: Set<T>[]): Set<T> {
  return sets.reduce((acc, elem) => {
    const result = new Set<T>();
    acc.forEach((value) => {
      if (elem.has(value)) result.add(value);
    });

    return result;
  });
}

const lines = readInput(3).split("\n");
console.log(partOne(lines));
console.log(partTwo(lines));
