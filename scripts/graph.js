/***API CALLS***/
/***CURRENT ASTEROID API***/
function getCurrentAsteroid(min,date){
    const req = new XMLHttpRequest();
    req.onreadystatechange = function(event) {
        // XMLHttpRequest.DONE === 4
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                let datasNear = JSON.parse(this.responseText);
                const len = datasNear.data.length;
                const current=datasNear.data[len-1];
                const currentName=current[0];
                const currentDate=current[3];
                let daytext="";

                let day = parseInt(currentDate.slice(9,11));
                const today = new Date().getDate();
                if(day==today){
                    daytext="aujourd'hui";
                }
                else if(day==today-1){
                    daytext="hier";
                }else if(day==today-2){
                    daytext="avant hier";
                }
                else{
                    daytext="il y a quelques jours"
                }

                document.querySelector(".textday").innerHTML=daytext;
                const hour = currentDate.slice(12, 14);
                const minutes = currentDate.slice(15, 18);
                const tab = document.querySelectorAll('.currentA');

                tab.forEach(function (i) {
                    i.innerHTML= currentName;
                });

                const date = document.querySelector('.date-current');
                date.innerHTML = hour+' heures '+minutes;

            } else {
                console.log("Status de la réponse: %d (%s)", this.status, this.statusText);
            }
        }
    };

    req.open('GET', 'https://ssd-api.jpl.nasa.gov/cad.api?date-min='+min+'&date-max='+date+'', true);
    req.send(null);
}


/***CALL API***/
function callApi(date,datef) {
    const req = new XMLHttpRequest();
    req.onreadystatechange = function(event) {
        // XMLHttpRequest.DONE === 4
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                let datasNear = JSON.parse(this.responseText);
                datasProcess(datasNear)

            } else {
                console.log("Status de la réponse: %d (%s)", this.status, this.statusText);
            }
        }
    };

    req.open('GET', 'https://ssd-api.jpl.nasa.gov/cad.api?date-min='+date+'&date-max='+datef+'', true);
    req.send(null);
}

/**************/


/***DATE FORMATS***/

Number.prototype.padLeft = function(base,chr){
    let  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
};
function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
}
/*****/
/***INIT***/

function initToday(){
    /***today***/
    let today = new Date();
    today = formatDate(today);
    let tomorrow= new Date();
    tomorrow = tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow= formatDate(tomorrow);
    callApi(today,tomorrow);



    /*tomorrow*/
    today = new Date();
    today = today.setDate(today.getDate() + 1);
    today = formatDate(today);
    tomorrow= new Date();
    tomorrow = tomorrow.setDate(tomorrow.getDate() + 2);
    tomorrow= formatDate(tomorrow);
    callApi(today, tomorrow);


    /**Yesterday**/
    today = new Date();
    today = today.setDate(today.getDate() - 1);
    today = formatDate(today);
    tomorrow= new Date();
    tomorrow= formatDate(tomorrow);
    callApi(today, tomorrow);

    /***Text current***/
    let nearAsteroid= new Date();
    nearAsteroid = nearAsteroid.setDate(nearAsteroid.getDate() - 5);
    nearAsteroid= formatDate(nearAsteroid);

    let d = new Date();
    const date = [d.getFullYear().padLeft(),
            (d.getMonth()+1),
            d.getDate().padLeft()].join('-') +'T' +
        [d.getHours().padLeft(),
            d.getMinutes().padLeft(),
            d.getSeconds().padLeft()].join(':');
    getCurrentAsteroid(nearAsteroid, date);



}

initToday();
/****/

