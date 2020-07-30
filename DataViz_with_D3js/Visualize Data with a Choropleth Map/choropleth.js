const w = 1200;
const h = 800;

// Define Path generator
const path = d3.geoPath();

const colorScale = d3
  .scaleQuantize()
  .range(["#dcf1d9", "#bae4b3", "#74c476", "#31a354", "#006d2c"]);

d3.json("./us_counties.json").then((usCounties) => {
  const usTopo = topojson.feature(usCounties, usCounties.objects.counties)
    .features;
  // console.log(usCounties);

  d3.json("./education.json").then((data) => {
    colorScale.domain([
      d3.min(data, (d) => d.bachelorsOrHigher),
      d3.max(data, (d) => d.bachelorsOrHigher),
    ]);

    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < usTopo.length; j++) {
        if (usTopo[j].id == data[i].fips) {
          usTopo[j].eduValue = data[i].bachelorsOrHigher;
          usTopo[j].state = data[i].state;
          usTopo[j].county = data[i].area_name;
          break;
        }
      }
    }
    const svg = d3
      .select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", h);
    // console.log(usTopo);
    svg
      .append("g")
      .attr("class", "legendSequential")
      .attr("transform", "translate(1000,100)");

    const legendSequential = d3
      .legendColor()
      // .labelFormat(d3.format(".0%"))
      .shapeWidth(30)
      .title("education%")
      // .orient("horizontal")
      .scale(colorScale);

    svg.select(".legendSequential").call(legendSequential);

    svg
      .append("g")
      .selectAll("path")
      .data(usTopo)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("transform", "translate(20,100)")
      .attr("class", "county")
      .style("fill", (d) => {
        // colorScale(d.eduValue);
        // Get data value
        const value = d.eduValue;
        if (value) {
          return colorScale(value);
        } else {
          return "#ccc";
        }
      })
      .append("title")
      .text(
        (d) => d.county + ", " + d.state + ": " + d.eduValue.toFixed(1) + "%"
      );

    svg
      .append("path")
      .datum(
        topojson.mesh(usCounties, usCounties.objects.states, (a, b) => a !== b)
      )
      .attr("fill", "none")
      .attr("stroke", "gray")
      .attr("stroke-linejoin", "round")
      .attr("d", path)
      .attr("transform", "translate(20,100)");

    svg
      .append("text")
      .attr("class", "chart-title")
      .attr("y", 30)
      .attr("x", h / 2)
      .text("United States Educational Attainment")
      .attr("font-weight", "bold")
      .attr("font-family", "arial")
      .attr("font-size", 24);

    svg
      .append("text")
      .attr("class", "sub-title")
      .attr("y", 60)
      .attr("x", h / 2 - 50)
      .text(
        "Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)"
      )
      // .attr("font-weight", "bold")
      .attr("font-family", "arial")
      .attr("font-size", 15);
  });
});
