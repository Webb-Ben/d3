/**
 Ben Webb
 geo_objects.js
 1.10.2021
 */
   
var us;
$.ajax({
  dataType: "json",
  url: "build/us.json",
  async: false,
  success: function(data){us = data}
});

class us_geo {
    constructor(gc, gl){
        this._gl = gl;
        this._geo = gc.append("g")
                      .classed(gl[0], true)
                        .selectAll("path")
                        .data(topojson.feature(us, us.objects[gl[0]]).features)
                        .enter()
                        .append("path")
                        .classed(gl[1], true)
                        .attr("d", path);
        
        return this;
    }

    i (){
        this._geo.on("mouseover", onMouseOver)
                 .on("mouseout", onMouseOut)
                 .on("mousemove", onMouseMove)
                 .on("click", clicked);
        return this;
    }

    d () {
        this._geo.attr("data-county", function(d) {return d.properties.county;})
                 .attr("data-state", function(d) { return d.properties.state;})
                 .attr("data-population", function(d) {return d.properties.population;});
        return this;
    }
    

    data () {
        d3.csv("https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us-"+this._gl[0]+".csv", (function(data){
                var cvd = {};
                data.forEach( function(d){ cvd[+d.fips] = +d.cases; });
                var color = d3.scaleLog().domain(d3.extent(Object.values(cvd))).range([1,0]);
                this._geo.attr("data-cases", function(d){ return cvd[+d.id]; })
                this._geo.attr("fill", function(d) {
                    var v = color(cvd[+d.id]);
                    return isNaN(v) ? '#FF7F50':d3.interpolateViridis(v);
                });
            }).bind(this));
        return this;
    }
    
    fill () {
        return this;
    }
    
}

class counties_geo extends us_geo {
    constructor(gc){
        super(gc, ["counties", "county"]);
    }
}

class states_geo extends us_geo {
    constructor(gc, gi, gd){
        super(gc, ["states", "state"])
    }
}

function onMouseOver(event, d) {
    
    d3.select(this).style("opacity", 0.25);

    var infoBox = svg.append("g")
                     .classed("infobox", true);

    if (d3.select(this).classed("state")){
        var t = d3.select(this).attr("data-state");
    } else if (d3.select(this).classed("county")){
        var t = d3.select(this).attr("data-county");
        var c = d3.select(this).attr("data-population");

        infoBox.append("text")
        .text(c)
        .attr("dx", 1)
        .attr("dy", 10);
    };
    
    
    infoBox.append("text")
    .text(t)
    .attr("dx", 1)
    .attr("dy", -10);
    
    
};

function onMouseMove(event, d){
    var [x, y] = d3.mouse(this);
    d3.select(".infobox").selectAll("*").attr("x", x).attr("y", y);
};

function onMouseOut(event, d) {
    d3.select(this).style("opacity", 1);
    d3.selectAll(".infobox").remove().exit();
};

function reset() {
   if (focus != null){
       d3.select(".mask").select("g").remove();
       new states_geo(m).i().d();
       d3.select(".graphic").selectAll(".infobox").remove().exit();

       d3.select(".graphic").transition(t).attr("transform",
             "translate("+width/2 +","+height/2+")scale("+1+")translate("+-width/2+","+-height/2+")");
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
        console.log(d3.select(this));
        if (d3.select(this).classed('state')){
            d3.select(".mask").select(".states").remove().exit();
            new counties_geo(m).d().i();
        }

        focus = d;
        event.stopPropagation();
        d3.select(".graphic").transition(t).attr("transform",
               "translate("+width/2 +","+height/2+")scale("+k+")translate("+-(x0+x1)/2+","+-(y0+y1)/2+")");
        d3.select(".mask").transition(t).attr("transform",
               "translate("+width/2 +","+height/2+")scale("+k+")translate("+-(x0+x1)/2+","+-(y0+y1)/2+")");
    } else {
        reset();
    };
};
