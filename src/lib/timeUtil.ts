import dayjs from "dayjs";

export const get5MinuteFormat = (date?: string) => {
  const minute = dayjs(date).minute();
  const roundedMinute = Math.ceil(minute / 5) * 5;
  return dayjs(date)
    .minute(roundedMinute)
    .second(0)
    .format("YYYY-MM-DDTHH:mm:ss");
};
