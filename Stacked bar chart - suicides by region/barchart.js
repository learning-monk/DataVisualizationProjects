const width = 960,
  height = 500;

d3.csv("suicide_rates_1985-2016.csv").then(data => {
  // console.log(data);

  const region = [];
  const female_suicides = [];
  const male_suicides = [];
  const suicides = [];

  data.map(d => {
    region.push(d.Region);
    female_suicides.push(+d.female);
    male_suicides.push(+d.male);
    suicides.push(+d.suicides);
  });

  // console.log(region);
  const margin = { top: 100, right: 100, bottom: 100, left: 120 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const barPadding = 2;

  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const xScale = d3
    .scaleBand()
    .domain(region.map(d => d))
    .rangeRound([0, innerWidth]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(suicides, d => d)])
    .range([innerHeight, 0]);

  const mainG = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const g = mainG
    .selectAll("g")
    .data(suicides)
    .enter()
    .append("g")
    .attr("transform", `translate(0,0)`);

  g.append("rect")
    .attr("x", (d, i) => (i * innerWidth) / suicides.length)
    .attr("y", d => yScale(d))
    .attr("width", innerWidth / suicides.length - barPadding)
    .attr("height", d => innerHeight - yScale(d))
    .attr("fill", "green");

  mainG.append("g").call(d3.axisLeft(yScale));
  mainG
    .append("g")
    .call(d3.axisBottom(xScale))
    .attr("transform", `translate(0, ${innerHeight})`);
});
