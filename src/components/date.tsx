import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const Date = (dateObject: any) => {
  const dateString = dateObject.date;
  const formattedDate = dayjs(dateString).format("YYYY.MM.DD");

  return <time dateTime={dateString}>{formattedDate}</time>;
};

export default Date;
