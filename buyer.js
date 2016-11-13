var Web3 = require('web3');
var clear = require('clear');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var eth = web3.eth;

var registryAbi  = [{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"getIssuedOptions","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"executeOption","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdrawEther","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"options","outputs":[{"name":"buyer","type":"address"},{"name":"writer","type":"address"},{"name":"expiration","type":"uint256"},{"name":"strikePrice","type":"uint256"},{"name":"quantity","type":"uint256"},{"name":"commodity","type":"string"},{"name":"optionType","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"strike","type":"uint256"}],"name":"calculateCollateral","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"name":"transferETH","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"user","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"priceFeed","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"market","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"typeID","type":"uint256"},{"name":"quantity","type":"uint256"},{"name":"expiration","type":"uint256"},{"name":"strikePrice","type":"uint256"},{"name":"commodity","type":"string"}],"name":"writeOption","outputs":[{"name":"id","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"INRperETH","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"},{"name":"to","type":"address"}],"name":"transfer","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"getBoughtOptions","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"depositETH","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[{"name":"ID","type":"uint256"}],"name":"getOptionInfo","outputs":[{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"bool"}],"payable":false,"type":"function"},{"inputs":[{"name":"pricefeed","type":"address"}],"type":"constructor"},{"payable":true,"type":"fallback"}];
var registryAddr = "0x32cf1f3a98aeaf57b88b3740875d19912a522c1a";
var marketAbi = [{"constant":false,"inputs":[{"name":"orderID","type":"uint256"},{"name":"isCall","type":"bool"},{"name":"isBid","type":"bool"}],"name":"fillOrder","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"filledOrders","outputs":[{"name":"isCall","type":"bool"},{"name":"owner","type":"address"},{"name":"orderID","type":"uint256"},{"name":"commodity","type":"string"},{"name":"quantity","type":"uint256"},{"name":"strikePrice","type":"uint256"},{"name":"orderPrice","type":"uint256"},{"name":"expiration","type":"uint256"},{"name":"isFilled","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"isCall","type":"bool"},{"name":"isBid","type":"bool"},{"name":"commodity","type":"string"},{"name":"quantity","type":"uint256"},{"name":"strikePrice","type":"uint256"},{"name":"orderPrice","type":"uint256"},{"name":"expiration","type":"uint256"},{"name":"uid","type":"uint256"}],"name":"placeOrder","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"putBids","outputs":[{"name":"isCall","type":"bool"},{"name":"owner","type":"address"},{"name":"orderID","type":"uint256"},{"name":"commodity","type":"string"},{"name":"quantity","type":"uint256"},{"name":"strikePrice","type":"uint256"},{"name":"orderPrice","type":"uint256"},{"name":"expiration","type":"uint256"},{"name":"isFilled","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"callBids","outputs":[{"name":"isCall","type":"bool"},{"name":"owner","type":"address"},{"name":"orderID","type":"uint256"},{"name":"commodity","type":"string"},{"name":"quantity","type":"uint256"},{"name":"strikePrice","type":"uint256"},{"name":"orderPrice","type":"uint256"},{"name":"expiration","type":"uint256"},{"name":"isFilled","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"i","type":"uint256"},{"name":"isCall","type":"bool"},{"name":"isBid","type":"bool"}],"name":"getOrderInfoByIndex","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"bool"},{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"isCall","type":"bool"},{"name":"isBid","type":"bool"}],"name":"getBookSize","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"orderID","type":"uint256"},{"name":"isCall","type":"bool"},{"name":"isBid","type":"bool"}],"name":"getOrderInfo","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"bool"},{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"putAsks","outputs":[{"name":"isCall","type":"bool"},{"name":"owner","type":"address"},{"name":"orderID","type":"uint256"},{"name":"commodity","type":"string"},{"name":"quantity","type":"uint256"},{"name":"strikePrice","type":"uint256"},{"name":"orderPrice","type":"uint256"},{"name":"expiration","type":"uint256"},{"name":"isFilled","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"callAsks","outputs":[{"name":"isCall","type":"bool"},{"name":"owner","type":"address"},{"name":"orderID","type":"uint256"},{"name":"commodity","type":"string"},{"name":"quantity","type":"uint256"},{"name":"strikePrice","type":"uint256"},{"name":"orderPrice","type":"uint256"},{"name":"expiration","type":"uint256"},{"name":"isFilled","type":"bool"}],"payable":false,"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"orderID","type":"uint256"},{"indexed":false,"name":"optionID","type":"uint256"},{"indexed":false,"name":"buyer","type":"address"},{"indexed":false,"name":"writer","type":"address"},{"indexed":false,"name":"commodity","type":"string"}],"name":"OrderFilled","type":"event"}];
var marketAddr = "0xa188fc44ccd557135af22bf1701a5083e6fe06f2";
var priceAbi = [{"constant":false,"inputs":[{"name":"commodity","type":"string"},{"name":"price","type":"uint256"}],"name":"update","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"transferOwner","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"commodity","type":"string"}],"name":"getPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"lastUpdated","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"type":"constructor"}];
var priceAddr = "0xd3aa556287afe63102e5797bfddd2a1e8dbb3ea5";

