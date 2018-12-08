
function initrange() {
    const range = document.querySelector(".range");
    const initValue = parseInt(range.getAttribute("value"));
    const points = document.querySelectorAll('.point');
    points.forEach(function (i) {
        let year = i.getAttribute("data-year");
        year = parseInt(year);
        i.classList.add("hidden");
        if (year < initValue + 9 && year >= initValue) {
            i.classList.remove("hidden");
        }
    });

}


function changeRange(value) {
    const rangeLabel = document.getElementById("rangeLabel");

    rangeLabel.innerHTML = value;

    value = parseInt(value);
    const labels = [];
    const points = document.querySelectorAll('.point');
    points.forEach(function (i) {
        let year = i.getAttribute("data-year");
        year = parseInt(year);
        i.classList.add("hidden");
        if (year === value ) {
            i.classList.remove("hidden");
            labels.push(i.getAttribute("id"))
        }
    });


}
