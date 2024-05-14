import NepaliDate from "nepali-date-converter";

function getBsDateFromAdDate(adDate) {
  // Convert AD date to BS date
  const date = new NepaliDate(new Date(adDate));
  return date.format('ddd, DD MMMM YYYY') // 'Monday, 24 Aswin 2051'

}

export { getBsDateFromAdDate };