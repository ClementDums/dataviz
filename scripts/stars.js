
let sun={
    x:400,
    y:150
}
/****STARS****/

function update(progress) {
    if(Math.random()*10>9.9){
        createStar();}
    stars.forEach(function (star,i) {
        const d=Math.sqrt(Math.pow(sun.x-star.x,2)+Math.pow(sun.y-star.y,2))*10;
        star.x=star.x+(sun.x-star.x)/d;
        star.y=star.y+(sun.y-star.y)/d;
        if(star.y>200 || star.x>350){
            let index = stars.indexOf(star);
            delete stars[index];
            stars.splice(index, 1);
        }

    });
}

function draw() {
    d3.selectAll("#stars > *").remove();
    stars.forEach(function (star) {

        d3.select("#stars").append("circle").attr("cx", star.x).attr("cy", star.y).attr("r", star.r).attr("stroke-width", star.r).style("fill", "white");

    });



}

function loop(timestamp) {
    let progress = timestamp - lastRender;
    update(progress);
    draw();

    lastRender = timestamp;
    window.requestAnimationFrame(loop)
}
var lastRender = 0;
window.requestAnimationFrame(loop);


let stars = [];

class Star {
    // méthode constructor

    constructor(x, y, r, t, sx, sy, ax, ay) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.t = t;
    }
}

function createStar() {
    let x = (Math.random() * 400)-100;
    let y = Math.random() * 200;
    let r = Math.random()*1.2;
    let t = Math.random();
    let newStar = new Star(x, y, r, t);
    stars.push(newStar);

}

for (let i = 0; i < 30; i++) {
    createStar()
}

