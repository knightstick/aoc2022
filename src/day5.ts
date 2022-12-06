import { chunks, readInput } from "./utils";

const test = `    [D]
[N] [C]
[Z] [M] [P]
 1   2   3

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
`;

class Stack {
  private array: string[];

  constructor() {
    this.array = [];
  }

  push(...crates: string[]) {
    crates.forEach((crate) => {
      this.array.push(crate);
    });
  }

  pop(count = 1) {
    const result: string[] = [];

    for (let i = 0; i < count; i++) {
      const value = this.array.pop();
      if (value) result.push(value);
    }

    return result.reverse();
  }

  peek(): string | null {
    if (this.array.length > 0) {
      return this.array[this.array.length - 1];
    }

    return null;
  }
}

function addToStacks(line: string, stacks: Stack[]) {
  const crateChunks = chunks(line.split(""), 4);

  crateChunks.forEach((chunk, index) => {
    const crate = chunk[1];

    if (!stacks[index]) {
      stacks[index] = new Stack();
    }

    if (crate !== " ") {
      stacks[index].push(crate);
    }
  });
}

function parseInstruction(str: string): { count: number; source: number; dest: number } {
  const [_move, countStr, _from, sourceStr, _to, destStr] = str.split(" ");
  return { count: parseInt(countStr), source: parseInt(sourceStr), dest: parseInt(destStr) };
}

function buildCrates(str: string): Stack[] {
  const stacks: Stack[] = [];

  str
    .split("\n")
    .slice(0, -1)
    .reverse()
    .forEach((line) => addToStacks(line, stacks));

  return stacks;
}

function partOne(str: string): string {
  const [crates, instructions] = str.split("\n\n");
  const stacks = buildCrates(crates);

  instructions
    .trim()
    .split("\n")
    .forEach((inst) => {
      const { count, source, dest } = parseInstruction(inst);

      for (let i = 0; i < count; i++) {
        move(source, dest, stacks);
      }
    });

  return stacks.map((stack) => stack.peek()).join("");
}

function partTwo(str: string): string {
  const [crates, instructions] = str.split("\n\n");
  const stacks = buildCrates(crates);

  instructions
    .trim()
    .split("\n")
    .forEach((inst) => {
      const { source, dest, count } = parseInstruction(inst);

      move(source, dest, stacks, count);
    });

  return stacks.map((stack) => stack.peek()).join("");
}

function move(source: number, dest: number, stacks: Stack[], count = 1) {
  const values = stacks[source - 1].pop(count);
  if (values) stacks[dest - 1].push(...values);
}

const input = readInput(5);

console.log(partOne(input));
console.log(partTwo(input));
