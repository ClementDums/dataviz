window.addEventListener('scroll', function() {
    parallax()
});

function parallax() {
    let scrolledy = window.pageYOffset;
    let ground = document.getElementById("ground");

    // $('#pencil').css('top', (900 - (scrolledy * 2)) + 'px');
    // $('#pick').css('top', (400 - (scrolledy * 0.8)) + 'px')
}