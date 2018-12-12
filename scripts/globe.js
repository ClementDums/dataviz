/****GLOBE****/

const width = 600,
    height = 580;
const scl = 250;
let proj = d3.geoOrthographic()
    .scale(scl)
    .translate([width / 2, height / 2])
    // change this to 180 for transparent globe
    .clipAngle(90);


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
    .defer(d3.json, "json/world-110m.json")
    .defer(d3.json, "json/asteroid1940.json")
    .await(ready);




function ready(error, world, places) {
    randomAsteroid(places);
    window.world = world;
    window.places=places;


    svg.append("circle")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr("r", proj.scale())
        .attr("class", "noclicks")

    svg.append("g").attr("class", "countries")
        .selectAll("path")
        .data(topojson.object(world, world.objects.countries).geometries)
        .enter().append("path")
        .attr("d", path);

    svg.append("path")
        .datum(topojson.object(world, world.objects.land))
        .attr("class", "land")
        .attr("d", path);
    let currentyear=2009;


    filterDatas(currentyear)

    spin();
    dragstarted()
}

function filterDatas(currentYear) {
    const world=window.world;
    const places = window.places;

    let basedata = {"type": "FeatureCollection", "features": []};

    totalMass(currentYear, places);
    places.features.forEach(function (item) {
        if(item.properties.year===currentYear){
            basedata.features.push(item);
        }

    });
    //POINTS


    svg.append("g").attr("class", "points")
        .selectAll("text").data(basedata.features)
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
            return "point " + myClass;
        })
        .attr("id", d => stripWhitespace(d.properties.name))

        .attr("d", path)

        .on("mouseover", (d) => {
            let nameIn=document.querySelector(".name");
            nameIn.innerHTML=d.properties.name;
            let massIn=document.querySelector(".mass");
            massIn.innerHTML=Math.round(1000*(d.properties.mass/1000))/1000+"kg";
            if(!d.properties.mass){
                massIn.innerHTML="";
            }

        })
        .on("mouseout", (d) => {
            let nameIn=document.querySelector(".name");
            // nameIn.innerHTML="";


        });


    refresh();

}

function totalMass(year, places) {
    let masstotal=0;
    document.querySelector(".currentYear").innerHTML=year;
    places.features.forEach(function (item) {
        if(item.properties.year==year){
            masstotal+=Math.round(item.properties.mass/1000);
        }
    });
    document.querySelector(".totalCount").innerHTML=masstotal;
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
// function zoomed() {
//     proj.scale(d3.event.transform.translate(proj).k * scl)
//     refresh();
// }
