import "OptionRegistry.sol";
contract OptionsMarket {

  OptionRegistry reg;

  event OrderFilled(uint orderID, uint optionID, address buyer, address writer, string commodity);

  struct Order {
    bool isCall;
    address owner;
    uint orderID;
    string commodity;
    uint quantity;
    uint strikePrice;
    uint orderPrice;
    uint expiration;
    bool isFilled;
  }

  mapping(uint => uint) indices; //Maps order IDs to indices
  mapping(uint => Order) public filledOrders;

  Order[] public callAsks;
  Order[] public callBids;

  Order[] public putAsks;
  Order[] public putBids;

  function OptionsMarket(){
    reg = OptionRegistry(msg.sender);
  }

  function placeOrder(bool isCall, bool isBid, string commodity, uint quantity, uint strikePrice, uint orderPrice, uint expiration, uint uid) returns (uint){
    Order memory order = Order(isCall, msg.sender, uint(sha3(msg.sender,uid)), commodity, quantity, strikePrice, orderPrice, expiration, false);
    if(isBid){
      if(isCall){
        callBids.push(order);
        indices[order.orderID] = callBids.length-1;
      }
      else{
        putBids.push(order);
        indices[order.orderID] = putBids.length-1;
      }
    }
    else{
      //Order memory order = Order(isCall, msg.sender, uint(sha3(msg.sender,uid)), commodity, quantity, strikePrice, orderPrice, expiration);
      if(isCall){
        callAsks.push(order);
        indices[order.orderID] = callAsks.length-1;
      }
      else{
        putAsks.push(order);
        indices[order.orderID] = callAsks.length-1;
      }
    }
    return order.orderID;
  }


  function fillOrder(uint orderID, bool isCall, bool isBid) returns (uint) {
    uint i = indices[orderID];
    Order storage order;
    if(isBid){
      if(isCall){
        order = callBids[i];
      }
      else{
        order = putBids[i];
      }
      return fillBid(order);
    }
    else{
      if(isCall){
        order = callAsks[i];
      }
      else{
        order = putAsks[i];
      }
      return fillAsk(order);
    }
  }

  function fillBid(Order storage order) internal returns (uint) {
    if(order.isFilled) throw;
    reg.transferETH(order.owner, msg.sender, order.orderPrice*order.quantity);
    uint orderType;
    if(!order.isCall) orderType = 1;
    uint optionID = reg.writeOption(msg.sender, order.owner, orderType, order.quantity, order.expiration, order.strikePrice, order.commodity);
    filledOrders[order.orderID] = order;
    OrderFilled(order.orderID, optionID, order.owner, msg.sender, order.commodity);
    order.isFilled = true;
    return optionID;
  }

  function fillAsk(Order storage order) internal returns (uint){
    if(order.isFilled) throw;
    reg.transferETH(msg.sender,order.owner, order.orderPrice*order.quantity);
    uint orderType;
    if(!order.isCall) orderType = 1;
    uint optionID = reg.writeOption(order.owner, msg.sender,  orderType, order.quantity, order.expiration, order.strikePrice, order.commodity);
    filledOrders[order.orderID] = order;
    OrderFilled(order.orderID,  optionID, msg.sender, order.owner, order.commodity);
    order.isFilled = true;
    return optionID;
  }

  function getOrderInfo(uint orderID, bool isCall, bool isBid) returns (address, uint, uint, uint, uint, bool, bool){
    uint i = indices[orderID];
    Order storage order;
    if(isBid){
      if(isCall){
        order = callBids[i];
      }
      else{
        order = putBids[i];
      }
    }
    else{
      if(isCall){
        order = callAsks[i];
      }
      else{
        order = putAsks[i];
      }
    }
    return (order.owner, order.expiration, order.strikePrice, order.orderPrice, order.quantity, order.isCall, order.isFilled);
  }

  function getOrderInfoByIndex(uint i, bool isCall, bool isBid) returns (address, uint, uint, uint, uint, bool, bool){
    Order storage order;
    if(isBid){
      if(isCall){
        order = callBids[i];
      }
      else{
        order = putBids[i];
      }
    }
    else{
      if(isCall){
        order = callAsks[i];
      }
      else{
        order = putAsks[i];
      }
    }
    return (order.owner, order.expiration, order.strikePrice, order.orderPrice, order.quantity, order.isCall, order.isFilled);
  }




}
