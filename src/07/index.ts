import { readFileSync } from "fs";

const splitLines = (text: string) => text.split("\n");

const Card = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  T: 10,
  J: 0, // Previously 11
  Q: 12,
  K: 13,
  A: 14,
} as const;

const Combination = {
  "11111": 0,
  "1112": 1,
  "122": 2,
  "113": 3,
  "23": 4,
  "14": 5,
  "5": 6,
} as const;

const isValidCombination = (value: string): value is keyof typeof Combination =>
  Object.keys(Combination).includes(value);

const getHandScore = (hand: string) => {
  const calculated = hand.split("").reduce((acc, card) => {
    acc[card] = (acc[card] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const combination = Object.values(calculated).sort().join("");

  if (isValidCombination(combination)) {
    return Combination[combination];
  }
};

// Part 1
export const runPart1 = async () => {
  const data = await readFileSync("./src/07/input.txt", "utf-8");

  const lines = splitLines(data);

  const handsAndBets = lines.reduce((acc, line) => {
    const [hand, bet] = line.split(" ");

    const handPoints = hand
      .split("")
      .map((card: keyof typeof Card) => Card[card]);

    return [
      ...acc,
      { hand: handPoints, bet: Number(bet), score: getHandScore(hand) },
    ];
  }, [] as { hand: number[]; bet: number; score: number }[]);

  const ranking = handsAndBets.sort((a, b) => {
    if (a.score === b.score) {
      const diff = a.hand
        .map((val, index) => val - b.hand[index])
        .filter(Boolean);

      return diff[0] > 0 ? 1 : -1;
    }

    return a.score > b.score ? 1 : -1;
  });

  return ranking.reduce((acc, hand, index) => {
    return acc + hand.bet * (index + 1);
  }, 0);
};

// Part 2

const getHandScoreWithJokers = (hand: string) => {
  const calculated = hand.split("").reduce((acc, card: keyof typeof Card) => {
    const cardKey = Card[card];
    acc[cardKey] = (acc[cardKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedByBestOption = Object.entries(calculated).sort((a, b) =>
    b[1] - a[1] > 0 ? 1 : -1
  );

  const bestOption = sortedByBestOption.find(
    (option) => Number(option[0]) !== Card.J
  );

  if (bestOption) {
    calculated[bestOption[0]] += calculated[Card.J] || 0;
    calculated[Card.J] = 0;
  }

  const combination = Object.values(calculated).filter(Boolean).sort().join("");

  console.log(combination);

  if (isValidCombination(combination)) {
    return Combination[combination];
  }
};

export const run = async () => {
  const data = await readFileSync("./src/07/input.txt", "utf-8");

  const lines = splitLines(data);

  const handsAndBets = lines.reduce((acc, line) => {
    const [hand, bet] = line.split(" ");

    const handPoints = hand
      .split("")
      .map((card: keyof typeof Card) => Card[card]);

    return [
      ...acc,
      {
        hand: handPoints,
        bet: Number(bet),
        score: getHandScoreWithJokers(hand),
      },
    ];
  }, [] as { hand: number[]; bet: number; score: number }[]);

  const ranking = handsAndBets.sort((a, b) => {
    if (a.score === b.score) {
      const diff = a.hand
        .map((val, index) => val - b.hand[index])
        .filter(Boolean);

      return diff[0] > 0 ? 1 : -1;
    }

    return a.score > b.score ? 1 : -1;
  });

  return ranking.reduce((acc, hand, index) => {
    return acc + hand.bet * (index + 1);
  }, 0);
};
