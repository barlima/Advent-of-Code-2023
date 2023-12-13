import { readFileSync } from "fs";

const splitLines = (text: string) => text.split("\n");
const extractNumbers = (text: string) =>
  text.split(" ").filter(Boolean).map(Number);

// Part 1
export const runPart1 = async () => {
  const data = await readFileSync("./src/05/input.txt", "utf-8");

  const lines = splitLines(data);

  const seedsLine = lines.shift();
  const [_, seedsText] = seedsLine.split(": ");
  const seeds = extractNumbers(seedsText);

  const transformers = lines.reduce((acc, line) => {
    if (!line.trim()) {
      return acc;
    }

    if (line.includes("map")) {
      acc.push({});
      return acc;
    }

    const [destinationStart, sourceStart, range] = extractNumbers(line);

    acc[acc.length - 1][`${sourceStart} ${sourceStart + range}`] =
      destinationStart - sourceStart;

    return acc;
  }, [] as Record<string, number>[]);

  const locations = seeds.map((seed) => {
    return transformers.reduce((acc, transform) => {
      const transformRange = Object.keys(transform).find((t) => {
        const [min, max] = extractNumbers(t);
        return acc >= min && acc < max;
      });

      return transformRange ? acc + transform[transformRange] : acc;
    }, seed);
  });

  console.log(transformers, locations);

  return Math.min(...locations);
};

// Part 2

// Doesn't work yet...

export const run = async () => {
  const data = await readFileSync("./src/05/input-test.txt", "utf-8");

  const lines = splitLines(data);

  const seedsLine = lines.shift();
  const [_, seedsText] = seedsLine.split(": ");
  const seedRanges = extractNumbers(seedsText);
  const seeds: number[][] = [];

  for (let i = 0; i < seedRanges.length; i += 2) {
    seeds.push([seedRanges[i], seedRanges[i] + seedRanges[i + 1]]);
  }

  const functions = lines.reduce((acc, line) => {
    if (!line.trim()) {
      return acc;
    }

    if (line.includes("map")) {
      acc.push([]);
      return acc;
    }

    const [destinationStart, sourceStart, range] = extractNumbers(line);

    acc[acc.length - 1].push({
      min: sourceStart,
      max: sourceStart + range,
      value: destinationStart - sourceStart,
    });

    return acc;
  }, [] as { min: number; max: number; value: number }[][]);

  functions.reduce((acc, funcRanges) => {
    seeds.map(seedRange => {
      const [min, max] = seedRange;

      funcRanges.reduce((fAcc, func) => {
        if (func.max <= min || func.min > max) {
          return fAcc
        } else {
          // Split sets
          return fAcc
        }
      }, seedRange)
    })

    return acc;
  }, seeds)
};