/***GRAPH***/
/***CIRCLES***/
function quarterCircle() {

    const svg2 =d3.select(".axeGraph");

    const cptRadius =[1,2,3,4,5];
    const arc = d3.arc();
    svg2.selectAll("quarterCircle")
        .data(cptRadius)
        .enter().append('path')
        .attr("class","quarterCircle active")
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

function GraphSvgSpeed(){
    const parent =document.getElementById("graph");
    const width = 500;
    const height = 500;
    const margin = {top: 20, right: 40, bottom: 30, left: 50};
    let dataXY;
    dataXY = [30, 20 ,10 , 0];


    let svg2 = d3.select("#graph")
        .append("svg")
        .attr("class", "axeGraph speedGraph")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    let x = d3.scaleLinear().domain([d3.min(dataXY), d3.max(dataXY)]).range([width,0]);
    let y = d3.scaleLinear().domain([d3.min(dataXY), d3.max(dataXY)]).range([height, 0]);

    let tickLabels;

        tickLabels = ['Terre','10 km/s','20 km/s','30 km/s'];


        svg2.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("stroke","#fff")
            .call(d3.axisBottom(x).ticks(3).tickFormat(function(n,i) { return tickLabels[i]}));

        svg2.append("g")
            .attr("transform", "translate( " + width + ", 0 )")
            .attr("stroke","#fff")
            .attr("class","axisY")
            .call(d3.axisRight(y).ticks(3));


}

function GraphSvgDistance(){
    const parent =document.getElementById("graph");
    const width = 500;
    const height = 500;
    const margin = {top: 20, right: 40, bottom: 30, left: 50};
    let dataXY;
    dataXY = [0.05, 0.04, 0.03, 0.02, 0.01, 0];

    let svg2 = d3.select("#graph")
        .append("svg")
        .attr("class", "axeGraph visible distanceGraph")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    let x = d3.scaleLinear().domain([d3.min(dataXY), d3.max(dataXY)]).range([width,0]);
    let y = d3.scaleLinear().domain([d3.min(dataXY), d3.max(dataXY)]).range([height, 0]);

    let tickLabels;
    tickLabels = ['Terre','0.01 ua','0.02 ua','0.03 ua','0.04 ua','0.05 ua'];

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



/*********SELECT SPEED DISTANCE************/
document.querySelector(".speed-on").addEventListener("click",onspeed);
function onspeed() {

    document.querySelector(".distance-button").classList.remove("active");
    document.querySelector(".speed-button").classList.add("active");

    const circles = document.querySelectorAll(".quarterCircle");
    circles.forEach(function (i) {
        i.classList.remove("active");
    });

    document.querySelector(".speedGraph").classList.add("visible");
    document.querySelector(".distanceGraph").classList.remove("visible");



}


document.querySelector(".distance-on").addEventListener("click",ondistance);
function ondistance() {
    const speeds =document.querySelectorAll(".speed");

    document.querySelector(".distance-button").classList.add("active");
    document.querySelector(".speed-button").classList.remove("active");
    const circles = document.querySelectorAll(".quarterCircle");
    circles.forEach(function (i) {
        i.classList.add("active");
    });
    document.querySelector(".speedGraph").classList.remove("visible");
    document.querySelector(".distanceGraph").classList.add("visible");

}

/************/
/****SELECT DAYS****/

let selectTomorrow = document.querySelector(".tomorrow-selector");
selectTomorrow.addEventListener("click",function () {
    setDay();
    selectTomorrow.classList.add('active');
    let dotes = document.querySelectorAll(".tomorrow");
    dotes.forEach(function (i) {
        i.classList.add("visible");
    });
    if(dotes.length<1){
        let nocontent = document.querySelector(".no-content");
        nocontent.innerHTML= "Aucun astéroïde n'est passé dans les alentours ce jour-ci.";

    }

});

let selectToday = document.querySelector(".today-selector");
selectToday.addEventListener("click",function () {
    setDay();

    selectToday.classList.add('active');

    let dotes = document.querySelectorAll(".today");
    dotes.forEach(function (i) {
        i.classList.add("visible");
    });
    if(dotes.length<1){
        let nocontent = document.querySelector(".no-content");
        nocontent.innerHTML= "Aucun astéroïde n'est passé dans les alentours ce jour-ci.";

    }
});

let selectYesterday = document.querySelector(".yesterday-selector");
selectYesterday.addEventListener("click",() =>{
    setDay();

    selectYesterday.classList.add('active');
    let dotes = document.querySelectorAll(".yesterday");
    dotes.forEach(function (i) {
        i.classList.add("visible");
    });
    if(dotes.length<1){
        let nocontent = document.querySelector(".no-content");
        nocontent.innerHTML= "Aucun astéroïde n'est passé dans les alentours ce jour-ci.";

    }

});

/*******************/
/****REMOVE SVG****/


/**REMOVE FIELDS**/
function setDay() {
    document.querySelector(".no-content").innerHTML="";
    let name = document.querySelector(".name-graph");
    name.innerHTML= "";
    let date = document.querySelector(".date-graph");
    date.innerHTML= "";
    let dist = document.querySelector(".dist-graph");
    dist.innerHTML= "";
    document.querySelector(".speed-graph").innerHTML= "";
    document.querySelector(".uakm").innerHTML= "";

    let selections= document.querySelectorAll('.selector');
    selections.forEach(function (i) {
        i.classList.remove("active")
    });
    let pastDotes = document.querySelectorAll('.dote');
    pastDotes.forEach(function (node) {
        node.classList.remove("visible");
    });
    let pastSpeed = document.querySelectorAll('.speed');
    pastSpeed.forEach(function (node) {
        node.classList.remove("visible");
    });
}






/****DISPLAY****/
function datasProcess(datas){
    let finalDatas=[];
    if(datas.data){
        Object.keys(datas.data).forEach(function (k){
            finalDatas.push(datas.data[k]);
        });}
    if(finalDatas.length > 0){
        axis(finalDatas);}
}
const distance = true;
GraphSvgDistance();
GraphSvgSpeed();

/***ADD POINTS***/
function axis(data){
    const svg1 = d3.select(".distanceGraph");


    svg1.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("class",function (d) {

            let myclass = "";
            let aDate=d[3];
            aDate=d[3].substring(0, d[3].length-6);
            aDate = aDate.substring(9,11);
            aDate= parseInt(aDate);

            let now = new Date();
            now =now.getDate();

            if(now===aDate){
                myclass="today visible";
            }
            if(now+1===aDate){
                myclass="tomorrow";
            }
            if(now-1===aDate){
                myclass="yesterday";
            }

            return "dote " +myclass;
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
            let speed = document.querySelector(".speed-graph");
            speed.innerHTML= Math.round(d[7]*1000)/1000+" km/s";
            let uakm = document.querySelector(".uakm").innerHTML="1 ua = distance Terre-Soleil = 149597870 km";
        });


    const svg2 =d3.select(".speedGraph");

    svg2.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("class",function (d) {

            let myclass = "";
            let aDate=d[3];
            aDate=d[3].substring(0, d[3].length-6);
            aDate = aDate.substring(9,11);
            aDate= parseInt(aDate);

            let now = new Date();
            now =now.getDate();

            if(now===aDate){
                myclass="today visible";
            }
            if(now+1===aDate){
                myclass="tomorrow";
            }
            if(now-1===aDate){
                myclass="yesterday";
            }

            return "dote " +myclass;
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
            let speed = document.querySelector(".speed-graph");
            speed.innerHTML= Math.round(d[7]*1000)/1000+" km/s";
            let uakm = document.querySelector(".uakm").innerHTML="1 ua = distance Terre-Soleil = 149597870 km";
        });


    svg2.selectAll("speed")
        .data(data)
        .enter().append("rect")
        .attr("class", function (d) {
                let myclass = "";
                let aDate=d[3];
                aDate=d[3].substring(0, d[3].length-6);
                aDate = aDate.substring(9,11);
                aDate= parseInt(aDate);

                let now = new Date();
                now =now.getDate();

                if(now===aDate){
                    myclass="today visible";
                }
                if(now+1===aDate){
                    myclass="tomorrow";
                }
                if(now-1===aDate){
                    myclass="yesterday";
                }

                return "speed " +myclass;

        })
        .attr("data-speed" , function (d) {
            return Math.round(d[7]*1000)/1000;
        })
        .attr("height", 2)
        .attr("width", function (d) {
            const coef = (Math.round(d[7]*1000)/1000)/30;
            return coef*550-25;
        })
        .attr("x", function (d) {
            const coef = (Math.round(d[7]*1000)/1000)/30;
            return 550-(coef*550)+25
        } )
        .attr("fill", "#fff")
        .attr("stroke","#fff")
        .attr("y", function (d){return (500-(d[4]*10000)+20)} )
        .on("mouseover", (d) => {

            let name = document.querySelector(".name-graph");
            name.innerHTML= d[0];
            let date = document.querySelector(".date-graph");
            date.innerHTML= d[3];
            let dist = document.querySelector(".dist-graph");
            dist.innerHTML= Math.round(d[4]*100000)/100000+" ua de la Terre";
            let uakm = document.querySelector(".uakm").innerHTML="1 ua = distance Terre-Soleil = 149597870 km";
        });

        if(document.querySelector('.speed-button').classList.contains("active")){
            const speeds =document.querySelectorAll(".speed");
            speeds.forEach(function (i) {
                i.classList.add('visible');
            });
        }

        /***DOTTED LINES***/
    const dataX =[10,20,30];
    svg2.selectAll("dotted")
        .data(dataX)
        .enter().append('line')
        .attr("class","dottedlines")
        .attr("stroke-dasharray", "1, 15")
        .attr("stroke-linecap","round")
        .attr("x1", function (d) {
            return 500-((500/30)*d)+50
        })
        .attr("x2", function (d) {
            return 500-((500/30)*d)+50
        })
        .attr("stroke-width",3)
        .attr("stroke","#fff")
        .attr("y1", 0 )
        .attr("y2", 520 )

}
/************/

