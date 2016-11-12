var Web3 = require("web3");
var request = require('request');
var autobahn = require("autobahn");
var fs = require("fs");

var wsuri = "wss://api.poloniex.com";

var connection = new autobahn.Connection({
  url: wsuri,
  realm: "realm1"
});

var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var eth = web3.eth;

var lastBTC_INR = 1;
var lastETH_BTC = 0;

var abi = JSON.parse(fs.readFileSync("/home/tjaden/FintechHackathon16/build/FiatPrice.abi"));
var bytecode = fs.readFileSync("/home/tjaden/FintechHackathon16/build/FiatPrice.bin").toString();
//bytecode = '60606040525b33600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c010000000000000000000000009081020402179055505b610286806100516000396000f360606040526000357c0100000000000000000000000000000000000000000000000000000000900480634fb2e45d1461006857806382ab890a146100855780638da5cb5b146100a25780639d1b464a146100e0578063d0b06f5d1461010857610063565b610002565b34610002576100836004808035906020019091905050610130565b005b34610002576100a060048080359060200190919050506101ce565b005b34610002576100b46004805050610243565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34610002576100f26004805050610269565b6040518082815260200191505060405180910390f35b346100025761011a6004805050610272565b6040518082815260200191505060405180910390f35b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561018c57610002565b80600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c010000000000000000000000009081020402179055505b5b50565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561022a57610002565b80600060005081905550426001600050819055505b5b50565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60006000505481565b600060016000505442039050610283565b9056'

var priceContract = eth.contract(abi).new({from:eth.accounts[0], data:bytecode, gas:4700000}, function(err,res){
  if(priceContract.address){
    console.log(priceContract.address)
    connection.open();
  }
});



connection.onopen = function (session) {
        function tickerEvent (args,kwargs) {
          if(args[0] == "BTC_ETH"){
            lastETH_BTC = parseFloat(args[1]);
            console.log("Got price: " + parseFloat(args[1]));
            updateINRPrice();
          }
        }
        session.subscribe('ticker', tickerEvent);
}


connection.onclose = function (){
  console.log("Websocket connection closed");
}


function updateCryptoPrice(){
  console.log("Contract LastUpdate: " + parseInt(priceContract.lastUpdated()));
  if(priceContract.lastUpdated() > 10){
    console.log("Updating price to : " + lastETH_BTC*lastBTC_INR);
    priceContract.update(lastETH_BTC*lastBTC_INR*1000, {from:eth.accounts[0]});
  }
  console.log("Contract Current Price : " + priceContract.currentPrice());
  eth.sendTransaction({from:eth.coinbase});

}

function updateINRPrice(){
  request("https://www.unocoin.com/trade?buy", function(error, response, body){
    if (!error && response.statusCode == 200) {
      lastBTC_INR = parseFloat(body);
      updateCryptoPrice()
    }
  })
}
