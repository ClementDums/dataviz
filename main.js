

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