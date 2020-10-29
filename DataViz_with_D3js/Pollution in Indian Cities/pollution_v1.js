const width = 1000,
  height = 500;

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



d3.csv("https://raw.githubusercontent.com/learning-monk/datasets/master/ENVIRONMENT/Indian_cities_daily_pollution_2015-2020.csv").then((data, error) => {
  if (error) throw error;
  

  // Format data
  data.forEach(d => {
    d.City = d.City;
    d.Date = myFormat(d.Date);
    d["PM2.5"] = +d["PM2.5"];
    d.PM10 = +d.PM10;
    d.NOx = +d.NOx;
    d.NH3 = +d.NH3;
    d.CO = +d.CO;
    d.SO2 = +d.SO2;
    d.O3 = +d.O3;
    d.Benzene = +d.Benzene;
    d.Toluene = +d.Toluene;
    d.Xylene = +d.Xylene;
  })
  // console.log(data);

  const nestedData = d3.nest()
  .key(d => d.City)
  .entries(data);

  // console.log(nestedData[0].values);

  // Append dropdown and label to this DIV
  const mySelection  = document.getElementById("selectCity");

  d3.select(mySelection).append("span").append("p").attr("id","label").text("Select City from the dropdown below: ");

  // Create a drop down
  d3.select(mySelection)
  .append("span")
  .append("select")
  .attr("id", "selection")
  .attr("name", "cities")
  .selectAll("option")
  .data(nestedData)
  .enter()
  .append("option")
  .attr("value", d => d.key)
  .text(d => d.key);

  d3.select(mySelection).append("hr");

  // Filter city to show line chart
  d3.select("#selection").on("change", function() {
    const selectedCity = d3.select(this).node().value;

    // console.log(nestedData);

    // Append SVG to this DIV
    const chartDIV = document.createElement("div");

    // color scale
    const category = ["PM2.5", "PM10", "NOx", "NH3", "CO", "SO2", "O3", "Benzene", "Toluene", "Xylene"];
    const colors = d3.scaleOrdinal(d3.schemeCategory10)
    .domain(category);
    // .range(["#ffff00","#ff4c4c"]);

    // Set up XScale and yScale
    const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.Date))
    .range([0, innerWidth])
    .nice();

    const yScale = d3.scaleLinear()
    .domain([d3.min(data, d => Math.min(d["PM2.5"], d.PM10)), d3.max(data, d => Math.max(d["PM2.5"], d.PM10))])
    .rangeRound([innerHeight, 0]);
    
    // Create Lines
    const PM2point5Line = d3.line()
    .x(d => xScale(d.Date))
    .y(d => yScale(d["PM2.5"]));

    const PM10Line = d3.line()
    .x(d => xScale(d.Date))
    .y(d => yScale(d.PM10));

    const NOxLine = d3.line()
    .x(d => xScale(d.Date))
    .y(d => yScale(d.NOx));

    const NH3Line = d3.line()
    .x(d => xScale(d.Date))
    .y(d => yScale(d.NH3));

    const COLine = d3.line()
    .x(d => xScale(d.Date))
    .y(d => yScale(d.CO));

    const SO2Line = d3.line()
    .x(d => xScale(d.Date))
    .y(d => yScale(d.SO2));

    const O3Line = d3.line()
    .x(d => xScale(d.Date))
    .y(d => yScale(d.O3));

    const BenzeneLine = d3.line()
    .x(d => xScale(d.Date))
    .y(d => yScale(d.Benzene));

    const TolueneLine = d3.line()
    .x(d => xScale(d.Date))
    .y(d => yScale(d.Toluene));

    const XyleneLine = d3.line()
    .x(d => xScale(d.Date))
    .y(d => yScale(d.Xylene));

    // Append an SVG element to div
    const svg = d3.select(chartDIV)
    .append("svg")
    .attr("width", width)
    .attr("height", height);


    const mainG = svg
      .append("g")
      .attr("transform", `translate(${margin["left"]}, ${margin["top"]})`);

    // Create axes
    mainG
    .append("g")
    .attr("id", "xAxis")
    .call(d3.axisBottom(xScale))
    .attr("transform", `translate(0, ${innerHeight})`);


    mainG
    .append("g")
    .attr("id", "yAxis")
    .call(d3.axisLeft(yScale));

    // Draw graph
    const myGraph = function() {

      // Filter data based on city selection
      const filteredData = data.filter(d => d.City == selectedCity);

      // console.log(nestedData[selectedCity]);

      // Append path and bind data
      mainG
      .append("path")
      .datum(filteredData, d => d["PM2.5"])
      .style("fill", "none")
      .attr("class", "line")
      .attr("id", "PM2point5")
      .attr("stroke", colors(0))
      .attr("stroke-width", "2.5")
      .attr("d", PM2point5Line);

      mainG
      .append("path")
      .datum(filteredData, d => d.PM10)
      .style("fill", "none")
      .attr("class", "line")
      .attr("id", "PM10")
      .attr("stroke", colors(1))
      .attr("stroke-width", "2.5")
      .attr("d", PM10Line);

      mainG
      .append("path")
      .datum(filteredData, d => d.NOx)
      .style("fill", "none")
      .attr("class", "line")
      .attr("id", "NOx")
      .attr("stroke", colors(2))
      .attr("stroke-width", "2.5")
      .attr("d", NOxLine);

      mainG
      .append("path")
      .datum(filteredData, d => d.NH3)
      .style("fill", "none")
      .attr("class", "line")
      .attr("id", "NH3")
      .attr("stroke", colors(3))
      .attr("stroke-width", "2.5")
      .attr("d", NH3Line);

      mainG
      .append("path")
      .datum(filteredData, d => d.CO)
      .style("fill", "none")
      .attr("class", "line")
      .attr("id", "CO")
      .attr("stroke", colors(4))
      .attr("stroke-width", "2.5")
      .attr("d", COLine);

      mainG
      .append("path")
      .datum(filteredData, d => d.SO2)
      .style("fill", "none")
      .attr("class", "line")
      .attr("id", "SO2")
      .attr("stroke", colors(5))
      .attr("stroke-width", "2.5")
      .attr("d", SO2Line);

      mainG
      .append("path")
      .datum(filteredData, d => d.O3)
      .style("fill", "none")
      .attr("class", "line")
      .attr("id", "O3")
      .attr("stroke", colors(6))
      .attr("stroke-width", "2.5")
      .attr("d", O3Line);

      mainG
      .append("path")
      .datum(filteredData, d => d.Benzene)
      .style("fill", "none")
      .attr("class", "line")
      .attr("id", "Benzene")
      .attr("stroke", colors(7))
      .attr("stroke-width", "2.5")
      .attr("d", BenzeneLine);

      mainG
      .append("path")
      .datum(filteredData, d => d.Toluene)
      .style("fill", "none")
      .attr("class", "line")
      .attr("id", "Toluene")
      .attr("stroke", colors(8))
      .attr("stroke-width", "2.5")
      .attr("d", TolueneLine);

      mainG
      .append("path")
      .datum(filteredData, d => d.Xylene)
      .style("fill", "none")
      .attr("class", "line")
      .attr("id", "Xylene")
      .attr("stroke", colors(9))
      .attr("stroke-width", "2.5")
      .attr("d", XyleneLine);

      mainG
      .append("text")
      .attr("class", "chartTitle")
      .attr("y", -50)
      .attr("x", height/2-50)
      .text(`Air quality of ${selectedCity}`)
      .attr("font-weight", "bold")
      .attr("font-family", "sans-serif")
      .attr("font-size", 21);

      // draw legend
      const legend = mainG
      .append("g")
      .attr("class", "legend")
      .attr("transform", "translate(" + (innerWidth) + "," + 0 + ")")
      .selectAll("g")
      .data(category)
      .enter()
      .append("g");

      // draw legend colored rectangles
      legend
      .append("rect")
      .attr("y", (d, i) => i * 30)
      .attr("height", 10)
      .attr("width", 10)
      .attr("fill", (d) => colors(d));

      // draw legend text
      legend
      .append("text")
      .attr("y", (d, i) => i * 30 + 9)
      .attr("x", 15)
      .text((d) => d);      
      
      const showChart = document.getElementById("chartContainer");
      while(showChart.firstChild) {
        showChart.firstChild.remove();
      }
      showChart.appendChild(chartDIV);
    }
    myGraph();

  })

  




});
