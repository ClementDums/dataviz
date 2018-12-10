//text

const apparitionElement = document.querySelector('.text-apparition');
const spans = Array.from(apparitionElement.querySelectorAll('span'));

function animateSpans() {
    setTimeout(function(){
        scrollEnable();
        spans.forEach(span => {
            const animationDelay = Math.random() / 2;

            span.style.animationDelay = animationDelay + 's';
        });

        if (apparitionElement.classList.contains('fadein')) {
            apparitionElement.classList.remove('fadein');
            apparitionElement.classList.add('fadeout');
        } else {
            apparitionElement.classList.add('fadein');
            apparitionElement.classList.remove('fadeout');
        }
        setTimeout(function(){
            animSlogan();
        }, 2000);
    }, 4000);



}
function animSlogan(){
    let text=document.getElementById('slogan');
    TweenLite.to(text, 0, {display: "block"});
    TweenLite.to(text, 1, {opacity: 1});
    setTimeout(function(){
        let down=document.getElementById('down-header');
        TweenLite.to(down, 1, {opacity: 1,y:+20});
    }, 2000);
}



function scrollEnable(){
    document.querySelector("body").classList.remove("noscroll");
    enableScroll()
    enablefullpage()
}



    setTimeout(function(){
        animText();
    }, 4000);
setTimeout(function(){
    meteorcolor();
}, 2000);

function meteorcolor(){
    let meteor = document.querySelector("#meteor-2");
    TweenLite.to(meteor, 4, {fill: "#fff"});
}

function animText(){

    let text1=document.getElementById('text1');
    TweenLite.to(text1, 0, {display: "block"});
    TweenLite.to(text1, 1, {opacity: 1});
    TweenLite.to(text1, 1, {opacity: 0}).delay(4);
    TweenLite.to(text1, 1, {display: "none"}).delay(4);
    TweenMax.delayedCall(6, text2);

}

function text2() {
    let text2=document.getElementById('text2');
    TweenLite.to(text2, 0, {display: "block"});
    TweenLite.to(text2, 1, {opacity: 1});
    TweenLite.to(text2, 1, {opacity: 0}).delay(4);
    TweenLite.to(text2, 1, {display: "none"}).delay(4);
    TweenMax.delayedCall(6, text3);

}
function text3() {

    let text3=document.getElementById('text3');
    TweenLite.to(text3, 0, {display: "block"});
    TweenLite.to(text3, 1, {opacity: 1});
    TweenLite.to(text3, 1, {opacity: 0}).delay(4);
    TweenLite.to(text3, 1, {display: "none"}).delay(4);
    TweenMax.delayedCall(6, text4);
}

function  text4() {
    let text4=document.getElementById('text4');
    TweenLite.to(text4, 0, {display: "block"});
    TweenLite.to(text4, 1, {opacity: 1});
    TweenLite.to(text4, 1, {opacity: 0}).delay(4);
    TweenLite.to(text4, 1, {display: "none"}).delay(4);
    TweenMax.delayedCall(6, text5);
}

function  text5() {
    let text5=document.getElementById('text5');
    TweenLite.to(text5, 0, {display: "block"});
    TweenLite.to(text5, 1, {opacity: 1});
    TweenLite.to(text5, 1, {opacity: 0}).delay(4);
    TweenLite.to(text5, 1, {display: "none"}).delay(4);
    TweenMax.delayedCall(8, animateSpans());
}




/***Parallax***/







