/****GLOBE****/
const Globe={
    width:640,
    height:600,
    scl:280,
    proj:d3.geoOrthographic()
        .scale(scl)
        .translate([width / 2, height / 2])
        // change this to 180 for transparent globe
        .clipAngle(90)

};


let path = d3.geoPath().projection(proj);

let graticule = d3.geoGraticule();


let time = Date.now();
let rotate = [39.666666666666664, -30];
let velocity = [-0.005, -0];

function stripWhitespace(str) {
    return str.replace(" ", "");
}

let svg = d3.select(".globe-pos").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged));

queue()
    .defer(d3.json, "world-110m.json")
    .defer(d3.json, "asteroids.json")
    .await(ready);



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


    //POINTS

    svg.append("g").attr("class", "points")
        .selectAll("text").data(places.features)
        .enter().append("path")
        .attr("data-year", function (i) {
            return i.properties.year;
        })
        .attr("class", function (i) {
            let myClass;
            if (i.properties.mass > 100000) {
                myClass = "huge"
            } else if (i.properties.mass > 10000) {

                myClass = "big"
            }else if (i.properties.mass > 1000) {

                myClass = "mid"
            }
            else {

                myClass = "small"
            }
            return "point hidden " + myClass;
        })
        .attr("id", d => stripWhitespace(d.properties.name))

        .attr("d", path)

        .on("mouseover", (d) => {
            let nameIn=document.querySelector(".name");
            nameIn.innerHTML=d.properties.name;
            let massIn=document.querySelector(".mass");
            massIn.innerHTML=d.properties.mass/1000+"kg";

        })
        .on("mouseout", (d) => {
            let nameIn=document.querySelector(".name");
            // nameIn.innerHTML="";


        });


    svg.append("g").attr("class", "labels")
        .selectAll("text").data(places.features)
        .enter().append("text")
        .attr("class", "label hidden")
        .text(d => d.properties.name)
        .on("mouseover", (d) => {
            // var distance = Math.round(d3.geoDistance(d.geometry.coordinates, london) * 6371);
            d3.select("g.info").select("text.distance").text(d.properties.name);
            let name = stripWhitespace(d.properties.name);
            d3.select("g.lines").select("#" + name).style("stroke-opacity", 1)
        })
        .on("mouseout", (d) => {
            let name = stripWhitespace(d.properties.name);
            d3.select("g.lines").select("#" + name).style("stroke-opacity", 0.3);
            d3.select("g.info").select("text.distance").text("");
        });

    svg.append("g").attr("class", "countries")
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

    initrange();
    refresh();

    spin();
}


function position_labels() {

    const centerPos = proj.invert([width / 2, height / 2]);

    svg.selectAll(".label")
        .attr("text-anchor", (d) => {
            let x = proj(d.geometry.coordinates)[0];
            return x < width / 2 - 20 ? "end" :
                x < width / 2 + 20 ? "middle" :
                    "start"
        })
        .attr("transform", (d) => {
            let loc = proj(d.geometry.coordinates),
                x = loc[0],
                y = loc[1];
            let offset = x < width / 2 ? -5 : 5;
            return "translate(" + (x + offset) + "," + (y - 2) + ")"
        })
        .style("display", (d) => {
            var d = d3.geoDistance(d.geometry.coordinates, centerPos);
            return (d > 1.57) ? 'none' : 'inline';
        })

}

/***REFRESH***/

function refresh() {

    path.pointRadius(32);
    svg.selectAll(".land").attr("d", path);
    svg.selectAll(".countries path").attr("d", path);
    svg.selectAll(".graticule").attr("d", path);
    svg.selectAll(".huge").attr("d", path);
    path.pointRadius(16);
    svg.selectAll(".big").attr("d", path);
    path.pointRadius(8);
    svg.selectAll(".mid").attr("d", path);
    path.pointRadius(4);
    svg.selectAll(".small").attr("d", path);
    position_labels();
}


/*********************/
/****DRAG AND TIME***/
let timer;

function spin() {
    timer = d3.timer(function () {
        let dt = Date.now() - time;

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
    let v1 = versor.cartesian(proj.rotate(r0).invert(d3.mouse(this))),
        q1 = versor.multiply(q0, versor.delta(v0, v1)),
        r1 = versor.rotation(q1);
    proj.rotate(r1);
    refresh();
}

/***ZOOM***/
function zoomed() {
    proj.scale(d3.event.transform.translate(proj).k * scl)
    refresh();
}
