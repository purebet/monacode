async function liquidity(){
    var raw = await connection.getProgramAccounts(monaco, onlyOpenOrders);
    for(var x = 0; x < raw.length; x++){
        let acc = raw[x].pubkey.toBase58();
        var currBet = parseOpen(raw[x].account.data);
        if(currBet.marketOutcomeIndex > 2){ //for further optimization, delete currBet.market from output when this is encountered?
            mktsToSkip.add(currBet.market);
            continue;
        }
        let obData = betToLiquidity(currBet, acc);
        let {mkt, outcomeInd, side} = obData.betInfo;
        if(mktInfos[mkt] == null){
            continue;
        }
        bets.add(acc);
        mktInfos[mkt].liquidity[outcomeInd][side].push(obData);
        //console.log(raw[x].pubkey.toBase58());
    }
    //need another loop here with more functions to process partial match orders
    var matched = await connection.getProgramAccounts(monaco, matchedOrders);
    for(var i = 0; i < matched.length; i++){
        let acc = matched[i].pubkey.toBase58();
        var currBet = parseMatched(matched[i].account.data);
        if(currBet.marketOutcomeIndex > 2){ //for further optimization, delete currBet.market from output when this is encountered?
            mktsToSkip.add(currBet.market);
            continue;
        }
        if(currBet.stake == 0){ 
            continue;
        }
        let obData = betToLiquidity(currBet, acc);
        let {mkt, outcomeInd, side} = obData.betInfo;
        if(mktInfos[mkt] == null){
            continue;
        }
        bets.add(acc);
        mktInfos[mkt].liquidity[outcomeInd][side].push(obData);
        //console.log(pkb58(matched[i].pubkey));
        //console.log(obData);
    }
    for(let m in mkts){
        var currMkt = mkts[m];
        // var mois = [0, 1, 2]; //go through all mkt out inds, even though non ftr will only have 2 
        for(let x = 0; x<mktInfos[currMkt].liquidity; x++){
            mktInfos[currMkt].liquidity[x].back.sort((a, b) => b.odds - a.odds);
            mktInfos[currMkt].liquidity[x].lay.sort((a, b) => a.odds - b.odds);
        }
    }
    display();
}