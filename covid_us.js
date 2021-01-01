const width = 1200,
      height = 750;

const svg = d3.select("body")
              .append("svg")
              .attr("viewBox", [0, 0, width, height])
              .on("dblclick", reset),
      container = d3.select("body")
                    .append("svg");
var model_container = {};

const transition = d3.transition(),
      zoom = d3.zoom(),
      path = d3.geoPath()
               .projection(null);

var graphic = svg.append("g");
var mask = svg.append("g")
              .attr("class", mask);
var focus = null;

function build_states(container){
    d3.json("./build/us.json", function(error, us) {
    if (error) return console.error(error);
    
        container.append("g")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
}

    
    d3.csv("https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us-counties.csv", function(error, data){
        if (error) return console.error(error);
           var covid_data = {};
           if (error) return console.error(error);
           
           data.forEach(function(d) {
                    covid_data[+d.fips] = +d.cases;
           });
           
           var color = d3.scaleQuantize()
           .domain(Object.values(covid_data))
           .range(["#0A2F51", "#0E4D64", "#137177", "#188977", "#1D9A6C", "#39A96B", "#74C67A", "#99D492", "#BFE1B0", "#DEEDCF"]);
            
           const counties = g.append("g")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.counties).features)
            .enter()
            .append("path")
           .on("mouseover", onMouseOver)
           .on("mouseout", onMouseOut)
           .on("click", clicked)
            .style("fill", function(d) {
                 return color(covid_data[+d.id]);
             })
            .attr("class", "county")
            .attr("d", path);
           
           g.append("path")
           .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
           .attr("class", "border border--state")
           .attr("d", path);
    });
    mask.append("g")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter()
    .append("path")
    .on("mouseover", onMouseOver)
    .on("mouseout", onMouseOut)
    .on("click", clicked)
    .attr("class", "state")
    .attr("d", path);
});

    
    function onMouseOver(event, d) {
        d3.select(this).style("opacity", 0.95);
    };

    function onMouseOut(event, d) {
        d3.select(this).style("opacity", 0.1);
    };

function reset() {
   if (focus != null){
       g
       .transition()
       .duration(750)
       .attr('transform',
             'translate('+width/2 +','+height/2+')scale('+1+')translate('+-width/2+','+-height/2+')');
       focus = null;
   }
 }

    function clicked(d) {
      var x0, y0, x1, y1, k;
      if (focus != d){
        [[x0, y0], [x1, y1]] = path.bounds(d);
        event.stopPropagation();
        k = Math.min(8, 0.7 / Math.max((x1 - x0) / width, (y1 - y0) / height));
        focus = d;
        mask.remove();
        g.transition().duration(750)
         .attr('transform',
               'translate('+width/2 +','+height/2+')scale('+k+')translate('+-(x0+x1)/2+','+-(y0+y1)/2+')');
                     } else { reset(); };
    };
    
    function zoomed(event) {
        var {transform} = event;
        g.attr("transform", transform);
        g.attr("stroke-width", 1 / transform.k);
    }
