import { readInput } from "./utils";

class SectionRange {
  private readonly lower;
  private readonly upper;

  constructor(str: string) {
    const [lower, upper] = str.split("-");
    this.lower = parseInt(lower);
    this.upper = parseInt(upper);
  }

  overlap(other: SectionRange): boolean {
    return this.lower <= other.lower && this.upper >= other.upper;
  }

  overlapAny(other: SectionRange): boolean {
    for (let i = this.lower; i <= this.upper; i++) {
      if (i >= other.lower && i <= other.upper) return true;
    }
    return false;
  }
}

function rangePairs(line: string): [SectionRange, SectionRange] {
  const [first, second] = line.split(",");
  return [new SectionRange(first), new SectionRange(second)];
}

function partOne(lines: string[]): number {
  return lines
    .map((line) => rangePairs(line))
    .filter(([rangeA, rangeB]) => rangeA.overlap(rangeB) || rangeB.overlap(rangeA)).length;
}

function partTwo(lines: string[]): number {
  return lines
    .map((line) => rangePairs(line))
    .filter(([rangeA, rangeB]) => rangeA.overlapAny(rangeB) || rangeB.overlapAny(rangeA)).length;
}

const lines = readInput(4).trim().split("\n");
console.log(partOne(lines));
console.log(partTwo(lines));
