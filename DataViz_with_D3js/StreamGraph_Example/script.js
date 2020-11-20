// Set width and height of the SVG where you draw your chart
const w = 1000;
const h = 500;

// Set margins and dimensions of the chart
const margin = {top:50, left:100, bottom:50, right:100};
const innerWidth = w - margin.left - margin.right;
const innerHeight = h - margin.top - margin.bottom;

// Create SVG element and append it to the DIV element we created in index.html
const svg = d3.select("#myChart")
    .append("svg")
      .attr("viewBox", [0,0,w,h]);

const mainG = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load and parse data
d3.csv("./5_OneCatSevNumOrdered_wide.csv").then((data, error) => {
  if (error) throw error;
  // console.log(data);

  // Separate the groups of names
  const keys = data.columns.slice(1);
  // console.log(keys);

  // Create X-axis
  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0,innerWidth]);

  const xAxis = d3.axisBottom().scale(xScale);
  
  // Create Y-axis
  const yScale = d3.scaleLinear()
    .domain([-100000, 100000])
    .range([innerHeight,0]);

  const yAxis = d3.axisLeft().scale(yScale);

  // Add xAxis
  mainG.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(xAxis.tickSize(-innerHeight).tickValues([1900, 1925, 1975, 2000]).tickFormat(d3.format("d")))
    .select(".domain").remove();
  
  mainG.selectAll(".tick line").attr("stroke", "#b8b8b8");

  // Create xAxis label
  mainG.append("text")
    .attr("text-anchor", "end")
    .attr("x", innerWidth-30)
    .attr("y", innerHeight+30)
    .text("Time (Year)");
  
  // Add yAxis
  mainG.append("g")
    .call(yAxis);

  // Color Palette
  const color = d3.scaleOrdinal()
    .domain(keys)
    .range(d3.schemeDark2);

  // stack data
  const stack = d3.stack()
    .offset(d3.stackOffsetSilhouette)
    .keys(keys);
    

  const stackedData = stack(data);
    
  // console.log(stackedData);  


  // Create a tooltip
  const Tooltip = mainG
    .append("text")
    .attr("x", 10)
    .attr("y", 0)
    .style("opacity", 0)
    .style("font-size", 17);

  // Tooltip change based on user behaviour hover/move/leave a cell
  const mouseover = function(d) {
    Tooltip.style("opacity", 1)
    d3.selectAll(".myArea").style("opacity", .2)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }

  const mousemove = function(d,i) {
    const grp = i.key;
    Tooltip.text(grp);
    // console.log(grp);
  }

  const mouseleave = function(d) {
    Tooltip.style("opacity", 0)
    d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none")
  }

  // Area Generator
  const area = d3.area()
    .x(d => xScale(d.data.year))
    .y0(d => yScale(d[0]))
    .y1(d => yScale(d[1]));

  // const series = mainG
  //   .selectAll("g.series")
  //   .data(stackedData)
  //   .enter()
  //   .append("g")
  //   .attr("class", "series");

  // series.append("path")
  //   .style("fill", d => color(d.key))
  //   .attr("d", d => area(d));

  // Show the areas
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