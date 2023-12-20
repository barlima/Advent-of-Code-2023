import { readFileSync } from "fs";

const splitLines = (text: string) => text.split("\n");

// for Part 1 set it to 0
// not sure what is wrong with part 2
const DIFFERENCE_LIMIT = 1;

export const run = async () => {
  const data = await readFileSync("./src/13/input-test.txt", "utf-8");

  const patterns = splitLines(data).reduce(
    (acc, line) => {
      if (!line.trim()) {
        acc.push([]);
        return acc;
      }

      acc[acc.length - 1].push(line);
      return acc;
    },
    [[]]
  );

  const sum = patterns.reduce((acc, pattern) => {
    // let row = 0;
    // let column = 0;
    // let smudge: number[];

    const [row, smudge] = getDistanceFromMiddle(pattern, DIFFERENCE_LIMIT);
    const transposedPattern = transpose(pattern, smudge);
    const [column] = getDistanceFromMiddle(transposedPattern);

    return acc + row * 100 + column;
  }, 0);

  return sum;
};

const getDifferencesNumber = (a: string, b: string) => {
  let diff = 0;
  let index: number;

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      diff++;
      index ||= i;
    }
  }

  return [diff, index];
};

const getDistanceFromMiddle = (
  pattern: string[],
  diffLimit: number = 0
): [number, null | number[]] => {
  let value = 0;
  let smudge = null;

  for (let y = 1; y < pattern.length; y++) {
    const [diff] = getDifferencesNumber(pattern[y - 1], pattern[y]);

    if (diff <= diffLimit) {
      const [isValid, smudgeCoordinates] = checkHorizontal(pattern, y);

      if (isValid) {
        value = y;
        smudge = smudgeCoordinates;
        break;
      }
    }
  }

  return [value, smudge];
};

const checkHorizontal = (
  pattern: string[],
  row: number
): [boolean, null | number[]] => {
  const half1 = pattern.slice(0, row).reverse();
  const half2 = pattern.slice(row);
  let match = true;
  let differences = 0;
  let smudge = null;

  for (let i = 0; i < Math.min(half1.length, half2.length); i++) {
    const [diffrentCharacters, smudgeX] = getDifferencesNumber(
      half1[i],
      half2[i]
    );

    if (diffrentCharacters > 1) {
      match = false;
      break;
    }

    if (diffrentCharacters === 1) {
      // console.log(half1[i], half2[i]);
      smudge = [smudgeX, row + i];
      differences++;
    }
  }

  return [match && differences <= DIFFERENCE_LIMIT, smudge];
};

const transpose = (matrix: string[], replace?: null | number[]) => {
  if (!replace) {
    return matrix[0]
      .split("")
      .map((_, i) => matrix.map((row) => row[i]).join(""));
  }

  const [x, y] = replace;

  return matrix[0].split("").map((_, i) =>
    matrix
      .map(
        (row, j) => (i === x && j === y ? (row[i] === "#" ? "." : "#") : row[i])
        // (row, j) => (i === x && j === y ? "@" : row[i])
      )
      .join("")
  );
};
