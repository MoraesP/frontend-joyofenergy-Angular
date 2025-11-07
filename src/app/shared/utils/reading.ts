import { Data } from "../models/dataModel";

export const getReadings = async (length: number = 1200): Promise<Data[]> => {
  const current = Date.now();
  const hour = 1000 * 60 * 60;
  return [...new Array(length)].map((_, index) => ({
    time: current - index * hour,
    value: Math.random() * 0.7 + 0.4,
  }));
};

export const groupByDay = (readings: Data[]): Data[] => {
  const groupedByDay = readings.reduce(
    (curr: { [key: number]: number }, { time, value }) => {
      const readingDate = new Date(time);
      const day = new Date(
        readingDate.getFullYear(),
        readingDate.getMonth(),
        readingDate.getDate()
      ).getTime();
      if (!curr[day]) curr[day] = 0;
      curr[day] += value;
      return curr;
    },
    {}
  );

  return Object.entries(groupedByDay).map(([day, value]) => ({
    time: Number(day),
    value: value as number,
  }));
};

export const sortByTime = (readings: Data[]): Data[] => {
  return [...readings].sort(
    (readingA, readingB) => readingA.time - readingB.time
  );
};
