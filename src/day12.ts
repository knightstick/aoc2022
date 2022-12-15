import { readInputLines, splitLines } from "./utils";

type Heightmap = number[][];
type Location = { x: number; y: number };

const elevations = "abcdefghijklmnopqrstuvwxyz".split("");

function parseHeightmap(lines: string[]): { currentLocation: Location; destination: Location; heightmap: Heightmap } {
  let currentLocation: Location | null = null;
  let destination: Location | null = null;

  const heightmap: Heightmap = [];

  for (let y = 0; y < lines.length; y++) {
    const row = [];
    for (let x = 0; x < lines[y].length; x++) {
      const char = lines[y][x];

      if (char === "S") {
        currentLocation = { x, y };
        row.push(elevations.indexOf("a"));
      } else if (char === "E") {
        destination = { x, y };
        row.push(elevations.indexOf("z"));
      } else {
        row.push(elevations.indexOf(char));
      }
    }
    heightmap.push(row);
  }

  if (!currentLocation) throw new Error("No starting location found");
  if (!destination) throw new Error("No destination found");

  return { currentLocation, destination, heightmap };
}

function address(location: Location): string {
  return `${location.x},${location.y}`;
}

function nearestUnvisited(distances: { [key: string]: number }, unvisited: Set<string>): Location | null {
  const unvisitedDistances = Object.entries(distances).filter(([key]) => unvisited.has(key));
  if (unvisitedDistances.length === 0) {
    return null;
  }

  unvisitedDistances.sort(([, a], [, b]) => a - b);
  const [[address, _], ..._rest] = unvisitedDistances;

  const location = address.split(",").map(Number) as [number, number];

  return { x: location[0], y: location[1] };
}

function dijkstra(heightmap: Heightmap, currentLocation: Location): { [key: string]: number } {
  const distances: { [key: string]: number } = { [address(currentLocation)]: 0 };
  const unvisited: Set<string> = new Set();
  const path: Location[] = [currentLocation];

  for (let y = 0; y < heightmap.length; y++) {
    for (let x = 0; x < heightmap[y].length; x++) {
      if (x === currentLocation.x && y === currentLocation.y) continue;
      unvisited.add(address({ x, y }));
    }
  }

  const neighbors = (location: Location): Location[] => {
    return [
      // Left
      { x: location.x - 1, y: location.y },
      // Up
      { x: location.x, y: location.y - 1 },
      // Right
      { x: location.x + 1, y: location.y },
      // Down
      { x: location.x, y: location.y + 1 },
    ].filter(({ x, y }) => x >= 0 && y >= 0 && x < heightmap[0].length && y < heightmap.length);
  };

  while (unvisited.size > 0) {
    // For every element in the path, check each neighbor to see if we can go there.
    // If we can go there, calculate the distance to the path element + 1
    // and compare it to the distance we have already recorded (which may be undefined)
    path.forEach((location) => {
      neighbors(location).forEach((neighbor) => {
        const elevation = heightmap[neighbor.y][neighbor.x];
        const currentElevation = heightmap[location.y][location.x];
        if (elevation <= currentElevation + 1) {
          const distance = distances[address(location)] + 1;
          if (distances[address(neighbor)] === undefined || distance < distances[address(neighbor)]) {
            distances[address(neighbor)] = distance;
          }
        }
      });
    });

    const nextLocation = nearestUnvisited(distances, unvisited);
    if (nextLocation) {
      currentLocation = nextLocation;
      unvisited.delete(address(currentLocation));
      path.push(currentLocation);
    } else {
      return distances;
    }
  }

  return distances;
}

function findStartingPoints(heightmap: Heightmap): Location[] {
  const startingPoints: Location[] = [];
  for (let y = 0; y < heightmap.length; y++) {
    for (let x = 0; x < heightmap[y].length; x++) {
      const elevation = heightmap[y][x];
      if (elevation === 0) {
        startingPoints.push({ x, y });
      }
    }
  }
  return startingPoints;
}

function partOne(lines: string[]): number {
  const { currentLocation, destination, heightmap } = parseHeightmap(lines);
  const distances = dijkstra(heightmap, currentLocation);
  return distances[`${destination.x},${destination.y}`];
}

function partTwoBruteForce(lines: string[]): number {
  const { destination, heightmap } = parseHeightmap(lines);
  const startingPoints = findStartingPoints(heightmap);
  let best = Infinity;

  for (let i = 0; i < startingPoints.length; i++) {
    console.log(`${i}/${startingPoints.length}`);
    const startingPoint = startingPoints[i];
    const distances = dijkstra(heightmap, startingPoint);
    const distance = distances[`${destination.x},${destination.y}`];
    if (distance < best) {
      best = distance;
    }
  }

  return best;
}

const lines = readInputLines(12);
console.log(partOne(lines));
console.log(partTwoBruteForce(readInputLines(12)));
