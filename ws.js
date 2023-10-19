function isFullyMatched(data){
    //see if status is matched
    let orderStatusStart = 8 + 32 + 32 + 2 + 1;
    //matched is 1, spread over 2 bytes is 1, 0
    return data[orderStatusStart] == 1 && data[orderStatusStart + 1] == 0;
}

class Bet {
    constructor(acc, mkt, outcomeInd, side){
        this.acc = acc;
        this.mkt = mkt;
        this.outcomeInd = outcomeInd;
        this.side = side;
        this.isLiquidity = true;
        this.subId = connection.onAccountChange(new solanaWeb3.PublicKey(acc), this.decide.bind(this));
    }
    decide(accInfo, context){
        console.log("update to bet acc " + this.acc);
        //check for fully matched bet or canceled bet
        if(accInfo.lamports == 0 || isFullyMatched(accInfo.data)){
            this.deleteBet();
        }
        //in the future check for partially matched bet
    }
    deleteBet(){
        this.isLiquidity = false;
        //turn off subscription id
        connection.removeAccountChangeListener(this.subId);
        bets.delete(this.acc);
        //update ui
        //mktInfos[this.mkt][this.outcomeInd][this.side]
        update(this.mkt, this.outcomeInd, this.side);
        console.log("UI is updated to skip bet: " + this.acc);
    }
}

function betToLiquidity(bet, acc){
    // var invOdds = bet.expectedPrice / (bet.expectedPrice - 1);
    // var odds = bet.forOutcome ? invOdds : bet.expectedPrice;
    // var invStake = bet.stake * (bet.expectedPrice - 1);
    // var stake = bet.forOutcome ? invStake : bet.stake;
    return {
        betInfo: new Bet(acc, bet.market, bet.marketOutcomeIndex, bet.forOutcome ? "lay" : "back"),
        stake: bet.stake,
        acc: acc,
        odds: bet.expectedPrice
    };
}

function progAccHandler(payload, context){
    let addr = payload.accountId.toBase58();
    if(bets.has(addr)){
        return; //this doesnt handle updates, the onAccountChange handles updates
    }
    let accInfo = payload.accountInfo;
    let data = accInfo.data;
    let bet = parseOpen(data.slice(40, 40 + 32 + 2 + 1 + 2 + 8 + 8 + 8));
    let obEntry = betToLiquidity(bet, addr);
    let {mkt, outcomeInd, side} = obEntry.betInfo;
    if(mktsToSkip.has(mkt)){
        return; //markets with more than 3 outcome inds are skipped
    }
    if(mktInfos[mkt] == null){
        return;
        /*
        mktInfos[mkt] = {
            name: mkt,
            liquidity: [
                {back: [], lay: []},
                {back: [], lay: []},
                {back: [], lay: []}
            ]
        }
        addMkt(mkt);
        */
    }
    mktInfos[mkt].liquidity[outcomeInd][side].push(obEntry);
    mktInfos[mkt].liquidity[outcomeInd][side].sort((a, b) => b.odds - a.odds);
    update(mkt, outcomeInd, side);
}