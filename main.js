// Scroll To Element Smothy with Vanilla JavaScript

/***********/


/***Sound***/

document.getElementById('sound-on').addEventListener('click', () => {
    document.getElementById('sound-off').classList.remove('hidden');
});



/****PARALLAX SOURIS***/
var scenes = [];
var scenesSelector = document.querySelectorAll('.scene');

for(let i=0; i<scenesSelector.length; i++){
    scenes[i] = new Parallax(scenesSelector[i]);
}



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





/****DISABLE SCROLL****/
var keys = {37: 1, 38: 1, 39: 1, 40: 1, 32: 1};
function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
    if (window.addEventListener) // older FF
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove  = preventDefault; // mobile
    document.onkeydown  = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
}
/***fullpage js***/

disableScroll();

function enablefullpage() {
    new fullpage('#fullpage', {
        //options here
        css3: false,
        scrollingSpeed: 1000,
        autoScrolling:true,
        scrollHorizontally: false,
        onLeave: function(origin, destination, direction){
            if(destination.item.id != "header"){
                setTimeout(function(){
                    anim.stop()
                }, 1000);


            }else{
                anim.play();
            }
        },
    });
}


