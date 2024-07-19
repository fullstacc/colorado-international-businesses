// Function to draw bar graph
function drawBarGraph(width, height, marginLeft, marginRight, marginTop, marginBottom, data) {
  // override width and height
  width = 600; 
  height = 400; 
  console.log("called drawBarGraph with data: ", data);

  const graphWidth = width - marginLeft - marginRight;
  const graphHeight = height - marginTop - marginBottom;

  // clear previous SVG 
  d3.select("#chart-container").select("svg").remove();

  // canvas
  var svg = d3.select("#chart-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

  // x axis
  var x = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => d.count)])
    .range([0, graphWidth]);

  svg.append('g')
    .attr('transform', 'translate(0,' + graphHeight + ')')
    .call(d3.axisBottom(x))
    .selectAll('text')
    .attr('transform', 'translate(-10,0)rotate(-45)')
    .style('text-anchor', 'end')
    .style('font-family', 'sans-serif')
    .style('font-size', '12px');

  // x axis label
  svg.append("text")
    .attr("transform", "translate(" + (graphWidth / 2) + " ," + (graphHeight + marginBottom / 1.5) + ")")
    .style("text-anchor", "middle")
    .style('font-family', 'sans-serif')
    .style('font-size', '12px')
    .text("Top 10 Business Entity Counts, by Country (as of July 2024)");

  // y axis
  var y = d3.scaleBand()
    .range([0, graphHeight])
    .domain(data.map((d) => d.name))
    .padding(0.1);

  svg.append('g')
    .call(d3.axisLeft(y))
    .selectAll('text')
    .style('font-family', 'sans-serif')
    .style('font-size', '12px');

  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("opacity", 0);
  
  // bars
  svg.selectAll('myRect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', x(0))
    .attr('y', (d) => y(d.name))
    .attr('width', (d) => x(d.count))
    .attr('height', y.bandwidth())
    .attr('fill', '#002868')
    .on("mouseover", (event, d) => {
      tooltip.transition()
        .duration(200)
        .style("opacity", .9);
      tooltip.html("Count: " + d.count)
        .style("left", (event.pageX + 5) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", () => {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    });
    

 // annotation
svg.append('text') 
  .attr('x', graphWidth / 2) 
  .attr('y', -10) 
  .style('fill', 'red') 
  .style('font-family', 'sans-serif') 
  .style('font-size', '14px') 
  .style('text-anchor', 'middle') 
  .text("Hover over the bars for business counts"); 
}

export { drawBarGraph };
