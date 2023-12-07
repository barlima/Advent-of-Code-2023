import { readFileSync } from "fs";

const splitLines = (text: string) => text.split("\n");

const extractNumbers = (text: string) =>
  text.split(" ").filter(Boolean).map(Number);

const getDistanceFromTimePressed = (timeLimit: number) => {
  const possiblePressTimes = new Array(timeLimit - 1)
    .fill(0)
    .map((_, i) => i + 1);

  return possiblePressTimes.map((time) => {
    const speed = time;
    const moveTime = timeLimit - time;
    return speed * moveTime;
  });
};

// Input file changed for Part1 and Part2
// Part 2 seems to be slow, might refactor later
export const run = async () => {
  const data = await readFileSync("./src/06/input.txt", "utf-8");

  const [timeTextLine, distanceTextLine] = splitLines(data);

  const time = extractNumbers(timeTextLine.split(":")[1]);
  const currectRecords = extractNumbers(distanceTextLine.split(":")[1]);

  const possibleDistancesPerRace = time.map(getDistanceFromTimePressed);

  const possibleWinsPerRace = possibleDistancesPerRace.map(
    (distances, index) => {
      return distances.filter((distance) => distance > currectRecords[index])
        .length;
    }
  );

  return possibleWinsPerRace.reduce((acc, options) => acc * options);
};
