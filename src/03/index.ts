import { readFileSync } from "fs";

const splitLines = (text: string) => text.split("\n");

// Part 1
export const runPart1 = async () => {
  const data = await readFileSync("./src/03/input.txt", "utf-8");
  let sum = 0;

  splitLines(data).forEach((line, rowIndex, rows) => {
    let save = "";
    let isValid = false;

    line.split("").forEach((cell, cellIndex, cells) => {
      const prevRowIndex = Math.max(rowIndex - 1, 0);
      const nextRowIndex = Math.min(rowIndex + 1, rows.length - 1);

      const cellAbove = rows[prevRowIndex].charAt(cellIndex);
      const cellBelow = rows[nextRowIndex].charAt(cellIndex);

      const isCellNumber = cell.match(/\d/);

      const areSymbolsInGroup = [cellAbove, cell, cellBelow].some(
        (c) => c !== "." && !c.match(/\d/)
      );

      if (isCellNumber) {
        save += cell;

        if (cellIndex === cells.length - 1) {
          if (isValid || areSymbolsInGroup) {
            sum += Number(save);
            save = "";
          }
        }

        isValid ||= areSymbolsInGroup;
      } else {
        if ((isValid || areSymbolsInGroup) && save) {
          sum += Number(save);
          isValid = areSymbolsInGroup;
        } else if (!save) {
          isValid = areSymbolsInGroup;
        } else if (save) {
          isValid ||= areSymbolsInGroup;
        }
        save = "";
      }
    });

    save = "";
    isValid = false;
  });

  return sum;
};

// Part 2
export const run = async () => {
  const data = await readFileSync("./src/03/input.txt", "utf-8");
  const asteriskHash: Record<string, number[]> = {};

  splitLines(data).forEach((line, rowIndex, rows) => {
    let save = "";
    let asteriskLocation = "";

    line.split("").forEach((cell, cellIndex, cells) => {
      const prevRowIndex = Math.max(rowIndex - 1, 0);
      const nextRowIndex = Math.min(rowIndex + 1, rows.length - 1);

      const cellAbove = rows[prevRowIndex].charAt(cellIndex);
      const cellBelow = rows[nextRowIndex].charAt(cellIndex);

      const isCellNumber = cell.match(/\d/);

      const asteriskPosition = [cellAbove, cell, cellBelow].indexOf("*");
      const adjacentAsterisk =
        asteriskPosition !== -1
          ? `${rowIndex + (asteriskPosition - 1)}-${cellIndex}`
          : "";

      if (isCellNumber) {
        save += cell;

        if (cellIndex === cells.length - 1) {
          if (asteriskLocation || adjacentAsterisk) {
            const key = asteriskLocation || adjacentAsterisk;
            asteriskHash[key] = [...(asteriskHash[key] || []), Number(save)];
            save = "";
          }
        }

        asteriskLocation ||= adjacentAsterisk;
      } else {
        if ((asteriskLocation || adjacentAsterisk) && save) {
          const key = asteriskLocation || adjacentAsterisk;
          asteriskHash[key] = [...(asteriskHash[key] || []), Number(save)];
          asteriskLocation = adjacentAsterisk;
        } else if (!save) {
          asteriskLocation = adjacentAsterisk;
        } else if (save) {
          asteriskLocation ||= adjacentAsterisk;
        }
        save = "";
      }
    });

    save = "";
    asteriskLocation = "";
  });

  return Object.values(asteriskHash).reduce((acc, values) => {
    if (values.length !== 2) {
      return acc;
    }

    return acc + values[0] * values[1];
  }, 0);
};
