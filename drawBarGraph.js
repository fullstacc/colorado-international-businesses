  // function to draw bar graph
    function drawBarGraph(width, height,marginLeft,marginRight,marginTop, marginBottom, data) {
    
        var svg = d3
          .select('#chart')
          .append('svg')
          .attr("width", width)
          .attr("height", height)
          .style('background-color', 'lightblue')
          .append('g')
          .attr(
            'transform',
            'translate(' +  marginLeft + ',' + marginRight+ ')'
          )

        // Add X axis
        var x = d3
          .scaleLinear()
          .domain([
            0,
            d3.max(data, function (d) {
              return d.count
            }),
          ]) // Dynamic domain based on data
          .range([0, width])
        svg
          .append('g')
          .attr('transform', 'translate(0,' + height + ')')
          .call(d3.axisBottom(x))
          .selectAll('text')
          .attr('transform', 'translate(-10,0)rotate(-45)')
          .style('text-anchor', 'end')

        // Y axis
        var y = d3
          .scaleBand()
          .range([0, height])
          .domain(
            data.map(function (d) {
              return d.name
            })
          )
          .padding(0.1)
        svg.append('g').call(d3.axisLeft(y))

        //Bars
        svg
          .selectAll('myRect')
          .data(data)
          .enter()
          .append('rect')
          .attr('x', x(0))
          .attr('y', function (d) {
            return y(d.name)
          })
          .attr('width', function (d) {
            return x(d.count)
          })
          .attr('height', y.bandwidth())
          .attr('fill', '#69b3a2')
  }

export {drawBarGraph}