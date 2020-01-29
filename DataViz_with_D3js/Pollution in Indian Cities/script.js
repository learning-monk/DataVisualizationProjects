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
