/****GLOBE****/
const width = 640,
    height = 600;
const scl = 280;
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

    rangeLabel.innerHTML = value;

    value = parseInt(value);
    let labels = [];
    let points = document.querySelectorAll('.point');
    points.forEach(function (i) {
        let year = i.getAttribute("data-year");
        year = parseInt(year);
        i.classList.add("hidden");
        if (year === value ) {
            i.classList.remove("hidden");
            labels.push(i.getAttribute("id"))
        }
    });


}


/***NEAR ASTEROIDS DEMI CERCLE***/

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
}

let today = new Date();
today = formatDate(today);
let tomorrow= new Date();
tomorrow = tomorrow.setDate(tomorrow.getDate() + 3);
tomorrow= formatDate(tomorrow);



function callApi(date,datef) {
    const req = new XMLHttpRequest();

    req.onreadystatechange = function(event) {
        // XMLHttpRequest.DONE === 4
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                let datasNear = JSON.parse(this.responseText);
                datasProcess(datasNear);
            } else {
                console.log("Status de la réponse: %d (%s)", this.status, this.statusText);
            }
        }
    };

    req.open('GET', 'https://ssd-api.jpl.nasa.gov/cad.api?date-min='+date+'&date-max='+datef+'', true);
    req.send(null);
}

callApi(today,tomorrow);


function datasProcess(datas){
    console.log(datas);
    let finalDatas=[];
    Object.keys(datas.data).forEach(function (k){
        finalDatas.push(datas.data[k]);
    });

    axis(finalDatas);
}

GraphSvg();
function GraphSvg(){
    const parent =document.getElementById("graph");
    const width = 500;
    const height = 500;
    const margin = {top: 20, right: 40, bottom: 30, left: 50};
    const dataXY = [0.05, 0.04, 0.03, 0.02, 0.01, 0];
    let svg2 = d3.select("#graph")
        .append("svg")
        .attr("class", "axeGraph")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    let x = d3.scaleLinear().domain([d3.min(dataXY), d3.max(dataXY)]).range([width,0]);
    let y = d3.scaleLinear().domain([d3.min(dataXY), d3.max(dataXY)]).range([height, 0]);
    const arc = d3.arc();
    svg2.append('path')
        .attr("transform", "translate( " + width + ", 0 )")
        .attr('d', arc({
            innerRadius: 0,
            outerRadius: 5,
            startAngle: -Math.PI*0.5,
            endAngle: Math.PI*0.5
        }));


    svg2.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("stroke","#fff")
        .call(d3.axisBottom(x).ticks(5).tickFormat(function(n) { return n + " au"}));

    svg2.append("g")
        .attr("transform", "translate( " + width + ", 0 )")
        .attr("stroke","#fff")
        .attr("class","axisY")
        .call(d3.axisRight(y).ticks(5));
}
function axis(data){
    const cptRadius =[1,2,3,4,5];
    const svg2 =d3.select(".axeGraph");
    const arc = d3.arc();

    svg2.selectAll("quarterCircle")
        .data(cptRadius)
        .enter().append('path')
        .attr('transform', 'translate('+[550,520]+')')
        .attr('fill',"none")
        .attr('stroke',"#fff")
        .attr("stroke-width",1)
        .attr('d', function (d){
            console.log(d);
            const myArc = arc({
            innerRadius: 0,
            outerRadius: 100*d,
            startAngle: -Math.PI*0.5,
            endAngle: 0});
            return myArc;
        });

    svg2.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", function (d){return d[10]})
        .attr("cx", 550 )
        .attr("fill", "#fff")
        .attr("stroke","#fff")
        .attr("dist", function (d){return d[4]})
        .attr("cy", function (d){return (500-(d[4]*10000)+20)} );
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


/****PARALLAX SOURIS***/
 var scene = document.getElementById('scene');
 var parallaxInstance = new Parallax(scene);

 /***ANIMATION***/
 var container = document.getElementById('hair-container');
// Set up our animation
var animData = {
    container: container,
    renderer: 'svg',
    autoplay: true,
    loop: true,
    path: 'images/girlanim.json'
};
var anim = bodymovin.loadAnimation(animData);


/***fullpage js***/
new fullpage('#fullpage', {
    //options here
    css3: false,
    scrollingSpeed: 100,
    autoScrolling:true,
    scrollHorizontally: false
});

