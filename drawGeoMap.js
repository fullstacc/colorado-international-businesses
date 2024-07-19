function drawGeoMap(width, height, marginLeft, marginRight, marginTop, marginBottom, data) {
  // oveerwide width and height
  width = 600;  
  height = 400; 

  const graphWidth = width - marginLeft - marginRight;
  const graphHeight = height - marginTop - marginBottom;

  d3.select("#chart-container").select("svg").remove();

  // canvas
  var svg = d3.select("#chart-container")
     .append("svg")
     .attr("width", width)
     .attr("height", height)
     .append('g')
     .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

  console.log("this is the data", data);

  // center map
  var projection = d3.geoMercator()
    .center([-105.5478, 39.0]) 
    .scale(3000) 
    .translate([graphWidth / 2, graphHeight / 2]);

  var path = d3.geoPath()
    .projection(projection);

  // color scale
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  // annotation
  svg.append('text') 
    .attr('x', (graphWidth / 2)) 
    .attr('y', (-marginTop / 2) - 4) 
    .style('fill', 'red') 
    .style('font-family', 'sans-serif') 
    .style('font-size', '17px') 
    .style('text-anchor', 'middle') 
    .text("Hover over the dots for business information"); 

  // make a big array of countries
  const countries = Array.from(new Set(data.map(d => d.principalcountry)));

  // map country name -> color scale
  const countryColor = d3.scaleOrdinal()
    .domain(countries)
    .range(d3.schemeCategory10);

  // tooltip 
  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background", "#fff")
    .style("border", "1px solid #ccc")
    .style("padding", "10px")
    .style("border-radius", "5px");

  // load data
  d3.json("https://raw.githubusercontent.com/earthlab/earthpy/main/earthpy/example-data/colorado-counties.geojson").then(coCounties => {
    svg.selectAll(".county")
      .data(coCounties.features)
      .enter()
      .append("path")
      .attr("class", "county")
      .attr("d", path)
      .attr("fill", "#ccc")
      .attr("stroke", "#333");

  // Render data -> map
  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => projection([d.longitude, d.latitude])[0])
    .attr("cy", d => projection([d.longitude, d.latitude])[1])
    .attr("r", 5)
    .attr("fill", d => countryColor(d.principalcountry))
    .attr("stroke", "#333")
    .on("mouseover", (event, d) => {
      tooltip.style("visibility", "visible")
        .html(`<strong>${d.entityname}</strong><br><img src="${d.flag}" width="50" height="30"><br><span style="text-align: center">${d.name}</span>`);
    })
    .on("mousemove", (event) => {
      tooltip.style("top", (event.pageY - 10) + "px")
        .style("left", (event.pageX + 10) + "px");
    })
    .on("mouseout", () => {
      tooltip.style("visibility", "hidden")
        .classed('tooltip', true);
    });

  /* legend section */
  var legend = svg.selectAll('.legend')
    .data(countries)
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', (d, i) => `translate(0,${i * 20})`)
    .on("mouseover", (event, d) => {
      d3.selectAll('circle').attr('opacity', 0.2);
      d3.selectAll('circle')
        .filter(circleData => circleData.principalcountry === d)
        .attr('r', 8)
        .attr('opacity', 1);
      tooltip.transition()
        .duration(200)
        .style("opacity", .9);
      tooltip.html("Country: " + d)
        .style("left", (event.pageX + 5) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", () => {
      d3.selectAll('circle').attr('r', 5).attr('opacity', 1); 
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    });

  // legend is essentially little rectangles with text
  legend.append('rect')
      .attr('x', graphWidth + 10)
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', d => countryColor(d));

  legend.append('text')
    .attr('x', graphWidth + 34)
    .attr('y', 9)
    .attr('dy', '.35em')
    .style('text-anchor', 'start')
    .style('font-family', 'sans-serif')
    .style('font-size', '12px')
    .text(d => d);
  }); 
}

export { drawGeoMap }
