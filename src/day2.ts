import * as fs from "fs";

const sum: (list: number[]) => number = (list) => list.reduce((acc, elem) => acc + elem);
const readInput: (day: number) => string = (number) => fs.readFileSync(`./inputs/day${number}.txt`).toString();

function assert(condition: boolean, message = "Assertion Failed"): void {
  if (!condition) throw new Error(message);
}

enum Choice {
  Rock = "rock",
  Paper = "paper",
  Scissors = "scissors",
}

enum Result {
  Player1 = "player1",
  Player2 = "player2",
  Draw = "draw",
}

type round = [Choice, Choice];

function parseChoice(str: string): Choice {
  switch (str) {
    case "X":
      return Choice.Rock;
    case "A":
      return Choice.Rock;
    case "Y":
      return Choice.Paper;
    case "B":
      return Choice.Paper;
    case "Z":
      return Choice.Scissors;
    case "C":
      return Choice.Scissors;
    default:
      throw new Error(`Unknown choice: ${str}`);
  }
}

function result([opp, you]: round): Result {
  switch (opp) {
    case Choice.Rock:
      return rockResult(you);
    case Choice.Paper:
      return paperResult(you);
    case Choice.Scissors:
      return scissorsResult(you);
  }
}

function rockResult(you: Choice): Result {
  switch (you) {
    case Choice.Rock:
      return Result.Draw;
    case Choice.Paper:
      return Result.Player2;
    case Choice.Scissors:
      return Result.Player1;
  }
}

function paperResult(you: Choice): Result {
  switch (you) {
    case Choice.Rock:
      return Result.Player1;
    case Choice.Paper:
      return Result.Draw;
    case Choice.Scissors:
      return Result.Player2;
  }
}

function scissorsResult(you: Choice): Result {
  switch (you) {
    case Choice.Rock:
      return Result.Player2;
    case Choice.Paper:
      return Result.Player1;
    case Choice.Scissors:
      return Result.Draw;
  }
}

function roundScore(round: round): number {
  return choiceScore(round) + resultScore(result(round));
}

function choiceScore([_, you]: round): number {
  switch (you) {
    case Choice.Rock:
      return 1;
    case Choice.Paper:
      return 2;
    case Choice.Scissors:
      return 3;
  }
}

function resultScore(result: Result): number {
  switch (result) {
    case Result.Player2:
      return 6;
    case Result.Draw:
      return 3;
    case Result.Player1:
      return 0;
  }
}

function parseOne(str: string): round[] {
  return str
    .trim()
    .split("\n")
    .map((line) => {
      const [opp, you] = line.split(" ");
      return [parseChoice(opp), parseChoice(you)];
    });
}

function parseTwo(str: string): round[] {
  return str
    .trim()
    .split("\n")
    .map((line) => {
      const [opp, desiredResultStr] = line.split(" ");
      const oppChoice = parseChoice(opp);
      const desiredResult = parseResult(desiredResultStr);
      return [oppChoice, choiceForResult(desiredResult, oppChoice)];
    });
}

function parseResult(str: string): Result {
  switch (str) {
    case "X":
      return Result.Player1;
    case "Y":
      return Result.Draw;
    case "Z":
      return Result.Player2;
    default:
      throw new Error(`Unknown result: ${str}`);
  }
}

function choiceForResult(desired: Result, oppChoice: Choice): Choice {
  switch (desired) {
    case Result.Player1:
      return loseAgainst(oppChoice);
    case Result.Draw:
      return oppChoice;
    case Result.Player2:
      return winAgainst(oppChoice);
    default:
      throw new Error(`Don't know how to handle ${desired}`);
  }
}

function loseAgainst(choice: Choice): Choice {
  switch (choice) {
    case Choice.Rock:
      return Choice.Scissors;
    case Choice.Paper:
      return Choice.Rock;
    case Choice.Scissors:
      return Choice.Paper;
  }
}

function winAgainst(choice: Choice): Choice {
  switch (choice) {
    case Choice.Rock:
      return Choice.Paper;
    case Choice.Paper:
      return Choice.Scissors;
    case Choice.Scissors:
      return Choice.Rock;
  }
}

function partOne(str: string): number {
  return sum(parseOne(str).map((round) => roundScore(round)));
}

function partTwo(str: string): number {
  return sum(parseTwo(str).map((round) => roundScore(round)));
}

const test = `A Y
B X
C Z
`;

assert(partOne(test) === 15, `Expected 15, got ${partOne(test)}`);
assert(partTwo(test) === 12, `Expected 12, got ${partTwo(test)}`);

const input = readInput(2);
console.log(1, partOne(input));
console.log(2, partTwo(input));
