const width = 1200,
      height = 750;

const svg = d3.select("body")
              .append("svg")
              .attr("viewBox", [0, 0, width, height])
              .on("dblclick", reset),
      c = d3.select("body")
            .append("svg")
            .attr("viewBox", [0, 0, 0, 0]);

var states = new Object();
states = build_states();
console.log(states);

var counties = new Object();
counties = build_counties();
console.log(counties);
//const cvd = covid_nyt_data();

const transition = d3.transition(),
      zoom = d3.zoom(),
      path = d3.geoPath()
               .projection(null);

var g = svg.append("g");
var mask = svg.append("g")
              .attr("class", mask);
var focus = null;

//var color = d3.scaleQuantize()
//.domain(Object.values(cvd))
//.range(["#0A2F51", "#0E4D64", "#137177", "#188977", "#1D9A6C", "#39A96B", "#74C67A", "#99D492", "#BFE1B0", "#DEEDCF"]);

//states
//.attr("class", "state")
//.attr("d", path);

console.log( c.selectAll('g'), c.selectAll('.county'), c.selectAll('.state')  );

//g.merge(
// c.selectAll(".county").clone() )
//.style("fill", function(d) {
//     return color(cvd[+d.id]);
// })
//.attr("class", "county")
//.attr("d", path);


function build_states(){
    d3.json("./build/us.json", function(us) {
    var states = c.append("g").selectAll("path").data(topojson.feature(us, us.objects.states).features).enter().append("path").attr("d", path).attr("class", "state");
//    if (i) { states.on("mouseover", onMouseOver).on("mouseout", onMouseOut).on("click", clicked)};
    console.log(states);
    return d3.values(states);
    });
};
            
//function build_counties(){
//    d3.json("./build/us.json", function(us) {
//    var counties = c.append("g").selectAll("path").data(topojson.feature(us, us.objects.counties).features).enter().append("path").attr("d", path).attr("class", "county");
//    if (i) { counties.on("mouseover", onMouseOver).on("mouseout", onMouseOut).on("click", clicked)};
//    console.log(counties);
//    return counties;
//    });
//};
            
//function covid_nyt_data(){
//    var cv_data = {};
//    d3.csv("https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us-counties.csv", function(error, data){
//    data.forEach(function(d) {
//                 cv_data[+d.fips] = +d.cases;
//                 });
//    });
//    return cv_data;
//};

//function onMouseOver(event, d) {
//    d3.select(this).style("opacity", 0.8);
//};

//function onMouseOut(event, d) {
//    d3.select(this).style("opacity", 0.3);
//};

//function reset() {
//   if (focus != null){
//       g
//       .transition()
//       .duration(750)
//       .attr('transform',
//             'translate('+width/2 +','+height/2+')scale('+1+')translate('+-width/2+','+-height/2+')');
//       focus = null;
//   };
// };

//    function clicked(d) {
//      var x0, y0, x1, y1, k;
//      if (focus != d){
//        [[x0, y0], [x1, y1]] = path.bounds(d);
//        event.stopPropagation();
//        k = Math.min(8, 0.7 / Math.max((x1 - x0) / width, (y1 - y0) / height));
//        focus = d;
//        mask.remove();
//        g.transition().duration(750)
//         .attr('transform',
//               'translate('+width/2 +','+height/2+')scale('+k+')translate('+-(x0+x1)/2+','+-(y0+y1)/2+')');
//                     } else { reset(); };
//    };
    
//    function zoomed(event) {
//        var {transform} = event;
//        g.attr("transform", transform);
//        g.attr("stroke-width", 1 / transform.k);
//    };
