import { readInputLines } from "./utils";

const boardShape = ` ..........................
..........................
..........................
..........................
..........................
..........................
..........................
..........................
..........................
..........................
..........................
..........................
..........................
..........................
..........................
..........................
..........................
..........................
..........................
..........................
..........................
`;

type Direction = "R" | "L" | "U" | "D";

type Instruction = {
  direction: Direction;
  distance: number;
};

type Point = {
  x: number;
  y: number;
};

function parseDirection(direction: string): Direction {
  switch (direction) {
    case "R":
    case "L":
    case "U":
    case "D":
      return direction;
    default:
      throw new Error(`Invalid direction ${direction}`);
  }
}

function moveHead(direction: Direction, headPosition: Point): Point {
  switch (direction) {
    case "R":
      return { x: headPosition.x + 1, y: headPosition.y };
    case "L":
      return { x: headPosition.x - 1, y: headPosition.y };
    case "U":
      return { x: headPosition.x, y: headPosition.y + 1 };
    case "D":
      return { x: headPosition.x, y: headPosition.y - 1 };
  }
}

function moveTail(headPosition: Point, tailPosition: Point): Point {
  if (headPosition.x === tailPosition.x && headPosition.y === tailPosition.y) {
    return tailPosition;
  }
  if (headPosition.x === tailPosition.x) {
    const diff = headPosition.y - tailPosition.y;
    if (Math.abs(diff) === 1) {
      return tailPosition;
    }
    return {
      x: tailPosition.x,
      y: tailPosition.y + Math.abs(diff) / diff,
    };
  }
  if (headPosition.y === tailPosition.y) {
    const diff = headPosition.x - tailPosition.x;
    if (Math.abs(diff) === 1) {
      return tailPosition;
    }
    return {
      x: tailPosition.x + Math.abs(diff) / diff,
      y: tailPosition.y,
    };
  }
  // if head x +- 1 and head y +- 1, don't move
  if (
    (headPosition.x === tailPosition.x + 1 || headPosition.x === tailPosition.x - 1) &&
    (headPosition.y === tailPosition.y + 1 || headPosition.y === tailPosition.y - 1)
  ) {
    return tailPosition;
  }

  const xDiff = headPosition.x - tailPosition.x;
  const yDiff = headPosition.y - tailPosition.y;
  return {
    x: tailPosition.x + Math.abs(xDiff) / xDiff,
    y: tailPosition.y + Math.abs(yDiff) / yDiff,
  };
}

function printBoard(
  { xMin, xMax, yMin, yMax }: { xMin: number; xMax: number; yMin: number; yMax: number },
  ...positions: [point: Point, name: string][]
) {
  const board: string[][] = [];
  for (let y = yMax; y >= yMin; y--) {
    const row: (string | undefined)[] = new Array(xMax - xMin).fill(undefined);
    let index = 0;
    for (let x = xMin; x < xMax; x++) {
      for (const [position, name] of positions) {
        if (!row[index]) {
          if (x === position.x && y === position.y) {
            row[index] = name;
          }
        }
      }
      if (!row[index] && x === 0 && y === 0) {
        row[index] = "s";
      }
      index++;
    }
    board.push(row.map((cell) => cell || "."));
  }

  console.log(board.map((row) => row.join("")).join("\n"));
  console.log("\n");
}

function partOne(lines: string[]): number {
  const instructions: Instruction[] = lines.map((line) => {
    const [direction, distance] = line.split(" ");
    return { direction: parseDirection(direction), distance: parseInt(distance) };
  });

  const visited: Set<string> = new Set();
  let headPosition: Point = { x: 0, y: 0 };
  let tailPosition: Point = { x: 0, y: 0 };

  console.log("== Initial State ==\n");
  const print = () => {
    const bounds = {
      xMin: 0,
      yMin: 0,
      xMax: 4,
      yMax: 6,
    };
    printBoard(bounds, [headPosition, "H"], [tailPosition, "T"]);
  };
  print();

  for (const instruction of instructions) {
    const { direction, distance } = instruction;
    console.log("==", direction, distance, "==\n");

    for (let i = 0; i < distance; i++) {
      headPosition = moveHead(direction, headPosition);
      tailPosition = moveTail(headPosition, tailPosition);

      print();
      visited.add(`${tailPosition.x},${tailPosition.y}`);
    }
  }

  return visited.size;
}

function partTwo(lines: string[]): number {
  const instructions: Instruction[] = lines.map((line) => {
    const [direction, distance] = line.split(" ");
    return { direction: parseDirection(direction), distance: parseInt(distance) };
  });

  const visited: Set<string> = new Set();

  const positions = Array.from({ length: 10 }, () => ({ x: 0, y: 0 }));

  const print = (positions: Point[]) => {
    const positionNames: [Point, string][] = positions.map((position, i) => [position, `${i}`]);
    positionNames[0] = [positions[0], "H"];
    const boardRows = boardShape.trim().split("\n");
    const boardWidth = boardRows[0].length;
    const boardHeight = boardRows.length;

    const xMin = -11;
    const yMin = -5;

    const bounds = {
      xMin,
      yMin,
      xMax: xMin + boardWidth,
      yMax: yMin + boardHeight,
    };

    printBoard(bounds, ...positionNames);
  };

  console.log("== Initial State ==\n");
  print(positions);

  for (const instruction of instructions) {
    const { direction, distance } = instruction;
    console.log("\n==", direction, distance, "==\n");

    for (let i = 0; i < distance; i++) {
      positions[0] = moveHead(direction, positions[0]);
      for (let j = 1; j < positions.length; j++) {
        const [myHead, me] = [positions[j - 1], positions[j]];
        positions[j] = moveTail(myHead, me);
        const tailPos = positions[positions.length - 1];
        visited.add(`${tailPos.x},${tailPos.y}`);
      }
      // print(positions);
    }
    print(positions);
  }

  return visited.size;
}

const lines = readInputLines(9);
console.log(partOne(lines));
console.log(partTwo(lines));
