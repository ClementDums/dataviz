
/********Range******/
document.addEventListener("DOMContentLoaded", function() {
    initrange()
});

function initrange()
{
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
function changeRange(value){
    value=parseInt(value);
    let labels=[];
    let points = document.querySelectorAll('.point');
    points.forEach(function (i) {
        let year= i.getAttribute("data-year");
        year=parseInt(year);
        i.classList.add("hidden");
        if(year>value-11 && year<value+11){
            i.classList.remove("hidden");
            labels.push(i.getAttribute("id"))
        }
    });


}