import { drawBarGraph } from './drawBarGraph.js';
import { drawLineGraph } from './drawLineGraph.js';
import { drawGeoMap } from './drawGeoMap.js';

/* state for visualization */
var visState = 0;

// datasources
import { BAR_DATA_LOCATION, LINE_DATA_LOCATION, GEO_DATA_LOCATION } from './datasources.js';

async function init() {
  /*
  Data Loaders
  */

  // handle bar data
  var bar_data = await d3.csv(BAR_DATA_LOCATION, function (d) {
    return {
      name: d.name,
      count: +d.count,
    }
  })

  bar_data = bar_data
    .sort(function (a, b) {
      return b.count - a.count
    })
    .slice(0, 10)

  // handle line data
  var line_data = await d3.csv(LINE_DATA_LOCATION, function (d) {
    return {
      year: new Date(+d.year, 0, 1),
      count: +d.count,
      name: d.name
    }
  });

  // handle geo data
  var geo_data = await d3.csv(GEO_DATA_LOCATION, function (d) {
    return {
      principalcountry: d.principalcountry,
      principalcity: d.principalcity,
      latitude: +d.latitude,
      longitude: +d.longitude,
      name: d.name,
      flag: d.flag,
      entityname: d.entityname
    }
  });

  /* canvas atributes */
  const width = 1000; // Canvas width
  const height = 600; // Canvas height
  const marginLeft = 120;
  const marginRight = 120;
  const marginTop = 60;
  const marginBottom = 60;

  // Clear canvas function
  function clearCanvas() {
    const chartContainer = document.getElementById('chart-container');
    chartContainer.textContent = '';
  }

  //* event listeners */

  // Event listener for 'countries-button'
  document.getElementById('countries-button').addEventListener('click', function () {
    if (visState != 1) {
      console.log('visstate is not 1');
      clearCanvas();
      drawBarGraph(width, height, marginLeft, marginRight, marginTop, marginBottom, bar_data); // Redraw the graph
      visState = 1;
    }
  });

  // Event listener for 'time-button'
  document.getElementById('time-button').addEventListener('click', function () {
    if (visState != 2) {
      clearCanvas();
      drawLineGraph(width, height, marginLeft, marginRight, marginTop, marginBottom, line_data);
      visState = 2;
    }
  });

  // Event listener for 'area-button'
  document.getElementById('area-button').addEventListener('click', function () {
    if (visState != 3) {
      clearCanvas();
      drawGeoMap(width, height, marginLeft, marginRight, marginTop, marginBottom, geo_data);
      visState = 3;
    }
  });

  // Initial bar graph rendering
  if (visState === 0) {
    document.getElementById('chart-container').textContent = "Please Choose a Visualization from the Navigation Bar!";
  }
}

export { init }
