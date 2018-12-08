

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
tomorrow = tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow= formatDate(tomorrow);

callApi(today,tomorrow);

let selectToday = document.querySelector(".today");
selectToday.addEventListener("click",function () {
    let selections= document.querySelectorAll('.selector');
    selections.forEach(function (i) {
        i.classList.remove("active")
    });
    selectToday.classList.add('active');
    let pastDotes = document.querySelectorAll('.dote');
    pastDotes.forEach(function (node) {
        node.parentNode.removeChild( node );
    });
    let today = new Date();
    today = formatDate(today);
    let tomorrow= new Date();
    tomorrow = tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow= formatDate(tomorrow);
    callApi(today,tomorrow);

});

let selectTomorrow = document.querySelector(".tomorrow");
selectTomorrow.addEventListener("click",function () {
    let selections= document.querySelectorAll('.selector');
    selections.forEach(function (i) {
        i.classList.remove("active")
    });
    selectTomorrow.classList.add('active');
    let pastDotes = document.querySelectorAll('.dote');
    pastDotes.forEach(function (node) {
        node.parentNode.removeChild( node );
    });
    let today = new Date();
    today = today.setDate(today.getDate() + 1);
    today = formatDate(today);
    let tomorrow= new Date();
    tomorrow = tomorrow.setDate(tomorrow.getDate() + 2);
    tomorrow= formatDate(tomorrow);
    callApi(today,tomorrow);

});


let selectYesterday = document.querySelector(".yesterday");
selectYesterday.addEventListener("click",() =>{
    let selections= document.querySelectorAll('.selector');
    selections.forEach(function (i) {
        i.classList.remove("active")
    });
    selectYesterday.classList.add('active');
    let pastDotes = document.querySelectorAll('.dote');
    pastDotes.forEach(function (node) {
        node.parentNode.removeChild( node );
    });
    let today = new Date();
    today = today.setDate(today.getDate() - 1);
    today = formatDate(today);
    let tomorrow= new Date();
    tomorrow= formatDate(tomorrow);
    callApi(today,tomorrow);

});


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




function datasProcess(datas){
    console.log(datas);
    let finalDatas=[];
    if(datas.data){
    Object.keys(datas.data).forEach(function (k){
        finalDatas.push(datas.data[k]);
    });}
    if(finalDatas.length > 0){
    axis(finalDatas);}
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



    svg2.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("stroke","#fff")
        .call(d3.axisBottom(x).ticks(5).tickFormat(function(n) { return n + " au"}));

    svg2.append("g")
        .attr("transform", "translate( " + width + ", 0 )")
        .attr("stroke","#fff")
        .attr("class","axisY")
        .call(d3.axisRight(y).ticks(5));

    quarterCircle()
}

function quarterCircle() {

    const svg2 =d3.select(".axeGraph");

    const cptRadius =[1,2,3,4,5];
    const arc = d3.arc();
    svg2.selectAll("quarterCircle")
        .data(cptRadius)
        .enter().append('path')
        .attr('transform', 'translate('+[550,520]+')')
        .attr('fill',"none")
        .attr('stroke',"#fff")
        .attr("stroke-width",1)
        .attr('d', function (d){
            const myArc = arc({
                innerRadius: 0,
                outerRadius: 100*d,
                startAngle: -Math.PI*0.5,
                endAngle: 0});
            return myArc;
        });
}
function axis(data){

    const svg2 =d3.select(".axeGraph");

    svg2.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("class",function (d) {
            return "dote " + d[0];
        })
        .attr("r", function (d){
            return 1/(d[10]-18)*70})
        .attr("cx", 550 )
        .attr("fill", "#fff")
        .attr("stroke","#fff")
        .attr("dist", function (d){return d[4]})
        .attr("cy", function (d){return (500-(d[4]*10000)+20)} )
        .on("mouseover", (d) => {
            let name = document.querySelector(".name-graph");
            name.innerHTML= d[0];
            let date = document.querySelector(".date-graph");
            date.innerHTML= d[3];
            let dist = document.querySelector(".dist-graph");
            dist.innerHTML= Math.round(d[4]*100000)/100000+" ua de la Terre";
        })

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

