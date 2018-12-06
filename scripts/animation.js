//text

const apparitionElement = document.querySelector('.text-apparition');
const spans = Array.from(apparitionElement.querySelectorAll('span'));

function animateSpans() {
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
        animateExplo();
    }, 4000);

}

setTimeout(function(){
    animateSpans();
}, 1000);

function animateExplo(){
    let explo=document.getElementById('explo');
    TweenLite.to(explo, 0.5, {opacity: 1});
    setTimeout(function(){
        meteor.classList.remove('hidden');
        TweenLite.to(explo, 0.5, {opacity: 0});
        TweenMax.to("#myOffset", 4, {
            attr: {
                "offset": "100%"
            },
        });
    }, 1000);
    let meteor=document.getElementById('meteor');

    setTimeout(function(){
        animText();
    }, 4000);
}

function animText(){
    let text1=document.getElementById('text1');
    TweenLite.to(text1, 1, {opacity: 1});
}
/***Parallax***/


window.addEventListener('scroll', function() {
    parallax()
});

function parallax() {
    let scrolledy = window.pageYOffset;
    // $('#boxe').css('top', (900 - (scrolledy * 0.5)) + 'px');
    // $('#pencil').css('top', (900 - (scrolledy * 2)) + 'px');
    // $('#pick').css('top', (400 - (scrolledy * 0.8)) + 'px')
}




