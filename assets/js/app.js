// Define SVG dimensions
var svgWidth = 1024;
var svgHeight = 800;

// Margin for chart within SVG element
var margin = {
  top: 25,
  right: 5,
  bottom: 5,
  left: 25
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("class", "chart");

var chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(data) {

    // Parse required data, creating right data types   
    data.forEach(function(data) {
      data.poverty = +data.poverty; // int
      data.smokes = +data.smokes; // int
    });

    return data 
    }).then(function(data){

    //Create linear scale functions using existing ranges of values    
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.poverty) - 1, d3.max(data, d => d.poverty) + 2])
      .range([0, width]);
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.smokes) - 1, d3.max(data, d => d.smokes) + 2])
      .range([height, 0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Create X and Y Axis
    // Need to move bottom axis up as it's invisble otherwise
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height - margin.bottom * 5})`)
    .call(bottomAxis);

    chartGroup.append("g")
    .call(leftAxis);

    // Create labes for axes
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 10)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Smokers (%)");

    chartGroup.append("text")
      .attr("x", width / 2)
      .attr("y", height - margin.top * 2)
      .attr("class", "axisText")
      .text("In Poverty (%)");

    // Create Circles by selecting empty elements and just appending.
    var circlesGroup = chartGroup.selectAll(null)
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("r", "20")
        .attr("fill", "blue")
        .attr("opacity", ".5")
});
    