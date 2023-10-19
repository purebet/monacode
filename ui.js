function createCell(text, id){
    let output = document.createElement("td");
    output.innerHTML = text;
    output.id = id;
    return output;
}

function createRow(textArr, idArr){ //textArr and idArr are always length 7
    let output = document.createElement("tr");
    for(let i = 0; i < textArr.length; i++){
        output.appendChild(createCell(textArr[i], idArr[i]));
    }
    return output;
}

function topOdds(ob){
    for(let i = 0; i < ob.length; i++){
        if(ob[i].betInfo.isLiquidity){
            return Math.round(ob[i].odds*100)/100;
        }
    }
    return "-";
}

function addMkt(mkt){
    var table = document.getElementById("display");
    let currMktInfo = mktInfos[mkt]; 
    let currOBs = currMktInfo.liquidity;
    let values = []
    if (currOBs.length == 2) {
        values = createRow(
            [
                currMktInfo.name,
                topOdds(currOBs[0].back),
                topOdds(currOBs[0].lay),
                topOdds(currOBs[1].back),
                topOdds(currOBs[1].lay),
            ],
            [
                mkt,
                mkt + "0back",
                mkt + "0lay",
                mkt + "1back",
                mkt + "1lay"
            ]
        )
    }else{
        values = createRow(
            [
                currMktInfo.name,
                topOdds(currOBs[0].back),
                topOdds(currOBs[0].lay),
                topOdds(currOBs[2].back),
                topOdds(currOBs[2].lay),
                topOdds(currOBs[1].back),
                topOdds(currOBs[1].lay)
            ],
            [
                mkt,
                mkt + "0back",
                mkt + "0lay",
                mkt + "2back",
                mkt + "2lay",
                mkt + "1back",
                mkt + "1lay"
            ]
        );
    }
    table.appendChild(values);
}

function display(){
    var msg = document.getElementById("msg");
    msg.innerHTML = "";
    for(let i = 0; i < mkts.length; i++){
        let currMkt = mkts[i];
        addMkt(currMkt);
    }
}

const outIndToSide3 = {
    0:"home",
    2:"away",
    1:"draw"
}
const outIndToSide2 = {
    0:"home",
    1:"away",
}

function update(mkt, outInd, side){
    var msg = document.getElementById("msg");
    let newTopOdds = topOdds(mktInfos[mkt].liquidity[outInd][side]);
    let cell = document.getElementById(mkt + outInd + side);
    cell.innerHTML = newTopOdds;
    let team
    if(mktInfos[mkt].liquidity.length == 2){
        team = outIndToSide2[outInd]
    }else{
        team = outIndToSide3[outInd]
    }
    let newOddsMsg = `Top odds for ${mktInfos[mkt].name} - ${side}ing ${team} changed to ${newTopOdds}.`
    let removedMsg = `Offer removed for ${mktInfos[mkt].name} - ${side}ing ${team}`
    msg.innerHTML = newTopOdds != "-" ? newOddsMsg : removedMsg
    // msg.innerHTML = "top odds changed to " + newTopOdds + 
    //     " for " + mktInfos[mkt].name + 
    //     ", outcome: " + outInd + 
    //     ", side: " + side;

    // Get a reference to the table row using the cell's parentNode property
    let row = cell.parentNode;
    row.classList.add('flashBlue');
    console.log("searched ", mkt, outInd, side, " and updated to show highest with isLiquidity = True");
    row.addEventListener('animationend', function() {
        // Remove the flashBlue class when the animation ends
        row.classList.remove('flashBlue');
    });
}