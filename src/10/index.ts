import { readFileSync } from "fs";

const splitLines = (text: string) => text.split("\n");
const extractPipes = (text: string) =>
  text.split(" ").filter(Boolean).map(Number);

type Coordinates = {
  row: number;
  col: number;
};

type Neighbour = {
  coordinates: Coordinates;
  pipe: Pipe;
};

const PipeEnum = {
  "|": ["top", "bottom"],
  "-": ["left", "right"],
  L: ["top", "right"],
  J: ["top", "left"],
  "7": ["left", "bottom"],
  F: ["right", "bottom"],
  S: ["right", "bottom", "top", "left"],
};

const Continuation = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

type Pipe = (typeof PipeEnum)[keyof typeof PipeEnum];

export const run = async () => {
  const data = await readFileSync("./src/10/input-test.txt", "utf-8");

  const lines = splitLines(data);

  const start = getStartingCoordinates(lines);

  // Part 1
  // return traversePipe(start, lines);
  // Part 2
  const pipeLoop = getPipeElements(start, lines);

  return lines.reduce((sum, line, row) => {
    console.log("line");
    const lineSum = line.split("").reduce(
      (acc, currentPipe, col) => {
        const pipeLocation = pipeLoop.find(
          (c) => c.col === col && c.row === row
        );

        console.log(pipeLocation ? "#" : ".");

        if (pipeLocation) {
          const pipe = lines[pipeLocation.row][pipeLocation.col];

          return {
            sum: acc.sum,
            inside: getIsInside(acc.prevPipe, currentPipe, acc.inside),
            prevPipe: pipe,
          };
        }

        if (acc.inside) {
          console.log(row, col, acc.prevPipe, currentPipe);
          return {
            sum: acc.sum + 1,
            inside: acc.inside,
            prevPipe: acc.prevPipe,
          };
        }

        return acc;
      },
      { sum: 0, inside: false, prevPipe: undefined }
    );

    return sum + lineSum.sum;
  }, 0);
};

const isContinuation = (pervious: string, next: string) => {
  if (!isValidPipe(pervious) || !isValidPipe(next)) {
    return false;
  }

  return PipeEnum[pervious]
    .map((direction: keyof typeof Continuation) => Continuation[direction])
    .some((dir) => PipeEnum[next].includes(dir));
};

const getIsInside = (previous: string, current: string, inside: boolean) => {
  if (!previous) {
    return true;
  }

  return isContinuation(previous, current) ? inside : !inside;
};

const getStartingCoordinates = (lines: string[]): Coordinates => {
  let startingRow: number | null = null;
  let i = 0;

  while (typeof startingRow !== "number") {
    if (lines[i].includes("S")) {
      startingRow = i;
    }
    i++;
  }

  return { col: lines[startingRow].indexOf("S"), row: startingRow };
};

// Part 1
const traversePipe = (start: Coordinates, data: string[]) => {
  const firstNeighbours = getNeighbours(start, data);

  let previousLeft = start;
  let previousRight = start;
  let currentLeft = firstNeighbours[0];
  let currentRight = firstNeighbours[1];

  let step = 1;

  while (
    currentLeft.col !== currentRight.col ||
    currentLeft.row !== currentRight.row
  ) {
    const nextLeftNeighbours = getNeighbours(currentLeft, data);
    const nextRightNeighbours = getNeighbours(currentRight, data);

    const nextLeft = nextLeftNeighbours.find(
      (left) => left.col !== previousLeft.col || left.row !== previousLeft.row
    );
    const nextRight = nextRightNeighbours.find(
      (right) =>
        right.col !== previousRight.col || right.row !== previousRight.row
    );

    previousLeft = currentLeft;
    previousRight = currentRight;

    currentLeft = nextLeft;
    currentRight = nextRight;

    step++;
  }

  return step;
};

// Not working :(
// Part 2
const getPipeElements = (start: Coordinates, data: string[]) => {
  const firstNeighbours = getNeighbours(start, data);

  let previousLeft = start;
  let previousRight = start;
  let currentLeft = firstNeighbours[0];
  let currentRight = firstNeighbours[1];

  const loop = [start, currentLeft, currentRight];

  while (
    currentLeft.col !== currentRight.col ||
    currentLeft.row !== currentRight.row
  ) {
    const nextLeftNeighbours = getNeighbours(currentLeft, data);
    const nextRightNeighbours = getNeighbours(currentRight, data);

    const nextLeft = nextLeftNeighbours.find(
      (left) => left.col !== previousLeft.col || left.row !== previousLeft.row
    );
    const nextRight = nextRightNeighbours.find(
      (right) =>
        right.col !== previousRight.col || right.row !== previousRight.row
    );

    previousLeft = currentLeft;
    previousRight = currentRight;

    currentLeft = nextLeft;
    currentRight = nextRight;

    loop.push(currentLeft);
    loop.push(currentRight);
  }

  return loop;
};

const getNeighbours = (
  position: Coordinates,
  data: string[]
): Coordinates[] => {
  const maxRow = data.length - 1;
  const maxCol = data[0].length - 1;
  const neighbours: Coordinates[] = [];

  const pipeSymbol = data[position.row].split("")[position.col];

  if (!isValidPipe(pipeSymbol)) {
    return neighbours;
  }

  const pipe = PipeEnum[pipeSymbol];

  if (pipe.includes("top") && position.row > 0) {
    const neighbourPosition = { col: position.col, row: position.row - 1 };
    if (checkConnection(data, neighbourPosition, "top")) {
      neighbours.push(neighbourPosition);
    }
  }

  if (pipe.includes("bottom") && position.row < maxRow) {
    const neighbourPosition = { col: position.col, row: position.row + 1 };
    if (checkConnection(data, neighbourPosition, "bottom")) {
      neighbours.push(neighbourPosition);
    }
  }

  if (pipe.includes("left") && position.col > 0) {
    const neighbourPosition = { col: position.col - 1, row: position.row };
    if (checkConnection(data, neighbourPosition, "left")) {
      neighbours.push(neighbourPosition);
    }
  }

  if (pipe.includes("right") && position.col < maxCol) {
    const neighbourPosition = { col: position.col + 1, row: position.row };
    if (checkConnection(data, neighbourPosition, "right")) {
      neighbours.push(neighbourPosition);
    }
  }

  return neighbours;
};

const isValidPipe = (pipe: string): pipe is keyof typeof PipeEnum =>
  Object.keys(PipeEnum).includes(pipe);

const checkConnection = (
  data: string[],
  position: Coordinates,
  checkFor: string
) => {
  const pipeSymbol = data[position.row].split("")[position.col];

  if (!isValidPipe(pipeSymbol)) {
    return false;
  }

  switch (checkFor) {
    case "top":
      return PipeEnum[pipeSymbol].includes("bottom");
    case "bottom":
      return PipeEnum[pipeSymbol].includes("top");
    case "right":
      return PipeEnum[pipeSymbol].includes("left");
    case "left":
      return PipeEnum[pipeSymbol].includes("right");
  }
};
