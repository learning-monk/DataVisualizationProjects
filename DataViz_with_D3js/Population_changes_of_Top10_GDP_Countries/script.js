// Set width and height of the SVG
const w = 1000;
const h = 500;

// Set margins of the chart
const margins = { top: 50, left: 100, bottom: 50, right: 100};
const innerWidth = w - margins.left - margins.right;
const innerHeight = h - margins.top - margins.bottom;

top_10 = ["United States", "China", "Japan", "Germany", "India", "United Kingdom", "France", "Italy", "Brazil", "Canada"];

const svg = d3.select("#myChart")
  .append("svg")
    .attr("viewBox", [0,0,w,h]);

const mainG = svg
  .append("g")
  .attr("transform", `translate(${margins.left}, ${margins.top})`);

// Load and Parse data
d3.csv("./population_total_long.csv").then((long_data, error) => {
  if (error) throw error;

  // Filter top 10 countries data from the entire dataset
  const filtered_data = long_data.filter((d,i) => top_10.indexOf(d.CountryName) >= 0);

  // Parse data - Convert population count to an integer
  filtered_data.forEach(d => {
    d.CountryName = d.CountryName,
    d.Year = d.Year,
    d.Count = +d.Count
  });

  
  // const wide_data = d3.nest()
  //   .key(d => d.CountryName)
  //   .rollup(function(d) {
  //     return d.reduce(function(prev, curr) {
  //       prev["CountryName"] = curr["CountryName"];
  //       prev[curr["Year"]] = curr["Count"];
  //       return prev;
  //     }, {});
  //   })
  //   .entries(filtered_data)
  //   .map(d => d.value);

  // Convert data from LONG format to WIDE format
  const wide_data = d3.nest()
  .key(d => d.Year)
  .rollup(function(d) {
    return d.reduce(function(prev, curr) {
      prev["Year"] = curr["Year"];
      prev[curr["CountryName"]] = curr["Count"];
      return prev;
    }, {});
  })
  .entries(filtered_data)
  .map(d => d.value);
  
  // console.log(wide_data);

  // Extract keys
  const keys = d3.keys(wide_data[0]).slice(1,11);
  // console.log(keys);

  // Create X-axis
  const xScale = d3.scaleLinear()
    .domain(d3.extent(wide_data, d => d.Year))
    .range([0, innerWidth]);

  const xAxis = d3.axisBottom().scale(xScale);

  // Create Y-axis
  const yScale = d3.scaleLinear()
    .rangeRound([innerHeight, 0]);

  const yAxis = d3.axisLeft().scale(yScale);


  mainG.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(xAxis.tickSize(-innerHeight).tickValues([1960,1970,1980,1990,2000,2010,2017]).tickFormat(d3.format("d")));
    
  mainG.selectAll(".tick line").attr("stroke", "b8b8b8");

  mainG.append("g")
    .call(yAxis);

  // Create xAxis label
  mainG.append("text")
    .attr("text-anchor", "end")
    .attr("x", innerWidth-30)
    .attr("y", innerHeight+30)
    .text("Time (in years)");

  // color pallette
  const color = d3.scaleOrdinal()
    .domain(keys)
    .range(d3.schemeDark2);

  // Stack data
  const stack = d3.stack()
    .offset(d3.stackOffsetSilhouette)
    .keys(keys);

  const stackedData = stack(wide_data);

  
  // console.log(stackedData);

  // Set-up yScale domain after stacking data
  yScale.domain([-d3.max(stackedData[stackedData.length-1], d => d[1]), d3.max(stackedData[stackedData.length-1], d => d[1])]);

  // Create a tooltip
  const tooltip = mainG.append("text")
    .attr("x", 10)
    .attr("y", 0)
    .attr("opacity", 0)
    .attr("font-size", 17);

  // Tooltip visibility based on user behaviour hover/move/leave a cell
  const mouseover = function(d) {
    tooltip.style("opacity", 1)
    d3.selectAll(".myArea").style("opacity", .2)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }

  const mousemove = function(d,i) {
    const grp = d.key;
    tooltip.text(grp);
    // console.log(grp);
  }

  const mouseleave = function(d) {
    tooltip.style("opacity", 0)
    d3.selectAll(".myArea").style("opacity",1).style("stroke", "none")
  }

  // Area Generator
  const area = d3.area()
    .x(d => xScale(d.data.Year))
    .y0(d => yScale(d[0]))
    .y1(d => yScale(d[1]));

  // Show areas
  mainG
    .selectAll("mylayers")
    .data(stackedData)
    .enter()
    .append("path")
      .attr("class", "myArea")
      .style("fill", d => color(d.key))
      .attr("d", area)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);

})