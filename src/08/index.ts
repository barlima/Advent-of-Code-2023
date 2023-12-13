import { readFileSync } from "fs";

const splitLines = (text: string) => text.split("\n");

const Direction = {
  L: 0,
  R: 1,
} as const;

// Part 1
export const run = async () => {
  const data = await readFileSync("./src/08/input.txt", "utf-8");

  const lines = splitLines(data);
  const sequence = lines.shift();

  const moves = lines.reduce((acc, line) => {
    if (!line.trim()) {
      return acc;
    }

    const [key, leftRight] = line.split(" = ");
    const [left, right] = leftRight.replace(/(\(|\))/g, "").split(", ");

    return {
      ...acc,
      [key]: [left, right],
    };
  }, {} as Record<string, [string, string]>);

  let steps = 0;
  let position = "AAA";

  while (position !== "ZZZ") {
    const index = steps % sequence.length;
    const turn = sequence.charAt(index) as keyof typeof Direction;

    position = moves[position][Direction[turn]];
    steps += 1;
  }

  return steps;
};

// Part 2
// const goThroughSequence = (
//   start: string,
//   sequence: string,
//   moves: Record<string, string[]>
// ): string[] => {
//   return new Array(sequence.length).fill(0).reduce(
//     (acc, _, index) => {
//       const turn = sequence.charAt(index) as keyof typeof Direction;
//       return [...acc, moves[acc[acc.length - 1]][Direction[turn]]];
//     },
//     [start] as string[]
//   );
// };

// export const run = async () => {
//   const data = await readFileSync("./src/08/input.txt", "utf-8");

//   const lines = splitLines(data);
//   const sequence = lines.shift();

//   const moves = lines.reduce((acc, line) => {
//     if (!line.trim()) {
//       return acc;
//     }

//     const [key, leftRight] = line.split(" = ");
//     const [left, right] = leftRight.replace(/(\(|\))/g, "").split(", ");

//     return {
//       ...acc,
//       [key]: [left, right],
//     };
//   }, {} as Record<string, string[]>);

//   const locations = Object.keys(moves);

//   const sequenceFromLocation = locations.reduce((acc, location) => {
//     return {
//       ...acc,
//       [location]: goThroughSequence(location, sequence, moves),
//     };
//   }, {} as Record<string, string[]>);

//   const sequencesWithLocations = Object.entries(sequenceFromLocation).reduce(
//     (acc, entry) => {
//       const [key, seq] = entry;

//       const zLocations = seq.filter((s) => s.endsWith("Z"));
//       const zPositions = zLocations.map((z) => seq.indexOf(z));

//       return {
//         ...acc,
//         [key]: {
//           zIndex: zPositions,
//           lastLocation: seq[seq.length - 1],
//         },
//       };
//     },
//     {} as Record<string, { zIndex: number[]; lastLocation: string }>
//   );

//   const startingPositions = Object.keys(moves).filter((move) =>
//     move.endsWith("A")
//   );

//   const loopPositions = startingPositions.map((position) => {
//     const sequenceLength = sequence.length;
//     let recent = position;
//     let visited: string[] = [recent];
//     let i = 0;

//     while (!(visited.includes(recent) && i !== 0)) {
//       const { lastLocation } = sequencesWithLocations[recent];
//       visited.push(recent);
//       recent = lastLocation;
//       i++;
//     }
//     const offset = (visited.indexOf(recent) - 1) * sequenceLength;

//     return { position: recent, offset, length: i * sequenceLength - offset };
//   });

//   const finalData = loopPositions.map((position) => {
//     const sequenceLength = sequence.length;
//     let recent = position.position;
//     let visited: string[] = [];
//     const zIndexes: number[] = [];
//     let i = 0;

//     while (!visited.includes(recent)) {
//       const { zIndex, lastLocation } = sequencesWithLocations[recent];

//       if (zIndex.length) {
//         zIndex.forEach((z) => {
//           if (!zIndexes.includes(i * sequenceLength + z)) {
//             zIndexes.push(i * sequenceLength + z);
//           }
//         });
//       }

//       visited.push(recent);
//       recent = lastLocation;
//       i++;
//     }

//     return { ...position, zIndexes };
//   });

//   // zIndexes contain only one location
//   // and it turns out length is equal to first
//   // const order = finalData.map((data) => ({
//   //   first: data.offset + data.zIndexes[0],
//   //   length: data.length,
//   // }));

//   const reoccuring = finalData.map((d) => d.length).sort();

//   console.log(reoccuring);

//   let found = false;
//   let i = 0;
//   let x = {} as Record<string, number>;

//   while (!found) {
//     x = reoccuring
//       .map((r) => r * (i + 1))
//       .reduce((acc, r) => {
//         const existing = acc[r.toString()] || 0;

//         if (existing === 4) {
//           found = true;
//           console.log(existing);
//         }

//         return {
//           ...acc,
//           [r.toString()]: existing + 1,
//         };
//       }, {} as Record<string, number>);
//   }
// };
