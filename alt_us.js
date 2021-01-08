function build_i_states(container){
    d3.json("./build/us.json", function(us) {
    container.append("g").classed("states", true).selectAll("path").data(topojson.feature(us, us.objects.states).features).enter().append("path").classed("states", true).on("mouseover", onMouseOver).on("mouseout", onMouseOut).on("click", clicked).attr("d", path);
    });
    return container;
};
            
function build_i_counties(container){
    d3.json("./build/us.json", function(us) {
    container.append("g").classed("counties",true).selectAll("path").data(topojson.feature(us, us.objects.counties).features).enter().append("path").classed("county", true).on("mouseover", onMouseOver).on("mouseout", onMouseOut).on("click", clicked).attr("d", path);
    });
    return container;
};

function build_d_counties(container){
    d3.json("build/us.json", function(us) {
    d3.csv("https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us-counties.csv", function(error, data){
           var covid_data = {};
           data.forEach( function(d){ covid_data[+d.fips] = +d.cases; });
          
           var c = d3.scaleLog().domain(d3.extent(Object.values(covid_data))).range([0,1]);
           
           container.append("g")
            .classed("counties", true)
            .selectAll("path")
            .data(topojson.feature(us, us.objects.counties).features)
            .enter()
            .append("path")
            .style("fill", function(d) {
                 var v = c(covid_data[+d.id]);
                 return isNaN(v) ? '#FF7F50':d3.interpolateViridis(v);
             })
            .attr("class", "county")
            .attr("d", path);
           
           
           });

           container.append("path")
           .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
           .attr("class", "border border--state")
           .attr("d", path);

    });
    return container;
};

function build_states(container){
    d3.json("./build/us.json", function(us) {
    container.append("g").classed("states", true).selectAll("path").data(topojson.feature(us, us.objects.states).features).enter().append("path").attr("class", "state").attr("d", path);
    });
    return container;
};
            
function build_counties(container){
    d3.json("./build/us.json", function(us) {
    container.append("g").classed("counties", true).selectAll("path").data(topojson.feature(us, us.objects.counties).features).enter().append("path").attr("class", "county").attr("d", path);
    });
    return container;
};

function onMouseOver(event, d) {
    d3.select(this).style("opacity", 0.25);
};

function onMouseOut(event, d) {
    d3.select(this).style("opacity", 1);
};

function reset() {
   if (focus != null){
       m.select("g").remove();
       m = build_i_states(m);
       g.transition(t)
       .attr('transform',
             'translate('+width/2 +','+height/2+')scale('+1+')translate('+-width/2+','+-height/2+')');
       m
       .transition(t)
       .attr('transform',
             'translate('+width/2 +','+height/2+')scale('+1+')translate('+-width/2+','+-height/2+')');
       
       focus = null;
   };
 };

function clicked(d) {
    var x0, y0, x1, y1, k;
    if (focus != d){
        
        [[x0, y0], [x1, y1]] = path.bounds(d);
        k = Math.min(8, 0.7 / Math.max((x1 - x0) / width, (y1 - y0) / height));
        if (d3.select(this).classed('states')){
            m = build_i_counties(m);
            m.select('.states').remove();
        }
        focus = d;
        event.stopPropagation();
        g.transition(t)
         .attr('transform',
               'translate('+width/2 +','+height/2+')scale('+k+')translate('+-(x0+x1)/2+','+-(y0+y1)/2+')');
        m.transition(t)
         .attr('transform',
              'translate('+width/2 +','+height/2+')scale('+k+')translate('+-(x0+x1)/2+','+-(y0+y1)/2+')');
                     } else {
                     reset();
    };
};
