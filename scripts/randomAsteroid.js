function randomAsteroid(places) {
    const len = places.features.length;
    const random = Math.floor((Math.random()*len)+1);
    const randomName = places.features[random].properties.name;
    const randomYear = places.features[random].properties.year;

    let years ="";
    if(randomYear<1950){
        years="dans les années 1940"
    }else if(randomYear<1960){
        years="dans les années 1950"
    }
    else if(randomYear<1970){
        years="dans les années 1960"
    }else if(randomYear<1980){
        years="dans les années 1970"
    }else if(randomYear<1990){
        years="dans les années 1980"
    }else if(randomYear<2000){
        years="dans les années 1990"
    }
    else if(randomYear<2010){
        years="dans les années 2000"
    }
    else {
        years="dans les années 2010"
    }
    document.querySelectorAll('.randomY').forEach(function (item) {
        item.innerHTML=years;
    })

    document.querySelectorAll('.randomA').forEach(function (item) {
        item.innerHTML=randomName;
    })
}