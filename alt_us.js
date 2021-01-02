const width = 1200,
      height = 750;

const svg = d3.select("body")
              .append("svg")
              .attr("viewBox", [0, 0, width, height])
              .on("dblclick", reset);

const transition = d3.transition();
const zoom = d3.zoom()
               .scaleExtent([1, 8]);
const path = d3.geoPath()
               .projection(null);

var g = svg.append("g");
var mask = svg.append("g")
              .attr("class", mask);

var focus = null;

d3.json("./build/us.json", function(error, us) {
if (error) return console.error(error);
    
    d3.csv("https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us-counties.csv", function(error, data){
        console.log(data);
        if (error) return console.error(error);
           var covid_data = {};
           data.forEach(function(d) {
                    covid_data[+d.fips] = +d.cases;
           });
           console.log(covid_data, Object.keys(covid_data));

           var color = d3.scaleQuantize()
           .domain(Object.values(covid_data))
           .range(["#800072", "#8F006C", "#9F0064", "#AF0058", "#BF004A", "#CF0039", "#DF0026", "#EF0011", " #FF0500", "#FD2602", "#FB4605", "#F86507", "#F68209", "#F49F0B", "#F2BA0D", "#EFD510", "#EDED12"]);
           
           const counties = g.append("g")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.counties).features)
            .enter()
            .append("path")
           .on("mouseover", onMouseOver)
           .on("mouseout", onMouseOut)
           .on("click", clicked)
            .style("fill", function(d) {
                console.log(covid_data[+d.id]);
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
        d3.select(this).style("opacity", 0.7);
    };

    function onMouseOut(event, d) {
        d3.select(this).style("opacity", 0.25);
    };

function reset() {
   if (focus != null){
       g
       .transition()
       .duration(750)
       .attr('transform',
             'translate('+width/2 +','+height/2+')scale('+1+')translate('+-width/2+','+-height/2+')');
       focus = null;
       d3.json("./build/us.json", function(error, us) {
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

