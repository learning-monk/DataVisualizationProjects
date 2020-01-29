const width = 1200,
  height = 1000;

const margin = { top: 100, right: 100, bottom: 100, left: 100 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Converting string to dates
const myFormatYear = d3.timeParse("%Y");
const myFormatMonth = d3.timeParse("%m");
// const myTimeFormat = d3.timeParse("%M:%S");

// Converting dates to strings
const formatYear = d3.timeFormat("%Y");
const formatMonth = d3.timeFormat("%B");

// Load data
d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
).then(temp => {
  temp.monthlyVariance.forEach(d => {
    d.year = myFormatYear(d.year);
    d.month = myFormatMonth(d.month);
    d.variance = +d.variance;
  });
  // console.log(
  //   d3.min(temp.monthlyVariance, d => d.variance) + temp.baseTemperature
  // );
  // console.log(
  //   d3.max(temp.monthlyVariance, d => d.variance) + temp.baseTemperature
  // );

  // define xScale
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(temp.monthlyVariance, d => d.year))
    .range([0, innerWidth])
    .nice();

  const xAxis = d3.axisBottom(xScale);

  const yScale = d3
    .scaleTime()
    .domain(d3.extent(temp.monthlyVariance, d => d.month))
    // .range([innerHeight, 0]);
    .range([0, innerHeight]); // flips the order of values

  const yAxis = d3.axisLeft(yScale).tickFormat(formatMonth);

  //Build color scale
  const myColor = d3
    .scaleSequential(d3.interpolateTurbo)
    // .scaleLinear()
    // .scaleSequential(t => d3.hsl(t * 360, 1, 0.5).toString())
    // .interpolator(d3.interpolateTurbo)
    .domain([
      d3.min(temp.monthlyVariance, d => d.variance) + temp.baseTemperature,
      d3.max(temp.monthlyVariance, d => d.variance) + temp.baseTemperature
    ]);
  // .range(["blue", "green", "orange", "red"]);
  // .domain([0, 10]);
  // .range(colours);

  // const values = d3
  //   .scaleLinear()
  //   .domain(
  //     d3.extent(temp.monthlyVariance, d => d.variance + temp.baseTemperature)
  //   )
  //   .range([0, 1]);

  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const mainG = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const g = mainG
    .selectAll("g")
    .data(temp.monthlyVariance, d => d.year + ":" + d.month)
    .enter()
    .append("g")
    .attr("transform", `translate(0,0)`);

  g.append("rect")
    .attr("class", "cell")
    .attr("x", d => xScale(d.year))
    .attr("y", d => yScale(d.month))
    .attr("rx", 2)
    .attr("ry", 4)
    .attr("width", innerWidth / temp.monthlyVariance.length / 2 + 5)
    .attr("height", d => innerHeight - yScale(d.month))
    .attr("fill", d => myColor(d.variance + temp.baseTemperature))
    .attr("stroke-width", 5)
    .attr("stroke", "none")
    // .attr("opacity", 0.8)
    .on("mouseover", function(d) {
      //Get this rect's x/y values, then augment for the tooltip
      let xPosition = parseFloat(d3.select(this).attr("x"));
      let yPosition = parseFloat(d3.select(this).attr("y"));

      // Update the tooltip position and value
      d3.select("#tooltip")
        .style("left", xPosition + "px")
        .style("top", yPosition + "px")
        .select("#tempYearMonth")
        .text(formatYear(d.year) + " - " + formatMonth(d.month));

      d3.select("#tooltip")
        .select("#temp")
        .text((temp.baseTemperature + d.variance).toFixed(2) + "℃");

      d3.select("#tooltip")
        .select("#variance")
        .text(d.variance.toFixed(2) + "℃");

      //Show the tooltip
      d3.select("#tooltip").classed("hidden", false);
    })
    .on("mouseout", function() {
      //Hide the tooltip
      d3.select("#tooltip").classed("hidden", true);
    });

  // draw legend
  // ----------working code---------//
  // const legend = mainG
  //   .append("g")
  //   .attr("class", "legend")
  //   .attr("transform", `translate(0,${innerHeight + 60})`)
  //   .selectAll("g")
  //   .data(temp.monthlyVariance, d => d.variance + temp.baseTemperature)
  //   .enter()
  //   .append("g");
  // ----working code end----- //

  mainG
    .append("g")
    .attr("class", "legendSequential")
    .attr("transform", `translate(0,${innerHeight + 60})`);
  // console.log(temp.monthlyVariance, d => d.variance + temp.baseTemperature);

  // draw legend colored rectangles
  //----working code--------//
  // legend.append("rect")
  // .attr("x", (d, i) => i * 21)
  // .attr("height", 20)
  // .attr("width", 20)
  // .attr("fill", (d, i) => myColor(i));
  //------working code end----------//
  const legendSequential = d3
    .legendColor()
    .shapeWidth(30)
    .cells(10)
    .orient("horizontal")
    .scale(myColor);

  mainG.select(".legendSequential").call(legendSequential);
  // draw legend text
  // legend
  //   .append("text")
  //   .attr("y", innerHeight + 70)
  //   .attr("x", (d, i) => i * 21)
  //   .text(d => d.variance + temp.baseTemperature);

  mainG
    .append("g")
    .attr("id", "x-axis")
    .call(xAxis)
    .attr("transform", `translate(0,${innerHeight})`);

  mainG
    .append("text")
    .attr("class", "xAxis-label")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + 40)
    .text("Year")
    .attr("font-size", 18);

  mainG
    .append("g")
    .attr("id", "y-axis")
    .call(yAxis);

  mainG
    .append("text")
    .attr("class", "yAxis-label")
    .attr("x", -innerHeight / 2)
    .attr("y", -50)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text("Months")
    .attr("font-size", 18);

  mainG
    .append("text")
    .attr("class", "chart-title")
    .attr("y", -50)
    .attr("x", innerHeight / 2 - 60)
    .text("Monthly Global Land-Surface Temperature")
    // .attr("font-weight", "bold")
    .attr("font-family", "arial")
    .attr("font-size", 24);

  mainG
    .append("text")
    .attr("class", "sub-title")
    .attr("y", -20)
    .attr("x", innerHeight / 2)
    .text("1753 - 2015: base temperature 8.66℃")
    // .attr("font-weight", "bold")
    .attr("font-family", "arial")
    .attr("font-size", 19);
});
