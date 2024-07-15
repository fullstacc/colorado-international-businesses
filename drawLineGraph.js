// Function to draw line graph
function drawLineGraph(width, height, marginLeft, marginRight, marginTop, marginBottom, data) {
  var svg = d3
    .select('#chart')
    .append('svg')
    .attr("width", width + marginLeft + marginRight)
    .attr("height", height + marginTop + marginBottom)
    .style('background-color', 'lightblue')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

  // Group data by country
  var countryData = d3.groups(data, d => d.name);

  // Check parsed data
  console.log(countryData);

  // Add X axis
  var x = d3
    .scaleTime()
    .domain(d3.extent(data, d => d.year))
    .range([0, width]);

  svg.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")));

  // Add Y axis
  var y = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.count)])
    .range([height, 0]);

  svg.append('g')
    .call(d3.axisLeft(y));

  // Define color scale
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  // Add the lines
  countryData.forEach(function(country) {
    var name = country[0];
    var values = country[1];

    // Debugging: Log the values
    console.log(name, values);

    // Line generator
    var line = d3.line()
      .x(d => x(d.year))
      .y(d => y(d.count));

    svg.append('path')
      .datum(values)
      .attr('fill', 'none')
      .attr('stroke', color(name))
      .attr('stroke-width', 1.5)
      .attr('d', line);
  });

  // Add the X axis label
  svg.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + marginBottom - 10) + ")")
    .style("text-anchor", "middle")
    .style('font-family', 'sans-serif')
    .style('font-size', '12px')
    .text("Year");


//title
  svg.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (-marginTop / 2) + ")")
    .attr("dy", "1em") // Adjust the y-position a bit down if needed
    .style("text-anchor", "middle")
    .style('font-family', 'sans-serif')
    .style('font-size', '16px') // Larger font size for the title
    .text("Count of New Colorado Businesses by Year");

  // Add the Y axis label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - marginLeft)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style('font-family', 'sans-serif')
    .style('font-size', '12px')
    .text("Count of Active Businesses");

  // Tooltip
  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("opacity", 0);

  svg.selectAll('path')
    .on("mouseover", function(event, d) {
      tooltip.transition()
        .duration(200)
        .style("opacity", .9);
      tooltip.html("Country: " + d[0].name)
        .style("left", (event.pageX + 5) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    });
}

export { drawLineGraph };
