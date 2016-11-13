var Web3 = require('web3');
var fs = require("fs");

var web3 = new Web3( new Web3.providers.HttpProvider("http://localhost:8545"));
var eth = web3.eth;

var priceAbi = JSON.parse(fs.readFileSync("/home/tjaden/FintechHackathon16/build/Prices.abi"));
var priceBytecode = fs.readFileSync("/home/tjaden/FintechHackathon16/build/Prices.bin").toString();

var priceContract = eth.contract(priceAbi).new({from:eth.accounts[1], data:priceBytecode, gas:4700000},function(err, res){
  if(res.address){
    console.log("Price: " +res.address);
  }
});


var regAbi=  JSON.parse(fs.readFileSync("/home/tjaden/FintechHackathon16/build/OptionRegistry.abi"));
var bytecode = fs.readFileSync("/home/tjaden/FintechHackathon16/build/OptionRegistry.bin").toString();

var registryContract = eth.contract(regAbi).new({from:eth.accounts[1], data:bytecode, gas:4700000}, function(err, res){
  if(res.address){
    console.log("Registry: " +res.address);
    console.log("Market: " + res.market());
  }
});
