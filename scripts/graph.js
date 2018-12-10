
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

/***GRAPH***/

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

    let tickLabels = ['Terre','0.01 au','0.02 au','0.03 au','0.04 au','0.05 au']

    svg2.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("stroke","#fff")
        .call(d3.axisBottom(x).ticks(5).tickFormat(function(n,i) { return tickLabels[i]}));

    svg2.append("g")
        .attr("transform", "translate( " + width + ", 0 )")
        .attr("stroke","#fff")
        .attr("class","axisY")
        .call(d3.axisRight(y).ticks(5));

    quarterCircle()
}

/**INIT**/
function initToday(){let today = new Date();
    today = formatDate(today);
    let tomorrow= new Date();
    tomorrow = tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow= formatDate(tomorrow);
    callApi(today,tomorrow);}

initToday()
/****/

let selectToday = document.querySelector(".today");
selectToday.addEventListener("click",function () {
    setDay();
    selectToday.classList.add('active');
    let today = new Date();
    today = formatDate(today);
    let tomorrow= new Date();
    tomorrow = tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow= formatDate(tomorrow);
    callApi(today,tomorrow);

});

let selectTomorrow = document.querySelector(".tomorrow");
selectTomorrow.addEventListener("click",function () {
    setDay();
    selectTomorrow.classList.add('active');
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
    setDay();
    selectYesterday.classList.add('active');
    let today = new Date();
    today = today.setDate(today.getDate() - 1);
    today = formatDate(today);
    let tomorrow= new Date();
    tomorrow= formatDate(tomorrow);
    callApi(today,tomorrow);

});

function setDay() {
    let name = document.querySelector(".name-graph");
    name.innerHTML= "";
    let date = document.querySelector(".date-graph");
    date.innerHTML= "";
    let dist = document.querySelector(".dist-graph");
    dist.innerHTML= "";

    let selections= document.querySelectorAll('.selector');
    selections.forEach(function (i) {
        i.classList.remove("active")
    });
    let pastDotes = document.querySelectorAll('.dote');
    pastDotes.forEach(function (node) {
        node.parentNode.removeChild( node );
    });
}
/***CALL API***/
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
    let finalDatas=[];
    if(datas.data){
        Object.keys(datas.data).forEach(function (k){
            finalDatas.push(datas.data[k]);
        });}else{
        let name = document.querySelector(".name-graph");
        name.innerHTML= "Aucun astéroïde n'est tombé";
    }
    if(finalDatas.length > 0){
        axis(finalDatas);}
}

GraphSvg();


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

function randomToday() {
    
}



