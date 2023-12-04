import { readFileSync } from "fs";

// Part 1
const MAX_BALLS = {
  red: 12,
  green: 13,
  blue: 14,
};

const splitLines = (text: string) => text.split("\n");

const isValidColor = (color: string): color is keyof typeof MAX_BALLS =>
  Object.keys(MAX_BALLS).includes(color);

const isResultPossible = (text: string) => {
  const [count, color] = text.split(" ");

  if (!isValidColor(color)) {
    return false;
  }

  return Number(count) <= MAX_BALLS[color];
};

const getSumOfPlayableGamesIds = (line: string) => {
  const [gameId, rounds] = line.split(": ");

  const [_, id] = gameId.split(" ");

  const isPossible = rounds
    .split("; ")
    .every((round) => round.split(", ").every(isResultPossible));

  return isPossible ? Number(id) : 0;
};

// Part 2
const getPowerOfGames = (line: string) => {
  const [_, rounds] = line.split(": ");

  const minBallsRequired = rounds.split("; ").reduce(
    (acc, round) => {
      const balls = Object.fromEntries(
        round.split(", ").map((text) => text.split(" ").reverse())
      );

      const { red = "0", green = "0", blue = "0" } = balls;

      return {
        red: Math.max(acc.red, Number(red)),
        green: Math.max(acc.green, Number(green)),
        blue: Math.max(acc.blue, Number(blue)),
      };
    },
    { red: 0, green: 0, blue: 0 }
  );

  return minBallsRequired.red * minBallsRequired.green * minBallsRequired.blue;
};

export const run = async () => {
  const data = await readFileSync("./src/02/input.txt", "utf-8");

  return splitLines(data).reduce((acc, line) => {
    // Part 1
    // return acc + getSumOfPlayableGamesIds(line);

    // Part 2
    return acc + getPowerOfGames(line);
  }, 0);
};
