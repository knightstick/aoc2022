import { readInput, sum } from "./utils";

const TOTAL_SPACE = 70000000;
const DESIRED_UNUSED = 30000000;

function buildSizes(input: string): { [key: string]: number } {
  const lines = input.split("\n");

  let stack: string[] = [];
  stack.push("/");

  const sizes: { [key: string]: number } = {};

  for (const line of lines.slice(1)) {
    const [instruction, ...rest] = line.split(" ");

    if (instruction === "$") {
      const [execute, ...args] = rest;
      if (execute === "cd") {
        const [dir] = args;
        if (dir === "..") {
          stack.pop();
        } else if (dir === "/") {
          stack = ["/"];
        } else {
          stack.push(dir);
        }
      }
    } else {
      if (instruction !== "dir") {
        const size = Number(instruction);
        for (let i = 0; i < stack.length; i++) {
          const id = stack.slice(0, i + 1).join("/");

          if (id in sizes) {
            sizes[id] += Number(size);
          } else {
            sizes[id] = Number(size);
          }
        }
      }
    }
  }

  return sizes;
}

function partOne(input: string): number {
  return sum(Object.values(buildSizes(input)).filter((size) => size <= 100000));
}

function partTwo(input: string): number | undefined {
  const sizes = buildSizes(input);
  const unusedSpace = TOTAL_SPACE - sizes["/"];
  const minDeletionSize = DESIRED_UNUSED - unusedSpace;
  const justSizes = Object.values(sizes);
  justSizes.sort((a, b) => a - b);
  return justSizes.find((size) => size >= minDeletionSize);
}

const input = readInput(7);
console.log(partOne(input));
console.log(partTwo(input));
