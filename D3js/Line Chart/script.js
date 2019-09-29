// set svg width and height
const width = 900,
  height = 600;
const margin = { top: 100, right: 100, bottom: 100, left: 100 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Converting string to dates
const myFormat = d3.timeParse("%Y");

// Converting dates to strings
// const formatTime = d3.timeFormat("%Y-%m");
const formatYear = d3.timeFormat("%Y");
// const MonthYear = d3.timeFormat("%b-%Y"); //eg: Feb-2007

d3.csv(
  "https://raw.githubusercontent.com/learning-monk/datasets/master/suicide_rates_1985-2016-year-country.csv"
)
  .then(data => {
    console.log(data);
    data.forEach(d => {
      d.year = myFormat(d.year);
      d.Suicides = parseFloat(d.Suicides);
    });

    // List of groups

    const xScale = d3
      .scaleTime()
      .domain([d3.min(data, d => d.year), d3.max(data, d => d.year)])
      .range([0, innerWidth]);

    const xAxis = d3.axisBottom().scale(xScale);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.Suicides)])
      .range([innerHeight, 0]);

    const yAxis = d3.axisLeft().scale(yScale);

    // Define line generators
    // const line = d3
    //   .line()
    //   .defined(d => !isNaN(d.suicides))
    //   .x(d => xScale(d.year))
    //   .y(d => yScale(d.suicides));

    const line = d3
      .line()
      .defined(d => !isNaN(d.female))
      .x(d => xScale(d.year))
      .y(d => yScale(d.female + d.male));
    // .y(d => yScale(d.male));

    // const line_male = d3
    //   .line()
    //   .defined(d => !isNaN(d.male))
    //   .x(d => xScale(d.year))
    //   .y(d => yScale(d.male));

    const svg = d3
      .select("body")
      .append("svg")
      .attr("viewBox", [0, 0, width, height]);

    const mainG = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const g = mainG
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", `translate(0,0)`);

    // line code goes here
    g.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("shape-rendering", "crispEdges")
      .attr("d", line);

    // g.append("path")
    //   .datum(data)
    //   .attr("class", "line_male")
    //   .attr("fill", "none")
    //   .attr("stroke", "red")
    //   .attr("stroke-width", 2)
    //   .attr("stroke-linejoin", "round")
    //   .attr("stroke-linecap", "round")
    //   .attr("shape-rendering", "crispEdges")
    //   .attr("d", line_male);

    // draw legend
    const legend = mainG
      .append("g")
      .attr("class", "legend")
      .attr("transform", "translate(" + (innerWidth - 110) + "," + 20 + ")")
      .selectAll("g")
      .data(data)
      .enter()
      .append("g");

    // draw legend colored rectangles
    // legend
    //   .append("rect")
    //   .attr("y", (d, i) => i * 30)
    //   // .attr("r", 5)
    //   .attr("height", 10)
    //   .attr("width", 10)
    //   .attr("fill", d => color(d.key));

    // draw legend text
    // legend
    //   .append("text")
    //   .attr("y", (d, i) => i * 30 + 9)
    //   .attr("x", 5 * 3)
    //   .text(d => d.key);

    // add x-axis to chart
    mainG
      .append("g")
      .call(xAxis)
      .attr("transform", `translate(0,${innerHeight})`);

    // add y-axis to chart
    mainG.append("g").call(yAxis);

    // add chart title
    mainG
      .append("text")
      .attr("class", "chart-title")
      .attr("y", -40)
      .attr("x", innerHeight / 2)
      .text("Suicides over Year by Gender (1985-2016)")
      // .attr("font-weight", "bold")
      .attr("font-family", "arial")
      .attr("font-size", 24);
  })
  .catch(error => {
    console.log(error);
  });
