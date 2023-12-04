import { input } from "./input";

// Part 1
const traversFromStart = /^.*?(\d).*?/;
const traversFromEnd = /.*(\d).*?$/;

export const runPart1 = () => {
  return input.reduce((acc, line) => {
    const fromStart = line.match(traversFromStart);
    const fromEnd = line.match(traversFromEnd);

    if (!fromEnd || !fromStart) {
      throw new Error("Number does not exists in line");
    }

    return acc + Number(`${fromStart[1]}${fromEnd[1]}`);
  }, 0);
};

// Part 2
const NumberEnum = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
} as const;

const numberStrings = Object.keys(NumberEnum);
const numberStringsForRegexp = numberStrings.join("|");

const traversWithStringsFromStart = new RegExp(
  `^.*?(\\d|${numberStringsForRegexp}).*?`
);
const traversWithStringsFromEnd = new RegExp(
  `.*(\\d|${numberStringsForRegexp}).*?$`
);

const isNumberString = (value: string): value is keyof typeof NumberEnum =>
  numberStrings.includes(value);

export const run = () => {
  return input.reduce((acc, line) => {
    const fromStart = line.match(traversWithStringsFromStart);
    const fromEnd = line.match(traversWithStringsFromEnd);

    if (!fromEnd || !fromStart) {
      throw new Error("Number does not exists in line");
    }

    const value1 = fromStart[1];
    const value2 = fromEnd[1];

    const number1 = isNumberString(value1) ? NumberEnum[value1] : value1;
    const number2 = isNumberString(value2) ? NumberEnum[value2] : value2;

    return acc + Number(`${number1}${number2}`);
  }, 0);
};
