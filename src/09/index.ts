import { readFileSync } from "fs";

const splitLines = (text: string) => text.split("\n");
const extractNumbers = (text: string) =>
  text.split(" ").filter(Boolean).map(Number);

// Part 1
export const runPart1 = async () => {
  const data = await readFileSync("./src/09/input.txt", "utf-8");

  return splitLines(data).reduce((acc, line) => {
    const nextValue = getNextHistoryValue(extractNumbers(line));
    return acc + nextValue;
  }, 0);
};

const getNextHistoryValue = (numbers: number[]): number => {
  const newNumbers = numbers
    .map((current, index, self) =>
      index >= self.length - 1 ? null : self[index + 1] - current
    )
    .filter((num) => num !== null);

  const lastNumber = numbers[numbers.length - 1];

  if (newNumbers.every((num) => num === 0)) {
    return lastNumber;
  }

  return lastNumber + getNextHistoryValue(newNumbers);
};

// Part 2

export const run = async () => {
  const data = await readFileSync("./src/09/input.txt", "utf-8");

  return splitLines(data).reduce((acc, line) => {
    const previousValue = getNextPreviousValue(extractNumbers(line));
    return acc + previousValue;
  }, 0);
};

const getNextPreviousValue = (numbers: number[]): number => {
  const newNumbers = numbers
    .map((current, index, self) =>
      index >= self.length - 1 ? null : self[index + 1] - current
    )
    .filter((num) => num !== null);

  const firstNumber = numbers[0];

  if (newNumbers.every((num) => num === 0)) {
    return firstNumber;
  }

  return firstNumber - getNextPreviousValue(newNumbers);
};
