import { readInput } from "./utils";

class Bufferer {
  private array: string[];
  private length: number;

  constructor(length: number) {
    this.array = [];
    this.length = length;
  }

  add(letter: string) {
    this.array.push(letter);
    while (this.array.length > this.length) {
      this.array.shift();
    }
  }

  isAllDifferent(): boolean {
    const set = new Set(this.array);
    return set.size === this.length;
  }
}

function findStartOfPacket(str: string, length: number): number {
  const list = str.trim().split("");

  const buffer = new Bufferer(length);

  for (let i = 0; i < list.length; i++) {
    const element = list[i];
    buffer.add(element);
    if (buffer.isAllDifferent()) {
      return i + 1;
    }
  }

  return -1;
}

function partOne(str: string): number {
  return findStartOfPacket(str, 4);
}

function partTwo(str: string): number {
  return findStartOfPacket(str, 14);
}

const input = readInput(6);
console.log(partOne(input));
console.log(partTwo(input));
