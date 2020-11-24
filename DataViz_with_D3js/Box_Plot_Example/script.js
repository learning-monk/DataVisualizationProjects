// Set Chart dimensions
const w = 1000;
const h = 500;

const margins = { top: 50, left: 50, right: 50, bottom: 50 };

const innerWidth = w - margins.left - margins.right;
const innerHeight = h - margins.top - margins.bottom;


// Read and Parse data
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv").then((data, error) => {
  if (error) throw error;
  // console.log(data);
  data.forEach(d => {
    d.Sepal_Length = +d.Sepal_Length;
    d.Sepal_Width = +d.Sepal_Width;
    d.Petal_Length = +d.Petal_Length;
    d.Petal_Width = +d.Petal_Width;
    d.Species = d.Species;
  });


  // Create a dropdown selection
  const mySelection = document.getElementById("selectMe");

  d3.select(mySelection).append("span").append("p").attr("class", "label").text("Select an attribute to analyze:").style("font-weight", "bold").style("font-size", "21px");

  const selectItems = ["---SELECT---","Sepal_Length", "Sepal_Width", "Petal_Length", "Petal_Width"];
  
  // Create a dropdown
  d3.select(mySelection)
    .append("span")
    .append("select")
    .attr("id", "selection")
    .attr("name", "attributes")
    .style("font-size", "18px")
    .selectAll("option")
    .data(selectItems)
    .enter()
    .append("option")
    .attr("value", d => d)
    .text(d => d);

  
  // Chart changes based on drop down selection
  d3.select("#selection").on("change", function() {
    const selectedOption = d3.select(this).node().value;
    // console.log(selectedOption);
    // This if condition ensures that the chart is not drawn when ---SELECT--- option is selected from drop down
    if (selectedOption === "---SELECT---") {
      d3.select("svg").remove();
    } else {    
      // Compute Quartiles, median, inter-quartile range, min and max from the data
      const stats = d3.nest()
      .key(d => d.Species)
      .rollup(function(d) {
        const q1 = d3.quantile(d.map(g => g[selectedOption]).sort(d3.ascending), .25)
        const median = d3.quantile(d.map(g => g[selectedOption]).sort(d3.ascending), .5)
        const q3 = d3.quantile(d.map(g => g[selectedOption]).sort(d3.ascending), .75)
        const interQuantileRange = q3 - q1
        const min = q1 - 1.5 * interQuantileRange
        const max = q3 + 1.5 * interQuantileRange
        return ({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
      })
      .entries(data);
      
      // console.log(stats);
      
      const chartDIV = document.createElement("div");
      
      // Draw xScale
      const xScale = d3.scaleBand()
      .range([0, innerWidth])
      .domain(["setosa", "versicolor", "virginica"])
      .paddingInner(1)
      .paddingOuter(.5);

      // Create xAxis  
      const xAxis = d3.axisBottom().scale(xScale);

      // Draw yScale
      const yScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[selectedOption])-0.5, d3.max(data, d => d[selectedOption])+0.5])
        .rangeRound([innerHeight,0]);

      // Create yAxis
      const yAxis = d3.axisLeft().scale(yScale);

      // Append SVG object to the DIV element
      const svg = d3.select(chartDIV)
        .append("svg")
        .attr("viewBox", [0,0,w,h]);


      const mainG = svg.append("g")
      .attr("transform", `translate(${margins.left}, ${margins.top})`);

      mainG.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(xAxis);

      mainG.append("g")
        .call(yAxis);

      // Show the main vertical line
      mainG
        .selectAll("vertLines")
        .data(stats)
        .enter()
        .append("line")
          .attr("x1", d => xScale(d.key))
          .attr("x2", d => xScale(d.key))
          .attr("y1", d => yScale(d.value.min))
          .attr("y2", d => yScale(d.value.max))
          .attr("stroke", "black")
          .style("width", 40);

      // Rectangle for the main box
      const boxWidth = 150;
      mainG
        .selectAll("boxes")
        .data(stats)
        .enter()
        .append("rect")
          .attr("x", d => xScale(d.key) - boxWidth/2)
          .attr("y", d => yScale(d.value.q3))
          .attr("height", d => yScale(d.value.q1)-yScale(d.value.q3))
          .attr("width", boxWidth)
          .attr("stroke", "black")
          .attr("fill", "yellow");

      // Show median in the box
      mainG
        .selectAll("medianLines")
        .data(stats)
        .enter()
        .append("line")
          .attr("x1", d => xScale(d.key)-boxWidth/2)
          .attr("x2", d => xScale(d.key)+boxWidth/2)
          .attr("y1", d => yScale(d.value.median))
          .attr("y2", d => yScale(d.value.median))
          .attr("stroke", "black")
          .attr("width", 80);
          
      // Add individual jitter points
      const jitterWidth = 50;
      mainG
        .selectAll("points")
        .data(data)
        .enter()
        .append("circle")
          .attr("cx", d => xScale(d.Species) - jitterWidth/2 + Math.random()*jitterWidth)
          .attr("cy", d => yScale(d[selectedOption]))
          .attr("r", 4)
          .style("fill", "red")
          .attr("stroke", "white");



      // Redraw chart
      const showChart = document.getElementById("chartContainer");
      while(showChart.firstChild) {
        showChart.firstChild.remove();
      }
      showChart.appendChild(chartDIV);    

    }  
  })
});