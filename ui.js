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
    0:"Home",
    2:"Away",
    1:"Draw"
}
const outIndToSide2 = {
    0:"Home",
    1:"Away",
}

function update(mkt, outInd, side){
    var msg = document.getElementById("msg");
    let newTopOdds = topOdds(mktInfos[mkt].liquidity[outInd][side]);
    let cell = document.getElementById(mkt + outInd + side);
    if(cell.innerHTML == newTopOdds){
        return;
    }
    cell.innerHTML = newTopOdds;
    let team
    if(mktInfos[mkt].liquidity.length == 2){
        team = outIndToSide2[outInd]
    }else{
        team = outIndToSide3[outInd]
    }
    let newOddsMsg = `Top odds for ${mktInfos[mkt].name} - ${side}ing ${team} changed to ${newTopOdds}.`
    let removedMsg = `Offer removed for ${mktInfos[mkt].name} - ${side}ing ${team}`
    let message = newTopOdds != "-" ? newOddsMsg : removedMsg
    displayMessage(message)
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

function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
}

function displayMessage(message) {
    var list = document.getElementById('msg');
    var item = document.createElement('li');
    item.classList.add('new-message');
    list.appendChild(item);

    var messageElement = document.createElement('p');
    messageElement.textContent = message;
    item.appendChild(messageElement);

    var timestampElement = document.createElement('p');
    timestampElement.textContent = timeSince(new Date());
    timestampElement.classList.add('timestamp');
    item.appendChild(timestampElement);
    item.setAttribute('data-time', new Date().getTime());

    setInterval(function() {
        timestampElement.textContent = " - " + timeSince(new Date(parseInt(item.getAttribute('data-time'))));
    }, 1000);

    setTimeout(function() {
        list.removeChild(item);
    }, 30000);
}

// function updateTimestamps() {
//     var messages = document.querySelectorAll('#msg li');
//     messages.forEach(function(message) {
//         var time = new Date(parseInt(message.getAttribute('data-time')));
//         var timestamp = message.querySelector('span');
//         if (timestamp) {
//             timestamp.textContent = " - " + timeSince(time);
//         }
//         else {
//             timestamp = document.createElement('span');
//             timestamp.textContent = " - " + timeSince(time);
//             message.appendChild(timestamp);
//         }
//     });
// }

// setInterval(updateTimestamps, 1000);