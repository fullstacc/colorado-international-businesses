function drawLineGraph(width, height, marginLeft, marginRight, marginTop, marginBottom, data) {
  width = 600;  // Set desired width
  height = 400; // Set desired height

  // Clear previous SVG if any
  d3.select("#chart-container").select("svg").remove();

  var svg = d3
    .select('#chart-container')
    .append('svg')
    .attr("width", width + marginLeft + marginRight + 100) // Added extra space for legend
    .attr("height", height + marginTop + marginBottom)
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
  var lines = svg.selectAll('.line')
      .data(countryData)
      .enter()
      .append('path')
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', d => color(d[0]))
      .attr('stroke-width', 3)  // Default line thickness
      .attr('d', d => d3.line()
          .x(d => x(d.year))
          .y(d => y(d.count))
          (d[1]))
      .on("mouseover", (event, d) => {
          d3.selectAll('.line').attr('opacity', 0.2);
          d3.select(this).attr('stroke-width', 5).attr('opacity', 1); // make specific country line thicker
          tooltip.transition()
              .duration(200)
              .style("opacity", .9);
          tooltip.html("Country: " + d[0])
              .style("left", (event.pageX + 5) + "px")
              .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => {
          d3.selectAll('.line').attr('stroke-width', 3).attr('opacity', 1); // restore default line appearance
          tooltip.transition()
              .duration(500)
              .style("opacity", 0);
      });

  // x axis label
  svg.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + marginBottom - 10) + ")")
    .style("text-anchor", "middle")
    .style('font-family', 'sans-serif')
    .style('font-size', '12px')
    .text("Year");

  // title
  svg.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (-marginTop / 2) + ")")
    .attr("dy", "1em") // Adjust the y-position a bit down if needed
    .style("text-anchor", "middle")
    .style('font-family', 'sans-serif')
    .style('font-size', '16px') // Larger font size for the title
    .text("Count of New Colorado Businesses by Year");

  // y axis
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - marginLeft)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style('font-family', 'sans-serif')
    .style('font-size', '12px')
    .text("Count of Active Businesses");

  // tooltip
  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("opacity", 0);

  // annotation
  svg.append("text")
    .attr("transform", "translate(" + (width + 10) + "," + -10 + ")")
    .style("fill", "red")
    .style("font-family", "sans-serif")
    .style("font-size", "12px")
    .text("Hover over the legend");

  /* legend section */
  
  var legend = svg.selectAll('.legend')
      .data(countryData)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(${width + 10},${i * 20})`) // mouseover section for line effects
      .on("mouseover", (event, d) => {
          d3.selectAll('.line').attr('opacity', 0.2);
          d3.selectAll('.line')
              .filter(lineData => lineData[0] === d[0])
              .attr('stroke-width', 5)
              .attr('opacity', 1); 
          tooltip.transition()
              .duration(200)
              .style("opacity", .9);
          tooltip.html("Country: " + d[0])
              .style("left", (event.pageX + 5) + "px")
              .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => {
          d3.selectAll('.line').attr('stroke-width', 3).attr('opacity', 1); // Restore original thickness and opacity
          tooltip.transition()
              .duration(500)
              .style("opacity", 0);
      });

  // legend is essentially little rectangles with text
  legend.append('rect')
    .attr('width', 18)
    .attr('height', 18)
    .style('fill', d => color(d[0]));

  legend.append('text')
    .attr('x', 24)
    .attr('y', 9)
    .attr('dy', '.35em')
    .style('text-anchor', 'start')
    .style('font-family', 'sans-serif')
    .style('font-size', '12px')
    .text(d => d[0]);
}

export { drawLineGraph };
