import { readFileSync } from "fs";

const splitLines = (text: string) => text.split("\n");
const extractNumbers = (text: string) =>
  text.split(" ").filter(Boolean).map(Number);

// Part 1
export const runPart1 = async () => {
  const data = await readFileSync("./src/04/input.txt", "utf-8");

  return splitLines(data).reduce((acc, game) => {
    const [_, numbers] = game.split(": ");
    const [winningNumbersText, myNumbersText] = numbers.split(" | ");

    const winningNumbers = extractNumbers(winningNumbersText);
    const myNumbers = extractNumbers(myNumbersText);

    const score = winningNumbers.reduce((sum, winningNumber) => {
      if (myNumbers.includes(winningNumber)) {
        return (sum || 0.5) * 2;
      }

      return sum;
    }, 0);

    return acc + score;
  }, 0);
};

// Part 2
export const run = async () => {
  const data = await readFileSync("./src/04/input.txt", "utf-8");

  const copies: Record<string, number> = {};

  const lines = splitLines(data);

  lines.forEach((game) => {
    const [gameId, numbers] = game.split(": ");
    const [winningNumbersText, myNumbersText] = numbers.split(" | ");

    const [_, id] = gameId.split(" ").filter(Boolean);
    const currentGame = Number(id);

    copies[currentGame] = (copies[currentGame] || 0) + 1;

    const winningNumbers = extractNumbers(winningNumbersText);
    const myNumbers = extractNumbers(myNumbersText);

    winningNumbers.reduce((index, winningNumber) => {
      const key = currentGame + index;

      if (myNumbers.includes(winningNumber)) {
        copies[key] = (copies[key] || 0) + copies[currentGame];
        return index + 1;
      }

      return index;
    }, 1);
  });

  // This could be done in a reduce so we dont iterate over 219 elements again
  return Object.values(copies).reduce((sum, value) => sum + value, 0);
};
