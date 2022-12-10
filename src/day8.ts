import { readInput } from "./utils";

function parseTrees(lines: string[]): number[][] {
  const trees = [];

  for (const line of lines) {
    const row = [];
    for (const char of line) {
      row.push(Number(char));
    }
    trees.push(row);
  }

  return trees;
}

function scoreUp(i: number, j: number, trees: number[][]): number {
  const tree = trees[i][j];

  let score = 0;

  // up
  for (let k = i - 1; k >= 0; k--) {
    score++;
    if (trees[k][j] >= tree) {
      break;
    }
  }

  return score;
}

function scoreDown(i: number, j: number, trees: number[][]): number {
  const tree = trees[i][j];

  let score = 0;
  // down
  for (let k = i + 1; k < trees.length; k++) {
    score++;
    if (trees[k][j] >= tree) {
      break;
    }
  }

  return score;
}

function scoreLeft(i: number, j: number, trees: number[][]): number {
  const tree = trees[i][j];

  let score = 0;
  // left
  for (let k = j - 1; k >= 0; k--) {
    score++;
    if (trees[i][k] >= tree) {
      break;
    }
  }

  return score;
}

function scoreRight(i: number, j: number, trees: number[][]): number {
  const tree = trees[i][j];

  let score = 0;
  for (let k = j + 1; k < trees.length; k++) {
    score++;
    if (trees[i][k] >= tree) {
      break;
    }
  }

  return score;
}

function scenicScore(i: number, j: number, trees: number[][]): number {
  return scoreUp(i, j, trees) * scoreDown(i, j, trees) * scoreLeft(i, j, trees) * scoreRight(i, j, trees);
}

function partOne(input: string): number {
  const lines = input.trim().split("\n");
  const lineLength = lines[0].length;

  const visibilityGrid: boolean[][] = [];

  for (let i = 0; i < lineLength; i++) {
    visibilityGrid.push(new Array(lineLength).fill(false));
  }

  const trees = parseTrees(lines);

  // come from the left
  for (let i = 0; i < lineLength; i++) {
    const row = trees[i];
    for (let j = 0; j < lineLength; j++) {
      const priors = row.slice(0, j);

      const visible = priors.every((tree) => tree < row[j]);

      if (visible) {
        visibilityGrid[i][j] = true;
      }
    }
  }

  // come from the right
  for (let i = 0; i < lineLength; i++) {
    const row = trees[i];
    for (let j = lineLength - 1; j >= 0; j--) {
      const subsequent = row.slice(j + 1);

      const visible = subsequent.every((tree) => tree < row[j]);

      if (visible) {
        visibilityGrid[i][j] = true;
      }
    }
  }

  // come from the top
  for (let i = 0; i < lineLength; i++) {
    const column = trees.map((row) => row[i]);
    for (let j = 0; j < lineLength; j++) {
      const priors = column.slice(0, j);

      const visible = priors.every((tree) => tree < column[j]);

      if (visible) {
        visibilityGrid[j][i] = true;
      }
    }
  }

  // come from the bottom
  for (let i = 0; i < lineLength; i++) {
    const column = trees.map((row) => row[i]);
    for (let j = lineLength - 1; j >= 0; j--) {
      const subsequent = column.slice(j + 1);

      const visible = subsequent.every((tree) => tree < column[j]);

      if (visible) {
        visibilityGrid[j][i] = true;
      }
    }
  }

  let visibleCount = 0;
  for (const row of visibilityGrid) {
    for (const item of row) {
      if (item) visibleCount++;
    }
  }
  return visibleCount;
}

function partTwo(input: string): number {
  const trees = parseTrees(input.trim().split("\n"));
  const lineLength = trees.length;
  const scoresGrid: number[][] = [];

  for (let i = 0; i < lineLength; i++) {
    scoresGrid.push(new Array(lineLength).fill(-1));
  }

  for (let i = 0; i < lineLength; i++) {
    for (let j = 0; j < lineLength; j++) {
      scoresGrid[i][j] = scenicScore(i, j, trees);
    }
  }

  let max = -Infinity;

  for (let i = 0; i < lineLength; i++) {
    for (let j = 0; j < lineLength; j++) {
      const score = scoresGrid[i][j];
      if (score > max) max = score;
    }
  }

  return max;
}

const input = readInput(8);
console.log(partOne(input));
console.log(partTwo(input));