var registry = eth.contract(registryAbi).at(registryAddr);
var market = eth.contract(marketAbi).at(marketAddr);
var priceFeed = eth.contract(priceAbi).at(priceAddr);

function fetchOrders(isCall, isBid, l){
  var orders = [];
  var len = market.getBookSize(isCall, isBid);
  for(var i = l; i < len; i++){
    var v = market.getOrderInfoByIndex.call(i, isCall, isBid);
    orders.push(v);
  }
  //console.log(orders);
  return orders;
}

var callBids = [];
var callAsks = [];
var putBids = [];
var putAsks = [];

function printState(){
  console.log("Registry Contract: " + registryAddr);
  console.log("Market Contract: " + marketAddr);
  console.log("Price Feed Contract: " + priceAddr);
  console.log("\n\n\n");

   callBids= callBids.concat(fetchOrders(true, true, callBids.length));
   callAsks= callAsks.concat(fetchOrders(true, false, callAsks.length));
   putBids= putBids.concat(fetchOrders(false, true, putBids.length));
   putAsks=putAsks.concat(fetchOrders(true, true, putAsks.length));
  //console.log(callBids);
  //callBids.sort(function(item){return parseInt(item[2])});
  //callAsks.sort(function(item){return -parseInt(item[2])});
  //putBids.sort(function(item){return parseInt(item[2])});
  //putAsks.sort(function(item){return -parseInt(item[2])});
  //console.log(callAsks);
  //console.log(callBids);
  //console.log(callBids[1][2]);
  var s = "";
  s+= "Order Book: \n \n\n";

  s+="    Calls: \n\n";
  s+="        Bids: \n";
  for(var i = 0; i < callBids.length; i++){
    s+="        Strike Price: " + callBids[i][2]+", Bid: "+callBids[i][3]+"\n";
    }
  s+= "\n\n        Asks:\n";
  for(i = 0; i < callAsks.length; i++){
    s+= "        Strike Price: " + callAsks[i][2]+", Ask: "+callAsks[i][3]+"\n";
  }
  clear();
  console.log(s);
}
clear()
printState();
setTimeout(function(){setInterval(printState, 500)}, 6000);

setInterval(function(){
market.placeOrder(true, false, "Cotton", 4, 13, 06, eth.getBlock("latest").timestamp + 15778463, 165467, {from:eth.coinbase, gas:4700000});
market.placeOrder(true, true, "Cotton", 4, 13, 06, eth.getBlock("latest").timestamp + 15778463, 165467, {from:eth.coinbase, gas:4700000});
market.placeOrder(true, false, "Cotton", 4, 13, 06, eth.getBlock("latest").timestamp + 15778463, 165467, {from:eth.coinbase, gas:4700000});
market.placeOrder(true, true, "Cotton", 4, 13, 06, eth.getBlock("latest").timestamp + 15778463, 165467, {from:eth.coinbase, gas:4700000});
market.placeOrder(true, false, "Cotton", 4, 13, 06, eth.getBlock("latest").timestamp + 15778463, 165467, {from:eth.coinbase, gas:4700000});
callAsks = callAsks.slice(-5);
callBids = callBids.slice(-3);
},100)
