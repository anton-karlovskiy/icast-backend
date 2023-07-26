
import moment from 'moment';

const DATE_FORMAT = 'YYYY-MM-DD';
const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const END_TIME = '23:59:59';
const GOAL_SERVE_DATE_FORMAT = 'DD.MM.YYYY';
const GOAL_SERVE_CONVERT_DATE_FORMAT = 'YYYY.MM.DD';
const GOAL_SERVE_DATE_AND_TIME_FORMAT = 'DD.MM.YYYY HH:mm';

const getPeriodDates = (startDate, endDate, interval) => {
  let result = [];
  const startDateTimeStamp = moment(startDate, DATE_FORMAT);
  const endDateTimeStamp = moment(endDate, DATE_FORMAT);
  const fullDiff = moment.duration(endDateTimeStamp.diff(startDateTimeStamp)) / 1000;
  const multiple = Math.floor(fullDiff / interval) + 1;
  const dayTimeStamp = 24 * 3600 * 1000;
  let endPeriodTimeStamp;
  let startPeriodTimeStamp;

  for (let index = 0; index < multiple; index++) {
    if (index === 0) {
      startPeriodTimeStamp = Number(startDateTimeStamp.format('x'));
      endPeriodTimeStamp = Number(startDateTimeStamp.format('x')) + Number((index + 1) * (interval * 1000 - dayTimeStamp));
    } else {
      startPeriodTimeStamp =
        Number(startDateTimeStamp.format('x')) + Number(index * (interval * 1000 - dayTimeStamp)) + dayTimeStamp * index;
      endPeriodTimeStamp =
        Number(startDateTimeStamp.format('x')) + Number((index + 1) * (interval * 1000 - dayTimeStamp)) + dayTimeStamp * index;
    }
    if (endPeriodTimeStamp > Number(endDateTimeStamp.format('x'))) {
      endPeriodTimeStamp = endDateTimeStamp;
    }
    const periodStartDate = moment(startPeriodTimeStamp).format(DATE_FORMAT);
    const periodEndDate = moment(endPeriodTimeStamp).format(DATE_FORMAT);
    result = [...result, { startDate: periodStartDate, endDate: periodEndDate }];
  }
  return result;
};

const isValidDate = date => {
  const timestamp = moment.utc(date, GOAL_SERVE_CONVERT_DATE_FORMAT);
  return timestamp.isValid();
};

export {
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  END_TIME,
  GOAL_SERVE_DATE_FORMAT,
  GOAL_SERVE_CONVERT_DATE_FORMAT,
  GOAL_SERVE_DATE_AND_TIME_FORMAT,
  getPeriodDates,
  isValidDate
};
