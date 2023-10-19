function api(){
    let call = new XMLHttpRequest();
    call.open("GET", "https://prod.events.api.betdex.com/events", false);
    call.send();
    let resp = JSON.parse(call.responseText);
    let sports = resp.eventCategories;
    for(let i = 0; i < sports.length; i++){
        if(sports[i].id == "HISTORICAL"){
            continue;
        }
        let leagues = sports[i].eventGroup;
        for(let j = 0; j < leagues.length; j++){
            let events = leagues[j].events;
            for(let x = 0; x < events.length; x++){
                let market = events[x].markets[0].marketAccount; //most betdex events only have 1 market
                let name = events[x].eventName;
                mkts.push(market);
                if(events[x].markets[0].outcomes.length == 3){
                    mktInfos[market] = {
                        name: name,
                        liquidity: [
                            {back: [], lay: []},
                            {back: [], lay: []},
                            {back: [], lay: []}
                        ]
                    }
                }else if(events[x].markets[0].outcomes.length == 2){
                    mktInfos[market] = {
                        name: name,
                        liquidity: [
                            {back: [], lay: []},
                            {back: [], lay: []}
                        ]
                    }
                }else{}
            }
        }
    }
}