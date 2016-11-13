var Web3 = require('web3');
var fs = require("fs");

var web3 = new Web3( new Web3.providers.HttpProvider("http://localhost:8545"));
var eth = web3.eth;

var priceAbi = JSON.parse(fs.readFileSync("/home/tjaden/FintechHackathon16/build/Prices.abi"));
var priceBytecode = fs.readFileSync("/home/tjaden/FintechHackathon16/build/Prices.bin").toString();

var registry;
var regAbi=  JSON.parse(fs.readFileSync("/home/tjaden/FintechHackathon16/build/OptionRegistry.abi"));
var bytecode = fs.readFileSync("/home/tjaden/FintechHackathon16/build/OptionRegistry.bin").toString();
var marketAbi = JSON.parse(fs.readFileSync("/home/tjaden/FintechHackathon16/build/OptionsMarket.abi"));

var market;

var priceContract = eth.contract(priceAbi).new({from:eth.accounts[1], data:priceBytecode, gas:4700000},function(err, res){
  if(res.address){
    console.log("Price: " +res.address);
    registry = eth.contract(regAbi).new(res.address, {from:eth.accounts[1], data:bytecode, gas:4700000}, function(err, r){
      if(r.address){
        console.log("Registry: " +r.address);
        console.log("Market: " + r.market());
        console.log(r.priceFeed());
        market = eth.contract(marketAbi).at(r.market().toString());
        addAsks(r);
      }
    });
  }
});






function addAsks(r){
  eth.sendTransaction({from:eth.coinbase, to:r.address, value:web3.toWei(1,"ether"), gas:1000000});
  setTimeout(submitAsks, 100);
}

