pragma solidity ^0.4.4;
import 'dapple/test.sol';
import "OptionRegistry.sol";
import "Prices.sol";
import "OptionMarket.sol";

contract Counterparty {
  OptionsMarket market;
  OptionRegistry reg;
  function Counterparty(address r){
    reg = OptionRegistry(r);
    market = reg.market();
  }

  function fill(uint orderID, bool isCall, bool isBid) returns (uint){
    return market.fillOrder(orderID, isCall, isBid);
  }

  function deposit() payable {
      reg.depositETH.value(3 ether)();
  }
}

contract OptionsTest is Test {
  OptionRegistry reg;
  Prices prices;
  Tester proxy;

  function setUp() {
    prices = new Prices();
    reg = new OptionRegistry(prices);
    proxy = new Tester();
    proxy._target(reg);
    reg.depositETH.value(3 ether)();
  }

  function testDeposit() {
    assertEq(reg.balanceOf(this), 3 ether);
  }

  function testCallBids(){
    prices.update("Corn", 25);
    OptionsMarket market = reg.market();
    Counterparty counter = new Counterparty(reg);
    counter.deposit.value(5 ether)();
    //Place a bid for a call
    uint myBalance = reg.balanceOf(this);
    uint cBalance = reg.balanceOf(counter);
    assertEq(cBalance + counter.balance, 5 ether);
    assertEq(myBalance, 3 ether);

    uint id = market.placeOrder(true, true, "Corn", 10, 20, 5, now-5, 12345);

    assertEq(myBalance, reg.balanceOf(this));

    uint optionID = counter.fill(id,true,true);

    assertEq(myBalance - 10*5, reg.balanceOf(this));
    assertEq(cBalance + 10*5, reg.balanceOf(counter));

    reg.executeOption(optionID);

    assertEq(reg.balanceOf(this), myBalance);
    assertEq(reg.balanceOf(counter), cBalance);
  }

  function testPutBids(){
    prices.update("Corn", 25);
    OptionsMarket market = reg.market();
    Counterparty counter = new Counterparty(reg);
    counter.deposit.value(5 ether)();
    //Place a bid for a put
    uint myBalance = reg.balanceOf(this);
    uint cBalance = reg.balanceOf(counter);
    assertEq(cBalance + counter.balance, 5 ether);
    assertEq(myBalance, 3 ether);

    uint id = market.placeOrder(false, true, "Corn", 10, 30, 5, now-5, 12345);
    assertEq(myBalance, reg.balanceOf(this));
    uint optionID = counter.fill(id,false,true);

    assertEq(myBalance - 10*5, reg.balanceOf(this));
    assertEq(cBalance + 10*5, reg.balanceOf(counter));

    var (buyer,writer,expiration,strikePrice,quantity,optionType) = reg.getOptionInfo(optionID);
    log_address(writer);
    reg.executeOption(optionID);

    assertEq(reg.balanceOf(this), myBalance);
    assertEq(reg.balanceOf(counter), cBalance);
  }

  function testCallAsks(){
    prices.update("Corn", 25);
    OptionsMarket market = reg.market();
    Counterparty counter = new Counterparty(reg);
    counter.deposit.value(5 ether)();
    //Place a bid for a put
    uint myBalance = reg.balanceOf(this);
    uint cBalance = reg.balanceOf(counter);
    assertEq(cBalance + counter.balance, 5 ether);
    assertEq(myBalance, 3 ether);

    uint id = market.placeOrder(true, false, "Corn", 10, 20, 5, now-5, 12345);
    var (, quant, isCall, isFilled) = market.getOrderInfo(id, true, false);
    log_uint(id);
    assertEq(quant,10);
    assertEq(isCall, true);
    assertEq(isFilled, false);
    assertEq(myBalance, reg.balanceOf(this));

    uint optionID = counter.fill(id,true,false);

    assertEq(myBalance + 10*5, reg.balanceOf(this));
    assertEq(cBalance - 10*5, reg.balanceOf(counter));
    //var (buyer,writer,expiration,strikePrice,quantity,optionType) = reg.getOptionInfo(optionID);
    //log_address(writer);
    reg.executeOption(optionID);
    (, quant, isCall, isFilled) = market.getOrderInfo(id, true, false);
    assertEq(isFilled, true);
    assertEq(reg.balanceOf(this), myBalance);
    assertEq(reg.balanceOf(counter), cBalance);
  }

  function testMultipleOrders(){
    prices.update("Corn", 25);
    OptionsMarket market = reg.market();
    Counterparty counter = new Counterparty(reg);
    counter.deposit.value(5 ether)();

    uint myBalance = reg.balanceOf(this);
    uint cBalance = reg.balanceOf(counter);

    uint callAsk1 = market.placeOrder(true, false, "Corn", 10, 20, 5, now-5, 12345);
    uint callAsk2 = market.placeOrder(true, false, "Corn", 10, 15, 5, now-5, 55);
    uint callAsk3 = market.placeOrder(true, false, "Corn", 5, 20, 5, now-5, 63336);
    uint callBid1 = market.placeOrder(true, true, "Corn", 6, 20, 5, now-5, 4566);
    uint callBid2 = market.placeOrder(true, true, "Corn", 10, 20, 6, now-5, 66);
    uint callBid3 = market.placeOrder(true, true, "Corn", 10, 20, 4, now-5, 12);

    counter.fill(callAsk1, true, false);
    counter.fill(callAsk2, true, false);
    counter.fill(callAsk3, true, false);
    counter.fill(callBid1, true, true);
    counter.fill(callBid2, true, true);
    counter.fill(callBid3, true, true);

    var (,isFilled) = market.getOrderInfo(callBid1, true, true);

    assertTrue(isFilled);

    assertEq(reg.balanceOf(counter) - cBalance , 5);
    assertEq(myBalance - reg.balanceOf(this) , 5);
  }

  function testFailDoubleFill(){
    prices.update("Corn", 25);
    OptionsMarket market = reg.market();
    Counterparty counter = new Counterparty(reg);
    counter.deposit.value(5 ether)();

    uint myBalance = reg.balanceOf(this);
    uint cBalance = reg.balanceOf(counter);

    uint callAsk1 = market.placeOrder(true, false, "Corn", 10, 20, 5, now-5, 12345);
    uint callAsk2 = market.placeOrder(true, false, "Corn", 10, 15, 5, now-5, 55);
    uint callAsk3 = market.placeOrder(true, false, "Corn", 5, 20, 5, now-5, 66);
    uint callBid1 = market.placeOrder(true, true, "Corn", 6, 20, 5, now-5, 4566);
    uint callBid2 = market.placeOrder(true, true, "Corn", 10, 20, 6, now-5, 4566);
    uint callBid3 = market.placeOrder(true, true, "Corn", 10, 20, 4, now-5, 4566);

    counter.fill(callAsk1, true, false);
    counter.fill(callAsk2, true, false);
    counter.fill(callAsk3, true, false);
    counter.fill(callBid1, true, true);
    counter.fill(callBid1, true, true);
    counter.fill(callBid3, true, true);

    assertEq(cBalance - reg.balanceOf(counter), 5);
    assertEq(reg.balanceOf(this) - myBalance, 5);
  }
}
