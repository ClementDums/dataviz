var slider = new Slider('#ex1', {
    formatter: function(value) {
        return 'Current value: ' + value;
    }
});

var width = 960,
    height = 500;

var proj = d3.geoOrthographic()
    .scale(230)
    .translate([width / 2, height / 2])
    // change this to 180 for transparent globe
    .clipAngle(90);


var path = d3.geoPath().projection(proj);

var graticule = d3.geoGraticule();

// var london = [-0.118667702475932, 51.5019405883275];

var time = Date.now();
var rotate = [39.666666666666664, -30];
var velocity = [.015, -0];

var lineToLondon = function(d) {
    return path({"type": "LineString", "coordinates": [[-0.118667702475932, 51.5019405883275], d.geometry.coordinates]});
}

function stripWhitespace(str) {
    return str.replace(" ", "");
}

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)

svg.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged));

queue()
    .defer(d3.json, "world-110m.json")
    .defer(d3.json, "asteroids.json")
    .await(ready);


function radius(x) {
    x= getpath(x);
    return x
}
function convert(d) {
    return {
        date: new Date(d.date),
        value: +d.value         // convert string to number
    };
}
function ready(error, world, places) {

        svg.append("circle")
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .attr("r", proj.scale())
            .attr("class", "noclicks")
            .attr("fill", "none");

        svg.append("path")
            .datum(topojson.object(world, world.objects.land))
            .attr("class", "land")
            .attr("d", path);

        svg.append("path")
            .datum(graticule)
            .attr("class", "graticule noclicks")
            .attr("d", path);

        //POINTS

        svg.append("g").attr("class","points")
            .selectAll("text").data(places.features)
            .enter().append("path")
            .attr("data-year", function (i) {
                return i.properties.year;
            })
            .attr("class", function (i) {
                let myClass;
                if(i.properties.mass<1000){
                    myClass = "small"
                }else{
                    myClass = "big"
                }
                return "point "+myClass;
            })
            .attr("id", d => stripWhitespace(d.properties.name))

            .attr("d", path)

            .on("mouseover", (d) => {
                // var distance = Math.round(d3.geoDistance(d.geometry.coordinates, london) * 6371);
                d3.select("g.info").select("text.distance").text("Masse de: ~km");
                var name = stripWhitespace(d.properties.name);
                d3.select("g.points").select("#" + name).style("opacity", 1)
            })
            .on("mouseout", (d) => {
                var name = stripWhitespace(d.properties.name);
                d3.select("g.points").select("#" + name).style("opacity", 0.6);
                d3.select("g.info").select("text.distance").text("");


            });


        /**************/
        // svg.append("g").attr("class","lines")
        //     .selectAll(".lines").data(places.features)
        //     .enter().append("path")
        //     .attr("class", "lines")
        //     .attr("id", d => stripWhitespace(d.properties.name))
        //     .attr("d", d => lineToLondon(d));


        svg.append("g").attr("class","labels")
            .selectAll("text").data(places.features)
            .enter().append("text")
            .attr("class", "label")
            .text(d => d.properties.name)
            .on("mouseover", (d) => {
                // var distance = Math.round(d3.geoDistance(d.geometry.coordinates, london) * 6371);
                d3.select("g.info").select("text.distance").text("Masse de: ~km");
                var name = stripWhitespace(d.properties.name);
                d3.select("g.lines").select("#" + name).style("stroke-opacity", 1)
            })
            .on("mouseout", (d) => {
                var name = stripWhitespace(d.properties.name);
                d3.select("g.lines").select("#" + name).style("stroke-opacity", 0.3);
                d3.select("g.info").select("text.distance").text("");
            });

        svg.append("g").attr("class","countries")
            .selectAll("path")
            .data(topojson.object(world, world.objects.countries).geometries)
            .enter().append("path")
            .attr("d", path);

        position_labels();

        svg.append("g").attr("class", "info")
            .append("text")
            .attr("class", "distance")
            .attr("x", width / 20)
            .attr("y", height * 0.9)
            .attr("text-anchor", "start")
            .style("font-size", "15px")
            .text("");

        refresh();

        spin();
}


function position_labels() {
    var centerPos = proj.invert([width/2,height/2]);

    svg.selectAll(".label")
        .attr("text-anchor", (d) => {
            var x = proj(d.geometry.coordinates)[0];
            return x < width/2-20 ? "end" :
                x < width/2+20 ? "middle" :
                    "start"
        })
        .attr("transform", (d) => {
            var loc = proj(d.geometry.coordinates),
                x = loc[0],
                y = loc[1];
            var offset = x < width/2 ? -5 : 5;
            return "translate(" + (x+offset) + "," + (y-2) + ")"
        })
        .style("display", (d) => {
            var d = d3.geoDistance(d.geometry.coordinates, centerPos);
            return (d > 1.57) ? 'none' : 'inline';
        })

}

/***REFRESH***/

function refresh() {

    path.pointRadius(5);
    svg.selectAll(".land").attr("d", path);
    svg.selectAll(".countries path").attr("d", path);
    svg.selectAll(".graticule").attr("d", path);
    svg.selectAll(".small").attr("d", path);
    path.pointRadius(10);
    svg.selectAll(".big").attr("d", path);
    position_labels();
}


/*********************/
/****DRAG AND TIME***/
let timer;

function spin() {
    timer = d3.timer(function() {
        var dt = Date.now() -time;

        proj.rotate([rotate[0] + velocity[0] * dt, rotate[1] + velocity[1] * dt]);

        refresh();
    });
}

function dragstarted() {
    timer.stop();
    v0 = versor.cartesian(proj.invert(d3.mouse(this)));
    r0 = proj.rotate();
    q0 = versor(r0);
}

function dragged() {
    var v1 = versor.cartesian(proj.rotate(r0).invert(d3.mouse(this))),
        q1 = versor.multiply(q0, versor.delta(v0, v1)),
        r1 = versor.rotation(q1);
    proj.rotate(r1);
    refresh();
}
