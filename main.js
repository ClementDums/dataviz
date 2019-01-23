/****PARALLAX SOURIS***/
const scenes = [];
const scenesSelector = document.querySelectorAll('.scene');

for(let i=0; i<scenesSelector.length; i++){
    scenes[i] = new Parallax(scenesSelector[i]);
}



/***ANIMATION***/
const container = document.getElementById('hair-container');
// Set up our animation
const animData = {
    container: container,
    renderer: 'svg',
    autoplay: true,
    loop: true,
    path: 'json/cheveux.json'
};
const anim = bodymovin.loadAnimation(animData);



disableScroll();



/***Sound***/
/****PLAY SOUND***/

document.getElementById('sound-on').addEventListener('click', () => {
    document.getElementById('sound-off').classList.remove('hidden');
    document.getElementById('sound-on').classList.add('hidden');
    forest.pause();
    earth.pause();
});

document.getElementById('sound-off').addEventListener('click', () => {
    document.getElementById('sound-off').classList.add('hidden');
    document.getElementById('sound-on').classList.remove('hidden');
    const page = document.querySelectorAll('.section');
    let mypage="none";
    page.forEach(function (item) {
        if(item.classList.contains("active")){
            mypage = item.id;
        }
    })
    if(mypage=="header"){
        forest.play();
    }else if(mypage=="none"){
        forest.play();
    }
    else{
        earth.play()
    }


});
const forest = new Audio('sounds/forest.mp3');
var playPromise = forest.play();

if (playPromise !== undefined) {
    playPromise.then(_ => {
    })
        .catch(error => {
            // Auto-play was prevented
            // Show paused UI.
        });
}

const earth = new Audio('sounds/earth.mp3');

forest.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

earth.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);
//

function enablefullpage() {
    new fullpage('#fullpage', {
        //options here
        css3: false,
        licenseKey: 'rdvcB@o6',
        scrollingSpeed: 500,
        autoScrolling:true,
        scrollHorizontally: false,
        responsiveWidth: 900,
        onLeave: function(origin, destination, direction){
            if(destination.item.id != "header"){

                setTimeout(function(){
                    anim.stop()
                }, 1000);
                const soundoff= document.querySelector("#sound-off");
                if(soundoff.classList.contains("hidden")) {
                    forest.pause();

                    earth.play();
                }

            }else{
                const soundoff= document.querySelector("#sound-off");
                if(soundoff.classList.contains("hidden")) {
                    earth.pause();
                    forest.play();
                }
            }
        },
    });
}


