const w = 900;
const h = 600;

// Define Map projection
// const projection = d3
//   .geoAlbersUsa()
//   .translate([w / 2, h / 2])
//   .scale(500);

// Define Path generator
const path = d3.geoPath();

// Define quantize scale to bucket values
const colorScale = d3
  .scaleQuantize()
  .range([
    "rgb(237,248,233)",
    "rgb(186,228,179)",
    "rgb(116,196,118)",
    "rgb(49,163,84)",
    "rgb(0,109,44)",
  ]);

// Create an SVG element
const svg = d3.select("body").append("svg").attr("width", w).attr("height", h);

d3.json("./us_counties.json").then((usCounties) => {
  // const counties = new Map(
  //   usCounties.objects.counties.geometries.map((d) => [d.id, d.arcs])
  // );
  const usTopo = topojson.feature(usCounties, usCounties.objects.counties)
    .features;
  console.log(usTopo.length);
  d3.json("./education.json").then((data) => {
    colorScale.domain([
      d3.min(data, (d) => d.bachelorsOrHigher),
      d3.max(data, (d) => d.bachelorsOrHigher),
    ]);

    for (let i = 0; i < data.length; i++) {
      for (
        let j = 0;
        j <
        topojson.feature(usCounties, usCounties.objects.counties).features
          .length;
        j++
      ) {
        if (
          topojson.feature(usCounties, usCounties.objects.counties).features[j]
            .id == data[i].fips
        ) {
          topojson.feature(usCounties, usCounties.objects.counties).features[
            j
          ].eduValue = data[i].bachelorsOrHigher;
          break;
        }
      }
    }
    // console.log(
    //   topojson.feature(usCounties, usCounties.objects.counties).features
    // );
    svg
      // .append("g")
      .selectAll("path")
      .data(topojson.feature(usCounties, usCounties.objects.counties).features);
    // .join("path")
    // .attr("fill", (d) => colorScale(data.get(d.fips)))
    // .attr("d", path);
    // console.log(
    //   topojson.feature(usCounties, usCounties.objects.counties).features
    // );
    // svg
    //   .append("path")
    //   .datum(
    //     topojson.mesh(
    //       usCounties,
    //       usCounties.objects.counties,
    //       (a, b) => a !== b
    //     )
    //   )
    //   .attr("fill", "none")
    //   .attr("stroke", "white")
    //   .attr("stroke-linejoin", "round")
    //   .attr("d", path);
  });
});
