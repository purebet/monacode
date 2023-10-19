var isOrder = {//order discriminator
    memcmp: {
        bytes: "PXZJQQ2HEmx",
        offset: 0
    }
};
var openOrder = {//open order
    memcmp: {
        bytes: "11",
        offset: 8 + 32 + 32 + 2 + 1
    }
};
var orderSize = {//orders should be 205 bytes in length
    dataSize: 205
};
var noProductKey = {//need to make sure last 32 bytes are blank, this is the unused product key. 
    //If the product key is present it might mess things up
    //if the code suddenly shows nothing one day, check this first
    memcmp: {
        bytes: '11111111111111111111111111111111',
        offset: 205 - 32
    }
};
var matchedOrder = {
    memcmp: {
        bytes: "5R",
        offset: 8 + 32 + 32 + 2 + 1
    }
};
var matchedOrders = {
    //dataSlice must include market, marketOutcomeIndex, forOutcome, orderStatus, stake, void, expectedPrice, placedAt, delay, stakeUnmatched
    //orderStatus, stake, void, placedAt, delay won't be used
    dataSlice: {
        length: 32 + 2 + 1 + 2 + 8 + 8 + 8 + 8 + 8 + 8,
        offset: 40
    },
    filters: [isOrder, matchedOrder, orderSize, noProductKey]

};
var onlyOpenOrders = {
    //dataSlice must include market, marketOutcomeIndex, forOutcome, orderStatus, stake, void, expectedPrice
    // orderStatus won't be used because status is guaranteed to be open
    dataSlice: {
        length: 32 + 2 + 1 + 2 + 8 + 8 + 8,
        offset: 40
    },
    filters: [isOrder, openOrder, orderSize, noProductKey]
};