import NepaliDate from "nepali-datetime";

function getFormattedBsDateFromAdDate(adDate) {
  // Convert AD date to BS date
  const date = new NepaliDate(new Date(adDate));
  return date.format('dddd, DD MMMM YYYY') // 'Monday, 24 Aswin 2051'
}

function getBsToday(){
    const date = new NepaliDate();
    return date.format('YYYY-MM-DD') // '2078-07-07'
}

function getBsFromAdDate(adDate){
    console.log(adDate);
    const [year, month, day] = adDate.split('-').map(Number);
    const date = NepaliDate.fromEnglishDate(year, month-1 , day);
    console.log("returning ---")
    console.log(date.format('YYYY-MM-DD'));
    return date.format('YYYY-MM-DD') // '2078-07-07'
}

export { getFormattedBsDateFromAdDate , getBsToday, getBsFromAdDate};