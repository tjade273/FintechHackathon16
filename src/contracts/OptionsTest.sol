pragma solidity ^0.4.4;
import 'dapple/test.sol';
import "OptionRegistry.sol";
import "Prices.sol";

/*contract Buyer {
  OptionRegistry reg;

  function Buyer(address r){
    reg = OptionRegistry(r);
  }

  function execute(uint id){
    reg.executeOption(id)
  }
}
*/
contract OptionsTest is Test {
  OptionRegistry reg;
  Prices prices;
  Tester proxy;

  function setUp(){
    prices = new Prices();
    reg = new OptionRegistry(prices);
    proxy = new Tester();
    proxy._target(reg);
    reg.depositETH.value(3 ether)();
  }

  function testDeposit(){
    assertEq(reg.balanceOf(this), 3 ether);
  }

  function testCreateNewOption(){
    uint id = reg.writeOption(this, 0, 10, now + 60, 20, "Corn");
    log_named_uint("Created ID: ", id);
  }

  function testExecute(){
      prices.update("Corn", 25);
      address buyer = address(0x1234);
      uint id = reg.writeOption(buyer, 0, 10, now - 10, 20, "Corn");
      reg.executeOption(id);
      assertEq(reg.balanceOf(buyer), 5);
  }
}
