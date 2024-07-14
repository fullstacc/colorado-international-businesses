// Function to draw bar graph
function drawGeoMap(width, height, marginLeft, marginRight, marginTop, marginBottom, data) {
    var svg = d3
      .select('#chart')
      .append('svg')
      .attr("width", width + marginLeft + marginRight)
      .attr("height", height + marginTop + marginBottom)
      .style('background-color', 'lightblue')
      .append('g')
      .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

    // Add X axis
    var x = d3
      .scaleLinear()
      .domain([0, d3.max(data, function (d) { return d.count; })])
      .range([0, width]);

    svg.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-family', 'sans-serif')
      .style('font-size', '12px');

    // Insert X axis label here
    svg.append("text")
      .attr("transform", "translate(" + (width / 2) + " ," + (height + marginBottom - 30) + ")")
      .style("text-anchor", "middle")
      .style('font-family', 'sans-serif')
      .style('font-size', '12px')
      .text("Count of Active Businesses (as of July 2024)");

    // Y axis
    var y = d3.scaleBand()
      .range([0, height])
      .domain(data.map(function (d) { return d.name; }))
      .padding(0.1);

    svg.append('g')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('font-family', 'sans-serif')
      .style('font-size', '12px');

    // Create a tooltip div that is hidden by default
    var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("opacity", 0);

    // Bars
    svg.selectAll('myRect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', x(0))
      .attr('y', function (d) { return y(d.name); })
      .attr('width', function (d) { return x(d.count); })
      .attr('height', y.bandwidth())
      .attr('fill', '#002868')
      .on("mouseover", function(event, d) {
          tooltip.transition()
              .duration(200)
              .style("opacity", .9);
          tooltip.html("Count: " + d.count)
              .style("left", (event.pageX + 5) + "px")
              .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
              .duration(500)
              .style("opacity", 0);
      });
}

export { drawGeoMap }
