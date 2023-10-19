var bets = new Set([]);
var mktInfos = {}; //need market addrs --> name, list of outcome ids
var mkts = [];
var mktsToSkip = new Set([]);
var connection = new solanaWeb3.Connection("https://evocative-cosmopolitan-sunset.solana-mainnet.quiknode.pro/a4ed38ac241d30e8bc92f1bd77599be187c6e267/");
var monaco = new solanaWeb3.PublicKey("monacoUXKtUi6vKsQwaLyxmXKSievfNWEcYXTgkbCih");

function lilEndInt(arr){
    var output = 0;
    for(var p = 0; p < arr.length; p++){
        output = output + arr[p] * 256**p;
    }
    return output;
}
function pkb58(arr){
    return new solanaWeb3.PublicKey(arr).toBase58();
}
function revFloat(data){
    // Create a buffer
    var buf = new ArrayBuffer(8);
    // Create a data view of it
    var view = new DataView(buf);
    // set bytes
    data.forEach(function (b, i) {
        view.setUint8(i, b);
    });
    // Read the bits as a float/native 64-bit double
    var num = view.getFloat64(0, true);
    // Done
    return num;
}
function parseOpen(accData){
    //first 32 is market
    var market = accData.slice(0, 32);
    //next 2 bytes are marketOutcomeIndex
    var marketOutcomeIndex = accData.slice(32, 34);
    //next byte is forOutcome
    var forOutcome = accData[34] == 0 ? false : true;
    //status is always open in parseOpen()
    //var status = accData.slice(35, 37);
    //var product = new solanaWeb3.PublicKey(accData.slice(37, 69)).toBase58();
    var stake = accData.slice(37, 45); //if the status is Open, stake - voidedStake = stakeUnmatched
    var voided = accData.slice(45, 53);
    var expectedPrice = accData.slice(53, 61);
    
    return {
        market: pkb58(market),
        marketOutcomeIndex: lilEndInt(marketOutcomeIndex),
        forOutcome: forOutcome,
        stake: (lilEndInt(stake) - lilEndInt(voided)) / 1000000,
        expectedPrice: revFloat(expectedPrice)
    };
}
function parseMatched(accData){
    //first 32 is market
    var market = accData.slice(0, 32);
    //next 2 bytes are marketOutcomeIndex
    var marketOutcomeIndex = accData.slice(32, 34);
    //next byte is forOutcome
    var forOutcome = accData[34] == 0 ? false : true;
    //skip status and product
    var expectedPrice = accData.slice(53, 61);
    var stakeUnmatched = accData.slice(77, 85);

    return {
        market: pkb58(market),
        marketOutcomeIndex: lilEndInt(marketOutcomeIndex),
        forOutcome: forOutcome,
        stake: lilEndInt(stakeUnmatched) / 1000000,
        expectedPrice: revFloat(expectedPrice)
    };
}
