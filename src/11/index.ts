import { readFileSync } from "fs";

// Part one -> DISTANCE = 2
const DISTANCE = 1000000;

const getLocations = (matrix: string[][]) => {
  const locations = [];

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] === "#") {
        locations.push([y, x]);
      }
    }
  }

  return locations;
};

export const run = async () => {
  const data = await readFileSync("./src/11/input.txt", "utf-8");

  const matrix = data.split("\n").map((row) => row.split(""));
  const locations = getLocations(matrix);

  const rowsWithGalaxies = locations.map(([y, _]) => y);
  const columnsWithGalaxies = locations.map(([_, x]) => x);

  const distancesSum = locations.reduce((sum, location, index, self) => {
    for (let i = index + 1; i < self.length; i++) {
      const [y, x] = location;
      const [dy, dx] = self[i];

      let additionalDistance = 0;

      for (let i = Math.min(y, dy) + 1; i <= Math.max(y, dy); i++) {
        // console.log("i-> ", i);
        if (!rowsWithGalaxies.includes(i)) {
          additionalDistance += DISTANCE - 1;
        }
      }

      for (let j = Math.min(x, dx) + 1; j <= Math.max(x, dx); j++) {
        // console.log("j-> ", j);
        if (!columnsWithGalaxies.includes(j)) {
          additionalDistance += DISTANCE - 1;
        }
      }

      const distance = Math.abs(dy - y) + Math.abs(dx - x) + additionalDistance;
      // console.log(y, x, "->", dy, dx, additionalDistance, distance);

      sum += distance;
    }

    return sum;
  }, 0);

  return distancesSum;
};
