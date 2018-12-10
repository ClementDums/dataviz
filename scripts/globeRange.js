



function changeRange(value) {
    let node = document.querySelector('.points');
    console.log(node)
    if(node){
        console.log('ok')
        node.parentNode.removeChild(node);}

    const rangeLabel = document.getElementById("rangeLabel");
    rangeLabel.innerHTML = value;

    value = parseInt(value);
    filterDatas(value)



}
