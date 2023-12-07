import { readFileSync } from "fs";

const splitLines = (text: string) => text.split("\n");
const extractNumbers = (text: string) =>
  text.split(" ").filter(Boolean).map(Number);

// Part 1
export const run = async () => {
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

// export const run = async () => {
//   const data = await readFileSync("./src/05/input.txt", "utf-8");

//   const lines = splitLines(data);

//   const seedsLine = lines.shift();
//   const [_, seedsText] = seedsLine.split(": ");
//   const seedRanges = extractNumbers(seedsText);
//   const seeds: number[][] = [];

//   for (let i = 0; i < seedRanges.length; i += 2) {
//     seeds.push([seedRanges[i], seedRanges[i] + seedRanges[i + 1]]);
//   }

//   const transformers = lines.reduce((acc, line) => {
//     if (!line.trim()) {
//       return acc;
//     }

//     if (line.includes("map")) {
//       acc.push({});
//       return acc;
//     }

//     const [destinationStart, sourceStart, range] = extractNumbers(line);

//     acc[acc.length - 1][`${sourceStart} ${sourceStart + range}`] =
//       destinationStart - sourceStart;

//     return acc;
//   }, [] as Record<string, number>[]);

//   const ranges = transformers.reduce((transformedSeeds, transform) => {
//     return transformedSeeds.reduce((tsAcc, seedRange) => {
//       const [minSeed, maxSeed] = seedRange;

//       const newAcc = Object.entries(transform).reduce((eAcc, entry) => {
//         const [range, value] = entry;
//         const [minRange, maxRange] = extractNumbers(range);

//         if (maxSeed < minRange || minSeed > maxRange) {
//           return eAcc;
//         } else {
//           if (maxRange < maxSeed) {
//             return [
//               ...eAcc,
//               [minSeed + value, maxRange + value],
//               [maxRange, maxSeed],
//             ];
//           } else if (minRange > minSeed) {
//             return [
//               ...eAcc,
//               [minSeed, minRange],
//               [minRange + value, maxSeed + value],
//             ];
//           } else {
//             return [...eAcc, [minSeed + value, maxSeed + value]];
//           }
//         }
//       }, []);

//       if (newAcc.length === 0) {
//         return [...tsAcc, [minSeed, maxSeed]];
//       }

//       return [...tsAcc, ...newAcc];
//     }, []);
//   }, seeds);

//   return Math.min(...ranges.map((i) => i[0]));
// };
