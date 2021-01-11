/**
Ben Webb
covid_is.js
1.10.2021
*/

const width = 960,
      height = 600;
const st = ["states", "state"],
      co = ["counties", "county"];

const svg = d3.select(".chart")
              .append("svg")
              .attr("viewBox", [0, 0, width, height])
              .on("dblclick", reset);

const t = d3.transition()
        .duration(750)
        .ease(d3.easeCubic);

const zoom = d3.zoom();

const path = d3.geoPath()
               .projection(null);

var g = svg.append("g").classed("graphic", true);
var m = svg.append("g").classed("mask", true);
var focus = null;

new states_geo(m).i().d();
new counties_geo(g).d().data();


//build(m, gl = st, d = true, data = null, i = true);

function build(container, gl, d = false, data = null, i = false){
    /**
    
     */
    d3.json("build/us.json", function(us) {
    var geo = container.append("g")
                       .classed(gl[0], true)
                       .selectAll("path")
                       .data(topojson.feature(us, us.objects[gl[0]]).features)
                       .enter()
                       .append("path")
                       .classed(gl[1], true)
                       .attr("d", path);
    if (i){ geo.on("mouseover", onMouseOver)
               .on("mouseout", onMouseOut)
               .on("mousemove", onMouseMove).on("click", clicked);
            }
    if (d){ geo.attr("data-county", function(d) {return d.properties.county;})
               .attr("data-state", function(d) { return d.properties.state;})
               .attr("data-population", function(d) {return d.properties.population;});
            if (data != null){
            var color = d3.scaleLog().domain(d3.extent(Object.values(data))).range([1,0]);
            geo.attr("data-cases", function(d) { return +data[+d.id];})
               .attr("fill", function(d) {
                     var v = color(data[+d.id]);
                     return isNaN(v) ? '#FF7F50':d3.interpolateViridis(v);
                     });
            }
            }
            
    });
};

function onMouseOver(event, d) {
    
    d3.select(this).style("opacity", 0.25);
    
    var infoBox = svg.append("div").classed("infobox", true)

    infoBox.append("rect")
           .attr("width", 150)
           .attr("height", 100);

    if (d3.select(this).classed("state")){
        var t = d3.select(this).attr("data-state");
    } else if (d3.select(this).classed("county")){
        var t = d3.select(this).attr("data-county");
        var c = d3.select(this).attr("data-population");

        infoBox.append("text")
        .text(c)
        .attr("dx", 5)
        .attr("dy", 10);
    };
    
    
    infoBox.append("text")
    .text(t)
    .attr("dx", 5)
    .attr("dy", 20);
    
    
};

function onMouseMove(event, d){
    var [x, y] = d3.mouse(this);
    d3.select(".graphic").select(".infobox").selectAll("*").attr("x", x).attr("y", y-50)
};

function onMouseOut(event, d) {
    d3.select(this).style("opacity", 1);
    d3.select(".graphic").selectAll(".infobox").remove().exit();
};

function reset() {
   if (focus != null){
       d3.select(".mask").select("g").remove();
       m = build_states(m, true, true);
       d3.select(".graphic").selectAll(".infobox").remove();

       d3.select(".graphic").transition(t).attr("transform",
             "translate("+width/2 +","+height/2+")scale("+1+")translate("+-width/2+","+-height/2+")");
       d3.select(".graphic").select("infobox").transition(t).attr("transform",
             "scale("+1+")");
       d3.select(".mask").transition(t).attr("transform",
            "translate("+width/2 +","+height/2+")scale("+1+")translate("+-width/2+","+-height/2+")");
       focus = null;
   };
 };

function clicked(d) {
    var x0, y0, x1, y1, k;
    if (focus != d){
        
        [[x0, y0], [x1, y1]] = path.bounds(d);
        k = Math.min(8, 0.7 / Math.max((x1 - x0) / width, (y1 - y0) / height));
        if (d3.select(this).classed('states')){
            m = build_counties(m, true, true, true, cvd);
            d3.select(".mask").select(".states").remove();
        }
        focus = d;
        event.stopPropagation();
//        d3.select(".graphic").transition(t).attr("transform",
//               "translate("+width/2 +","+height/2+")scale("+k+")translate("+-(x0+x1)/2+","+-(y0+y1)/2+")");
//        d3.select(".graphic").select("infobox").transition(t).attr("transform",
//                "scale("+k+")");
//        d3.select(".mask").transition(t).attr("transform",
//               "translate("+width/2 +","+height/2+")scale("+k+")translate("+-(x0+x1)/2+","+-(y0+y1)/2+")");
        svg.selectAll("g").transition(t).attr("transform",
        "translate("+width/2 +","+height/2+")scale("+k+")translate("+-(x0+x1)/2+","+-(y0+y1)/2+")");
    } else {
        reset();
    };
};
