const width = 1200,
  height = 1000;

const margin = { top: 100, right: 100, bottom: 100, left: 100 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Converting string to dates
const myFormat = d3.timeParse("%Y-%m-%d");
const myYear = d3.timeParse("%Y");
const myMonth = d3.timeParse("%m");
const myDay = d3.timeParse("%d");

// Converting dates to strings
const formatDate = d3.timeFormat("%Y-%m-%d");
const formatYear = d3.timeFormat("%Y");
const formatMonth = d3.timeFormat("%m");
const formatDay = d3.timeFormat("%d");

d3.csv(
  "https://raw.githubusercontent.com/learning-monk/datasets/master/ENVIRONMENT/Indian_cities_daily_pollution_2015-2020.csv"
).then((data) => {
  // console.log(data);
  data.forEach((d) => {
    d.Date = myFormat(d.Date);
    // d.year = myYear(d.Date);
    // d.month = myMonth(d.Date);
    d["PM2.5"] = d["PM2.5"] == "" ? 0 : +d["PM2.5"];
    d.PM10 = d.PM10 == "" ? 0 : +d.PM10;
    d.NO = d.NO == "" ? 0 : +d.NO;
    d.NO2 = d.NO2 == "" ? 0 : +d.NO2;
    d.NOx = d.NOx == "" ? 0 : +d.NOx;
    d.SO2 = d.SO2 == "" ? 0 : +d.SO2;
    d.CO = d.CO == "" ? 0 : +d.CO;
    d.NH3 = d.NH3 == "" ? 0 : +d.NH3;
    d.O3 = d.O3 == "" ? 0 : +d.O3;
    d.Benzene = d.Benzene == "" ? 0 : +d.Benzene;
    d.Toluene = d.Toluene == "" ? 0 : +d.Toluene;
    d.Xylene = d.Xylene == "" ? 0 : +d.Xylene;
    d.AQI = d.AQI == "" ? 0 : +d.AQI;
  });
  console.log(data);
});
