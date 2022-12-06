import { readInput } from "./utils";

class FourBuffer {
  private array: string[];

  constructor() {
    this.array = [];
  }

  add(letter: string) {
    this.array.push(letter);
    while (this.array.length > 4) {
      this.array.shift();
    }
  }

  isAllDifferent(): boolean {
    const set = new Set(this.array);
    return set.size === 4;
  }
}

class FourteenBuffer {
  private array: string[];

  constructor() {
    this.array = [];
  }

  add(letter: string) {
    this.array.push(letter);
    while (this.array.length > 14) {
      this.array.shift();
    }
  }

  isAllDifferent(): boolean {
    const set = new Set(this.array);
    return set.size === 14;
  }
}

function partOne(str: string): number {
  const list = str.trim().split("");

  const buffer = new FourBuffer();

  for (let i = 0; i < list.length; i++) {
    const element = list[i];
    buffer.add(element);
    if (buffer.isAllDifferent()) {
      return i + 1;
    }
  }

  return -1;
}

function partTwo(str: string): number {
  const list = str.trim().split("");

  const buffer = new FourteenBuffer();

  for (let i = 0; i < list.length; i++) {
    const element = list[i];
    buffer.add(element);
    if (buffer.isAllDifferent()) {
      return i + 1;
    }
  }

  return -1;
}

const input = readInput(6);
console.log(partOne(input));
console.log(partTwo(input));
