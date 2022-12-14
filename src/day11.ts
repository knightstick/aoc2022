class Monkey {
  items: bigint[];
  inspections: bigint;
  base: bigint;
  throws: [truthy: number, falsy: number];
  private operation: (worryLevel: bigint) => bigint;

  constructor(
    items: number[],
    operation: (worryLevel: bigint) => bigint,
    base: bigint,
    throws: [truthy: number, falsy: number]
  ) {
    this.items = items.map((item) => BigInt(item));
    this.operation = operation;
    this.base = base;
    this.throws = throws;
    this.inspections = BigInt(0);
  }

  changeWorryLevel(worryLevel: bigint): bigint {
    return this.operation(worryLevel);
  }
}

const inputMonkeys = () => [
  // Monkey 0
  new Monkey([74, 64, 74, 63, 53], (old: bigint) => old * 7n, 5n, [1, 6]),

  // Monkey 1
  new Monkey([69, 99, 95, 62], (old: bigint) => old * old, 17n, [2, 5]),

  // Monkey 2
  new Monkey([59, 81], (old: bigint) => old + 8n, 7n, [4, 3]),

  // Monkey 3
  new Monkey([50, 67, 63, 57, 63, 83, 97], (old: bigint) => old + 4n, 13n, [0, 7]),

  // Monkey 4
  new Monkey([61, 94, 85, 52, 81, 90, 94, 70], (old: bigint) => old + 3n, 19n, [7, 3]),

  // Monkey 5
  new Monkey([69], (old: bigint) => old + 5n, 3n, [4, 2]),

  // Monkey 6
  new Monkey([54, 55, 58], (old: bigint) => old + 7n, 11n, [1, 5]),

  // Monkey 7
  new Monkey([79, 51, 83, 88, 93, 76], (old: bigint) => old * 3n, 2n, [0, 6]),
];

function runRound(monkeys: Monkey[], base: bigint): void {
  for (const monkey of monkeys) {
    let done = false;
    while (monkey.items && !done) {
      let worryLevel = monkey.items.shift();
      if (worryLevel) {
        monkey.inspections++;
        worryLevel = monkey.changeWorryLevel(worryLevel);
        worryLevel = worryLevel / 3n;
        worryLevel = worryLevel % base;
        const throwTo = worryLevel % monkey.base === 0n ? monkey.throws[0] : monkey.throws[1];
        const throwToMonkey = monkeys[throwTo];
        throwToMonkey.items.push(worryLevel);
      } else {
        done = true;
      }
    }
  }
}

function runRoundWithoutRelief(monkeys: Monkey[], base: bigint): Monkey[] {
  for (const monkey of monkeys) {
    let done = false;
    while (monkey.items && !done) {
      let worryLevel: bigint | undefined = monkey.items.shift();
      if (worryLevel) {
        monkey.inspections++;
        worryLevel = monkey.changeWorryLevel(worryLevel);
        worryLevel = worryLevel % base;

        const throwTo = worryLevel % monkey.base === 0n ? monkey.throws[0] : monkey.throws[1];
        const throwToMonkey = monkeys[throwTo];
        throwToMonkey.items.push(worryLevel);
      } else {
        done = true;
      }
    }
  }

  return monkeys;
}

function printMonkeys(monkeys: Monkey[]) {
  monkeys.forEach((monkey, index) => {
    console.log(`Monkey ${index}:`, monkey.items.join(", "));
  });
  console.log("\n");
}

function printInspections(monkeys: Monkey[]) {
  monkeys.forEach((monkey, index) => {
    console.log(`Monkey ${index} inspected items ${monkey.inspections} times.`);
  });
}

function partOne(monkeys: Monkey[], rounds = 20) {
  const base = monkeys.reduce((acc, monkey) => acc * monkey.base, 1n);
  for (let i = 0; i < rounds; i++) {
    runRound(monkeys, base);
  }

  const inspections = monkeys.map((monkey) => monkey.inspections);
  inspections.sort((a, b) => {
    if (a > b) {
      return -1;
    } else if (a < b) {
      return 1;
    } else {
      return 0;
    }
  });
  const [most, second, ...rest] = inspections;
  return most * second;
}

function partTwo(monkeys: Monkey[], rounds = 10000) {
  const base = monkeys.reduce((acc, monkey) => acc * monkey.base, 1n);

  for (let i = 0; i < rounds; i++) {
    runRoundWithoutRelief(monkeys, base);
  }

  const inspections = monkeys.map((monkey) => monkey.inspections);
  inspections.sort((a, b) => {
    if (a > b) {
      return -1;
    } else if (a < b) {
      return 1;
    } else {
      return 0;
    }
  });

  const [most, second, ...rest] = inspections;
  return most * second;
}

console.log(partOne(inputMonkeys()));
console.log(partTwo(inputMonkeys()));
