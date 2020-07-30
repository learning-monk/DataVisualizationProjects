const margin = { top: 100, right: 30, bottom: 100, left: 30 };
const width = 1200 + margin.left + margin.right;
const height = 1000 + margin.top + margin.bottom;

// Append svg object to the body of the page
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const colorScale = d3
  .scaleOrdinal()
  .range([
    "#e41a1c",
    "#377eb8",
    "#4daf4a",
    "#984ea3",
    "#ff7f00",
    "#cccc28",
    "#a65628",
  ]);

function wrap(text, width) {
  text.each(function () {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1, // ems
      x = text.attr("x"),
      y = text.attr("y"),
      dy = 0, //parseFloat(text.attr("dy")),
      tspan = text
        .text(null)
        .append("tspan")
        .attr("x", x)
        .attr("y", y)
        .attr("dy", dy + "em");
    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
          .append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word);
      }
    }
  });
}
// Read json data
d3.json(
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"
).then((data) => {
  // Compute the size of each leave
  const root = d3.hierarchy(data).sum((d) => d.value);

  // The d3.treemap computes the position of each element of the hierarchy
  d3
    .treemap()
    .size([width - 100, height - 100])
    .padding(2)(root);

  // Add rectangles
  svg
    .selectAll("rect")
    .attr("class", "tile")
    .data(root.leaves())
    .enter()
    .append("rect")
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("stroke", "black")
    .attr("fill", (d) => colorScale(d.parent.data.name))
    .append("title")
    .text(
      (d) =>
        "Name: " +
        d.data.name +
        " \n" +
        "Category: " +
        d.data.category +
        " \n" +
        "Value: " +
        (d.data.value / 1000000).toFixed(1) +
        "M"
    );

  // Add text labels
  svg
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
    .attr("x", (d) => d.x0 + 2)
    .attr("y", (d) => d.y0 + 30)
    // .attr("transform", `translate(5,10)`)
    .text((d) => d.data.name)
    .attr("font-size", "10px")
    .attr("fill", "white")
    .call(wrap, 70);

  // Add title for the groups
  svg
    .selectAll("titles")
    .data(root.descendants().filter((d) => d.depth == 1))
    .enter()
    .append("text")
    .attr("x", (d) => d.x0 + 2)
    .attr("y", (d) => d.y0 + 20)
    .text((d) => d.data.name)
    .attr("font-size", 17);

  // Add legend
  const legend = svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(1000, 100)`)
    .selectAll("g")
    .data([
      "Action",
      "Drama",
      "Adventure",
      "Family",
      "Animation",
      "Comedy",
      "Biography",
    ])
    .append("g");

  // Draw legend colored rectangles
  // legend
  //   .append("rect")
  //   .attr("y", (d, i) => i * 30)
  //   .attr("width", 10)
  //   .attr("height", 10);

  // Add chart title
  svg
    .append("text")
    .attr("class", "chart-title")
    .attr("y", -50)
    .attr("x", height / 2 - 50)
    .text("Movie Sales")
    .attr("font-weight", "bold")
    .attr("font-family", "calibri")
    .attr("font-size", 34);
});
