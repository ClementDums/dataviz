/****GLOBE****/
const width = 960,
    height = 500;
const scl = 230;
let proj = d3.geoOrthographic()
    .scale(scl)
    .translate([width / 2, height / 2])
    // change this to 180 for transparent globe
    .clipAngle(90);


let path = d3.geoPath().projection(proj);

let graticule = d3.geoGraticule();


let time = Date.now();
let rotate = [39.666666666666664, -30];
let velocity = [.015, -0];

// var lineToLondon = function(d) {
//     return path({"type": "LineString", "coordinates": [[-0.118667702475932, 51.5019405883275], d.geometry.coordinates]});
// }

function stripWhitespace(str) {
    return str.replace(" ", "");
}

let svg = d3.select(".globe-container").append("svg")
    .attr("width", width)
    .attr("height", height)

svg.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged));

queue()
    .defer(d3.json, "world-110m.json")
    .defer(d3.json, "asteroids.json")
    .await(ready);

let zoom = d3.zoom()
    .scaleExtent([1, 2]) //bound zoom
    .on("zoom", zoomed);

svg.call(zoom);


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
            if (i.properties.mass < 1000) {
                myClass = "small"
            } else {
                myClass = "big"
            }
            return "point hidden " + myClass;
        })
        .attr("id", d => stripWhitespace(d.properties.name))

        .attr("d", path)

        .on("mouseover", (d) => {
            // var distance = Math.round(d3.geoDistance(d.geometry.coordinates, london) * 6371);
            d3.select("g.info").select("text.distance").text(d.properties.name + " Masse : " + d.properties.mass / 1000+"kg");
            let name = stripWhitespace(d.properties.name);
            d3.select("g.points").select("#" + name).style("opacity", 1)
        })
        .on("mouseout", (d) => {
            let name = stripWhitespace(d.properties.name);
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


/*********************/
/*********************/

/*********************/
/********Range******/



function initrange() {
    let range = document.querySelector(".range");
    let initValue = parseInt(range.getAttribute("value"));
    let points = document.querySelectorAll('.point');
    points.forEach(function (i) {
        let year = i.getAttribute("data-year");
        year = parseInt(year);
        i.classList.add("hidden");
        if (year < initValue + 9 && year >= initValue) {
            i.classList.remove("hidden");
        }
    });

}


function changeRange(value) {
    let rangeLabel = document.getElementById("rangeLabel");
    console.log(rangeLabel.value);
    rangeLabel.innerHTML = value;

    value = parseInt(value);
    let labels = [];
    let points = document.querySelectorAll('.point');
    points.forEach(function (i) {
        let year = i.getAttribute("data-year");
        year = parseInt(year);
        i.classList.add("hidden");
        if (year > value - 11 && year < value + 11) {
            i.classList.remove("hidden");
            labels.push(i.getAttribute("id"))
        }
    });


}


/***scroll***/
let anchor = document.querySelector('#down');
anchor.addEventListener('click', function (e) {
    e.preventDefault();

    document.querySelector('.globe-container').scrollIntoView({
        behavior: 'smooth'
    });
});

/***Sound***/

document.getElementById('sound-on').addEventListener('click', () => {
    document.getElementById('sound-off').classList.remove('hidden');
});
