import { readFileSync } from "fs";

const splitLines = (text: string) => text.split("\n");

export const run = async () => {
  const data = await readFileSync("./src/12/input.txt", "utf-8");

  splitLines(data).reduce((acc, line) => {
    const arrangements = getArrangementsNumber(line);

    return acc + arrangements;
  }, 0);
};

const getArrangementsNumber = (line: string) => {
  const [arrangement, conditionsText] = line.split(" ");
  const conditions = conditionsText.split(",").map(Number);

  console.log(arrangement, conditions);

  const replaced = arrangement.replaceAll("?", "#");

  // const slots = replaced
  //   .split(".")
  //   .map((i) => i.length)
  //   .filter(Boolean);

  return 0;
};
