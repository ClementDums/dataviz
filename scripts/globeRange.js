



function changeRange(value) {
    let node = document.querySelector('.points');
    if(node){
        node.parentNode.removeChild(node);}

    const rangeLabel = document.getElementById("rangeLabel");
    rangeLabel.innerHTML = value;

    value = parseInt(value);
    filterDatas(value)



}
