const width = 1200,
  height = 1000;

// const margin = { top: 100, right: 100, bottom: 100, left: 100 };
// const innerWidth = width - margin.left - margin.right;
// const innerHeight = height - margin.top - margin.bottom;

// Define Map projection
// const projection = d3
//   .geoAlbersUsa()
//   .translate([width / 2, height / 2])
//   .scale([1000]);

// Define Path Generator
// const path = d3.geoPath().projection(projection);
const path = d3.geoPath();

// Define Quantize scale to sort data values into buckets of color (derived from color brewer)
const colorScale = d3
  .scaleQuantize()
  .range([
    "#E5F5E0",
    "#C7E9C0",
    "#A1D99B",
    "#74C476",
    "#41AB5D",
    "#238B45",
    "#006D2C",
    "#00441B",
  ]);

// Load education data
d3.json("./education.json").then((data) => {
  // Set input domain for color scale
  colorScale.domain([
    d3.min(data, (d) => d.bachelorsOrHigher),
    d3.max(data, (d) => d.bachelorsOrHigher),
  ]);
  // console.log(color.domain());
  // Load GeoJSON data
  d3.json("./us_counties.json").then((json) => {
    // console.log(json.objects.counties.geometries[3].id);
    // Merge education data with GeoJSON
    // Loop through one for each data value
    for (let i = 0; i < data.length; i++) {
      // Grab the state name
      const dataFips = data[i].fips;

      // Grab data value and convert fron string to float
      const dataValue = parseFloat(data[i].bachelorsOrHigher);
      // Find the corresponding state inside GeoJSON
      for (let j = 0; j < json.objects.counties.geometries.length; j++) {
        const jsonId = json.objects.counties.geometries[j].id;
        if (dataFips == jsonId) {
          // copy the data value into json
          json.objects.counties.geometries[j].eduValue = dataValue;
          // Stop looking through json
          break;
        }
      }
    }
    // console.log(json.objects.counties.geometries);

    // Create SVG element
    const svg = d3
      .select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Bind data and create one path per TOPOjson feature
    svg
      .selectAll("path")
      // .data(json.objects.counties.geometries)
      .data(topojson.feature(json, json.objects.counties).features)
      .enter()
      .append("path")
      .attr("d", path)
      // .attr("transform", `scale(0.82,0.62)`)
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
      });
  });
});
