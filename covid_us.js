/**
Ben Webb
covid_is.js
1.10.2021
*/

const width = 960,
      height = 600;

const svg = d3.select("#chart")
              .append("svg")
              .attr("viewBox", [0, 0, width, height])
              .on("dblclick", reset);

const t = d3.transition()
            .duration(750)
            .ease(d3.easeCubic);

const zoom = d3.zoom();

const path = d3.geoPath()
               .projection(null);

const g = svg.append("g").classed("graphic", true);
const m = svg.append("g").classed("mask", true);
var focus = null;


       
new counties_geo(g).d().data(fill=true);
new states_geo(m).i().d().data(fill=false);
