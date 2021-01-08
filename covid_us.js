
const width = 1200,
      height = 750;

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

//var c = svg.append("g").classed("container", true);
var g = svg.append("g").classed("graphic", true);
var m = svg.append("g").classed("mask", true);
var focus = null;

var cvd = {}
d3.csv("https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us-counties.csv")
.get(function(data){ data.forEach( function(d){ cvd[+d.fips] = +d.cases; }); });

//g = add_d_counties(g);
g = build_counties(g, true, true, true, cvd);
m = build_states(m, true, true, true);

function build_states(container, i = false, d = false, b = false){
    d3.json("build/us.json", function(us) {
    var s = container.append("g").classed("states", true).selectAll("path").data(topojson.feature(us, us.objects.states).features).enter().append("path").classed("state", true).attr("d", path);
    if (i){ s.on("mouseover", onMouseOver)
             .on("mouseout", onMouseOut)
             .on("mousemove", onMouseMove).on("click", clicked);
            }
    if (d){ s.attr("data-state", function(d) { return d.properties.state;})
             .attr("data-population", function(d) {return d.properties.population;});
            }
    if (b){
            s.append("path")
            .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
            .attr("class", "border border--state")
            .attr("d", path);
            }
    });
    return container;
};
            
function build_counties(container, i = false, d = false, b = false, data = null){
    d3.json("build/us.json", function(us) {
    var c = container.append("g").classed("counties",true).selectAll("path").data(topojson.feature(us, us.objects.counties).features).enter().append("path").classed("county", true).attr("d", path);
    if (i){ c.on("mouseover", onMouseOver)
             .on("mouseout", onMouseOut)
             .on("mousemove", onMouseMove).on("click", clicked);
            }
    if (d){ c.attr("data-county", function(d) {return d.properties.county;})
             .attr("data-state", function(d) {return d.properties.state;})
             .attr("data-population", function(d) {return d.properties.population;});
            if (data != null){
                var color = d3.scaleLog().domain(d3.extent(Object.values(data))).range([1,0]);
                c.attr("data-cases", function(d) { return +data[+d.id];})
                 .attr("fill", function(d) {
                   var v = color(data[+d.id]);
                   return isNaN(v) ? '#FF7F50':d3.interpolateViridis(v);
                });
            }
            }
    if (b){
            c.append("path")
            .datum(topojson.mesh(us, us.objects.counties, function(a, b) { return a !== b; }))
            .attr("class", "border border--county")
            .attr("d", path);
//            c.append("path")
//            .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
//            .attr("class", "border border--state")
//            .attr("d", path);
            }
    });
    return container;
};

function onMouseOver(event, d) {
    
    d3.select(this).style("opacity", 0.25);
    
    var infoBox = d3.select(".graphic").append("g").classed("infobox", true)

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
    }
    
    
    infoBox.append("text")
    .text(t)
    .attr("dx", 5)
    .attr("dy", 20);
    
    
};

function onMouseMove(event, d){
    var [x, y] = d3.mouse(this);
    d3.select(".graphic")
    .select(".infobox")
    .selectAll("*")
    .attr("x", x)
    .attr("y", y-50)
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
        d3.select(".graphic").transition(t).attr("transform",
               "translate("+width/2 +","+height/2+")scale("+k+")translate("+-(x0+x1)/2+","+-(y0+y1)/2+")");
        d3.select(".graphic").select("infobox").transition(t).attr("transform",
                "scale("+k+")");
        d3.select(".mask").transition(t).attr("transform",
               "translate("+width/2 +","+height/2+")scale("+k+")translate("+-(x0+x1)/2+","+-(y0+y1)/2+")");
    } else {
        reset();
    };
};
