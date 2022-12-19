import { readInput, sum } from "./utils";

export type Packet = number | number[] | Packet[];

export function parseInput(input: string): [Packet, Packet][] {
  const groups = input.trim().split("\n\n");
  return groups
    .map((group) => group.split("\n") as [string, string])
    .map(([lineA, lineB]) => [JSON.parse(lineA), JSON.parse(lineB)]);
}

export function parseAllPackets(input: string): Packet[] {
  return input.split("\n").reduce((acc, line) => {
    if (line === "") {
      return acc;
    } else {
      return [...acc, JSON.parse(line)];
    }
  }, [] as Packet[]);
}

function rightOrderIndexes(packets: [Packet, Packet][]): number[] {
  const result: number[] = [];
  for (const [index, [packetA, packetB]] of packets.entries()) {
    const correct = correctOrder(packetA, packetB);
    if (correct) {
      result.push(index);
    }
  }
  return result;
}

export function correctOrder(packetA: Packet, packetB: Packet): boolean | undefined {
  let restA: Packet = packetA;
  let restB: Packet = packetB;
  let itemA: Packet | undefined = undefined;
  let itemB: Packet | undefined = undefined;

  if (typeof restA === "object") {
    restA = [...restA];
  }

  if (typeof restB === "object") {
    restB = [...restB];
  }

  // Fake while(true)
  for (let i = 0; i < 1000; i++) {
    if (typeof itemA === "undefined") {
      if (typeof restA === "number") {
        itemA = restA;
        restA = [];
      } else {
        itemA = restA.shift();
      }
    }

    if (typeof itemB === "undefined") {
      if (typeof restB === "number") {
        itemB = restB;
        restB = [];
      } else {
        itemB = restB.shift();
      }
    }

    // If they are both undefined then we haven't got an answer
    if (typeof itemA === "undefined" && typeof itemB === "undefined") {
      break;
    }

    // If itemA is undefined at this point, then we reached the end of the left side
    if (typeof itemA === "undefined") {
      return true;
    }

    // If itemB is undedfined at this point, then we have more left to check,
    // so it's not ordered correctly
    if (typeof itemB === "undefined") {
      return false;
    }

    if (typeof itemA === "number" && typeof itemB === "number") {
      if (itemA > itemB) {
        return false;
      }
      if (itemA < itemB) {
        return true;
      }

      // Must be equal, keep checking
      itemA = undefined;
      itemB = undefined;
      continue;
    }

    // Either itemA or itemB is a list, need to guarantee they both are
    if (typeof itemA === "number") {
      itemA = [itemA];
    }
    if (typeof itemB === "number") {
      itemB = [itemB];
    }

    // Guaranteed to have two lists
    const result = correctOrder(itemA, itemB);
    if (typeof result === "boolean") {
      return result;
    }

    // If we're here, then both lists were equal length, and no clear winner,
    // so keep checking
    itemA = undefined;
    itemB = undefined;
  }
}

function partOne(input: string): number {
  const parsedInput = parseInput(input);
  const rightOrdered = rightOrderIndexes(parsedInput).map((i) => i + 1);
  return sum(rightOrdered);
}

function partTwo(input: string): number {
  let packets: Packet[] = parseAllPackets(input);
  const dividerPackets: Packet[] = [[[2]], [[6]]];
  packets = packets.concat(dividerPackets);

  packets.sort((a, b) => {
    const result = correctOrder(a, b);
    if (typeof result === "boolean") {
      return result ? -1 : 1;
    }
    throw new Error("They should all terminate, actually");
  });

  let index1: number | undefined = undefined;
  let index2: number | undefined = undefined;

  for (let i = 0; i < packets.length; i++) {
    if (packets[i] === dividerPackets[0]) {
      index1 = i + 1;
    }
    if (packets[i] === dividerPackets[1]) {
      index2 = i + 1;
    }
  }

  if (typeof index1 === "number" && typeof index2 === "number") {
    return index1 * index2;
  }

  throw new Error("Couldn't find the divider packets");
}

const input = readInput(13);
console.log(partOne(input));
console.log(partTwo(input));