function submitAsks(){
  market.placeOrder(true, false, "Cotton", 4, 13, 06, eth.getBlock("latest").timestamp + 15778463, 165467, {from:eth.coinbase, gas:4700000});
  market.placeOrder(true, false, "Cotton", 4, 12, 15, eth.getBlock("latest").timestamp + 15778463, 1654674, {from:eth.coinbase, gas:4700000});
  market.placeOrder(true, false, "Cotton", 3, 11, 35, eth.getBlock("latest").timestamp + 15778463, 16546746, {from:eth.coinbase, gas:4700000});
  market.placeOrder(true, false, "Cotton", 20, 10, 15, eth.getBlock("latest").timestamp + 15778463, 129, {from:eth.coinbase, gas:4700000});
  market.placeOrder(true, false, "Cotton", 25, 9, 165, eth.getBlock("latest").timestamp + 15778463, 12399, {from:eth.coinbase, gas:4700000});
  market.placeOrder(true, false, "Cotton", 4, 13, 06, eth.getBlock("latest").timestamp + 15778463, 123784, {from:eth.coinbase, gas:4700000});
  market.placeOrder(true, false, "Cotton", 4, 12, 15, eth.getBlock("latest").timestamp + 15778463, 12346, {from:eth.coinbase, gas:4700000});
  market.placeOrder(true, false, "Cotton", 3, 11, 35, eth.getBlock("latest").timestamp + 15778463, 1234679, {from:eth.coinbase, gas:4700000});
  market.placeOrder(true, false, "Cotton", 20, 10, 15, eth.getBlock("latest").timestamp + 15778463, 7, {from:eth.coinbase, gas:4700000});
  market.placeOrder(true, false, "Cotton", 25, 9, 165, eth.getBlock("latest").timestamp + 15778463, 76, {from:eth.coinbase, gas:4700000});
  market.placeOrder(true, false, "Onion", 4, 21, 189, eth.getBlock("latest").timestamp + 15778463, 767, {from:eth.coinbase, gas:4700000});
  market.placeOrder(true, false, "Onion", 4, 22, 89, eth.getBlock("latest").timestamp + 15778463, 7676, {from:eth.coinbase, gas:4700000});
  market.placeOrder(true, false, "Onion", 3, 23, 49, eth.getBlock("latest").timestamp + 15778463, 76767, {from:eth.coinbase, gas:4700000});
  market.placeOrder(true, false, "Onion", 20, 24, 30, eth.getBlock("latest").timestamp + 15778463, 767676, {from:eth.coinbase, gas:4700000});
  market.placeOrder(true, false, "Onion", 25, 25, 20, eth.getBlock("latest").timestamp + 15778463, 7, {from:eth.coinbase, gas:4700000});
  market.placeOrder(true, false, "Onion", 4, 21, 189, eth.getBlock("latest").timestamp + 15778463, 767676, {from:eth.coinbase, gas:4700000});
  market.placeOrder(true, false, "Onion", 4, 22, 89, eth.getBlock("latest").timestamp + 15778463, 7676766, {from:eth.coinbase, gas:4700000});
  market.placeOrder(false, false, "Cotton", 4, 7, 10, eth.getBlock("latest").timestamp + 15778463, 76767666, {from:eth.coinbase, gas:4700000});
  market.placeOrder(false, false, "Cotton", 4, 8, 15, eth.getBlock("latest").timestamp + 15778463, 767676666, {from:eth.coinbase, gas:4700000});
  market.placeOrder(false, false, "Cotton", 3, 9, 35, eth.getBlock("latest").timestamp + 15778463, 3, {from:eth.coinbase, gas:4700000});
  market.placeOrder(false, false, "Cotton", 20, 10, 65, eth.getBlock("latest").timestamp + 15778463, 33, {from:eth.coinbase, gas:4700000});
  market.placeOrder(false, false, "Cotton", 25, 11, 165, eth.getBlock("latest").timestamp + 15778463, 34, {from:eth.coinbase, gas:4700000});
  market.placeOrder(false, false, "Cotton", 4, 13, 06, eth.getBlock("latest").timestamp + 15778463, 344, {from:eth.coinbase, gas:4700000});
  market.placeOrder(false, false, "Cotton", 4, 12, 15, eth.getBlock("latest").timestamp + 15778463, 3445, {from:eth.coinbase, gas:4700000});
  market.placeOrder(false, false, "Cotton", 3, 11, 35, eth.getBlock("latest").timestamp + 15778463, 34453, {from:eth.coinbase, gas:4700000});
  market.placeOrder(false, false, "Cotton", 20, 10, 15, eth.getBlock("latest").timestamp + 15778463, 344536, {from:eth.coinbase, gas:4700000});
  market.placeOrder(false, false, "Cotton", 25, 9, 165, eth.getBlock("latest").timestamp + 15778463, 3445367, {from:eth.coinbase, gas:4700000});
  market.placeOrder(false, false, "Onion", 4, 19, 20, eth.getBlock("latest").timestamp + 15778463, 34453673, {from:eth.coinbase, gas:4700000});
  market.placeOrder(false, false, "Onion", 4, 20, 30, eth.getBlock("latest").timestamp + 15778463, 344536732, {from:eth.coinbase, gas:4700000});
  market.placeOrder(false, false, "Onion", 3, 21, 49, eth.getBlock("latest").timestamp + 15778463, 12, {from:eth.coinbase, gas:4700000});
  market.placeOrder(false, false, "Onion", 20, 22, 89, eth.getBlock("latest").timestamp + 15778463, 16, {from:eth.coinbase, gas:4700000});
  market.placeOrder(false, false, "Onion", 25, 23, 189, eth.getBlock("latest").timestamp + 15778463, 165, {from:eth.coinbase, gas:4700000});
  market.placeOrder(false, false, "Onion", 4, 19, 20, eth.getBlock("latest").timestamp + 15778463, 1654, {from:eth.coinbase, gas:4700000});
  market.placeOrder(false, false, "Onion", 4, 20, 30, eth.getBlock("latest").timestamp + 15778463, 16546, {from:eth.coinbase, gas:4700000});
}
