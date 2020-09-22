// set svg width and height
const width = 900,
  height = 600;
const margin = { top: 100, right: 100, bottom: 100, left: 100 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

d3.csv("./suicide_rates_1985-2016.csv")
  .then((finalData) => {
    finalData.forEach((d) => {
      d.Region = d.Region;
      d.female = parseFloat(d.female);
      d.male = parseFloat(d.male);
    });

    // set up stack method
    const stack = d3.stack().keys(["female", "male"]);
    // Data, stacked
    const series = stack(finalData);
    // console.log(series);

    // set-up scales
    const xScale = d3
      .scaleBand()
      .domain(finalData.map((d) => d.Region))
      .range([0, innerWidth])
      .padding(0.1);

    const xAxis = d3.axisBottom().scale(xScale);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(series, (d) => d3.max(d, (d) => d[1]))])
      .rangeRound([innerHeight, 0]);

    const yAxis = d3.axisLeft().scale(yScale);

    //Easy colors accessible via a 10-step ordinal scale
    // const colors = d3.scaleOrdinal(d3.schemeCategory10);
    const colors = d3
      .scaleOrdinal()
      .domain(series.map((d) => d.key))
      .range(
        d3
          .quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), series.length)
          .reverse()
      )
      .unknown("#ccc");

    //Create SVG element
    const svg = d3
      .select("body")
      .append("svg")
      .attr("viewBox", [0, 0, width, height]);
    // .attr("width", width)
    // .attr("height", height);

    const mainG = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add a group for each row of data
    const g = mainG
      .selectAll("g")
      .data(series)
      .enter()
      .append("g")
      .style("fill", (d) => colors(d.key))
      .attr("transform", `translate(0,0)`);

    // Add a rect for each data value
    g.selectAll("rect")
      .data((d) => d)
      .enter()
      .append("rect")
      .attr("x", function (d, i) {
        return xScale(d.data.Region);
      })
      .attr("y", function (d) {
        return yScale(d[1]);
      })
      .attr("height", function (d) {
        return yScale(d[0]) - yScale(d[1]);
      })
      .attr("width", xScale.bandwidth())
      .on("mouseover", function (d) {
        //Get this bar's x/y values, then augment for the tooltip
        let xPosition =
          parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() * 2;
        let yPosition = parseFloat(d3.select(this).attr("y")) + innerHeight / 2;

        // Update the tooltip position and value
        d3.select("#tooltip")
          .style("left", xPosition + "px")
          .style("top", yPosition + "px")
          .select("#region")
          .text(d.data.Region);

        d3.select("#tooltip")
          .select("#gender")
          .text(d[0] === 0 ? "Female" : "Male");

        d3.select("#tooltip")
          .select("#suicides")
          .text(d[1] - d[0]);

        //Show the tooltip
        d3.select("#tooltip").classed("hidden", false);
      })
      .on("mouseout", function () {
        //Hide the tooltip
        d3.select("#tooltip").classed("hidden", true);
      });

    // draw legend
    const legend = mainG
      .append("g")
      .attr("class", "legend")
      .attr("transform", "translate(" + (innerWidth - 110) + "," + 20 + ")")
      .selectAll("g")
      .data(series)
      .enter()
      .append("g");

    // draw legend colored rectangles
    legend
      .append("rect")
      .attr("y", (d, i) => i * 30)
      // .attr("r", 5)
      .attr("height", 10)
      .attr("width", 10)
      .attr("fill", (d) => colors(d.key));

    // draw legend text
    legend
      .append("text")
      .attr("y", (d, i) => i * 30 + 9)
      .attr("x", 5 * 3)
      .text((d) => d.key);

    mainG
      .append("g")
      .call(xAxis)
      .attr("transform", `translate(0,${innerHeight})`);

    mainG.append("g").call(yAxis);

    mainG
      .append("text")
      .attr("class", "chart-title")
      .attr("y", -40)
      .attr("x", innerHeight / 2)
      .text("Suicides by Region and Gender (1985-2016)")
      // .attr("font-weight", "bold")
      .attr("font-family", "arial")
      .attr("font-size", 24);
  })
  .catch((error) => {
    console.log(error);
  });
