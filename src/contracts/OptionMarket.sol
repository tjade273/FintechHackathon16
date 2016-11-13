contract OptionsMarket {

  OptionRegistry reg;

  struct Order {
    bool isCall;
    address owner;
    uint orderID;
    string commodity;
    uint quantity;
    uint strikePrice;
    uint orderPrice;
    uint expiration;
  }

  mapping(uint => uint) indices; //Maps order IDs to indices

  Order[] callAsks;
  Order[] callBids;

  Order[] putAsks;
  Order[] putBids;

  function OptionsMarket(){
    reg = OptionRegistry(msg.sender);
  }

  function placeAsk(bool isCall, bool isBid, string commodity, uint quantity, uint strikePrice, uint orderPrice, uint expiration, uint uid) returns (uint){
    if(isBid){
      Order order = Order(isCall, msg.sender, sha3(msg.sender,uid), commodity, quantity, strikePrice, orderPrice, expiration);
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
      Order order = Order(isCall, msg.sender, sha3(msg.sender,uid), commodity, quantity, strikePrice, orderPrice, expiration);
      if(isCall){
        callAsks.push(order);
        indices[order.orderID] = callAsks.length-1;
      }
      else{
        putAsks.push(order);
        indices[order.orderID] = callAsks.length-1;
      }
    }
  }

  function placeBid()

  function fillOrder(uint orderID, isCall, isBid){
    uint i = indices[orderID];
    Order storage order;
    if(isBid){
      if(isCall){
        order = callBids[i];
      }
      else{
        order = putBids[i];
      }
      fillBid(order);
    }
    else{
      if(isCall){
        order = callAsks[i];
      }
      else{
        order = putAsks[i];
      }
      fillAsk(order);
    }
  }

  function fillBid(Order storage order) internal {
    transferETH(order.owner, msg.sender, order.orderPrice);
    registry.writeOption(msg.sender, order.owner, uint(!order.isCall), order.quantity, order.expiration, order.strikePrice, order.commodity);
  }

  function fillAsk(Order storage order) internal {
    transferETH(msg.sender,order.owner, order.orderPrice);
    registry.writeOption(order.owner, msg.sender,  uint(!order.isCall), order.quantity, order.expiration, order.strikePrice, order.commodity);
  }


}
