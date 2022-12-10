import { readInput, sum } from "./utils";

const INITIAL_X = 1;
type Noop = {
  type: "noop";
};

type AddX = {
  type: "addx";
  cycles: number;
  value: number;
};

type Instruction = Noop | AddX;
type CPU = {
  x: number;
  tick: number;
};

function cycle({ x, tick }: CPU, instructions: Instruction[], acc: number[]): number[] {
  if (instructions.length === 0) {
    return acc;
  }

  // Find the signal strength during the 20th, 60th, 100th, 140th, 180th, and 220th cycles.
  if (tick === 20 || tick === 60 || tick === 100 || tick === 140 || tick === 180 || tick === 220) {
    const signalStrength = x * tick;
    acc.push(signalStrength);
  }

  const [instruction, ...rest] = instructions;

  switch (instruction.type) {
    case "noop":
      instructions = rest;
      break;
    case "addx":
      if (instruction.cycles > 1) {
        instructions = [{ ...instruction, cycles: instruction.cycles - 1 }, ...rest];
      } else if (instruction.cycles == 1) {
        instructions = rest;
        x += instruction.value;
      }
      break;
  }

  return cycle({ x, tick: tick + 1 }, instructions, acc);
}

function cycleRender({ x, tick }: CPU, instructions: Instruction[]): undefined {
  if (instructions.length === 0) {
    return;
  }

  const spriteStart = x % 40;
  const tickPos = tick % 40;

  if (tickPos === spriteStart || tickPos === spriteStart + 1 || tickPos === spriteStart + 2) {
    process.stdout.write("#");
  } else {
    process.stdout.write(".");
  }

  if (tick % 40 === 0) {
    process.stdout.write("\n");
  }

  const [instruction, ...rest] = instructions;

  switch (instruction.type) {
    case "noop":
      instructions = rest;
      break;
    case "addx":
      if (instruction.cycles > 1) {
        instructions = [{ ...instruction, cycles: instruction.cycles - 1 }, ...rest];
      } else if (instruction.cycles == 1) {
        instructions = rest;
        x += instruction.value;
      }
      break;
  }

  return cycleRender({ x, tick: tick + 1 }, instructions);
}

function parseInstructions(input: string): Instruction[] {
  return input
    .trim()
    .split("\n")
    .map((line) => {
      const [type, value] = line.split(" ");
      if (type === "noop") {
        return { type: "noop", cycles: 1 } as Noop;
      } else if (type === "addx") {
        const num = Number(value);
        if (!num) throw new Error(`Invalid number: ${value}`);
        return { type: "addx", cycles: 2, value: num } as AddX;
      } else {
        throw new Error(`Unknown instruction type: ${type}`);
      }
    });
}

function partOne(input: string): number {
  return sum(cycle({ x: INITIAL_X, tick: 1 }, parseInstructions(input), []));
}

function partTwo(input: string) {
  cycleRender({ x: INITIAL_X, tick: 1 }, parseInstructions(input));
}

// console.log(partOne(testInput));
const input = readInput(10);
console.log(partOne(input));
partTwo(input);
