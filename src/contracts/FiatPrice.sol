contract FiatPrice {
  uint public currentPrice;
  uint lastUpdate;
  address public owner;

  modifier onlyOwner{
    if(msg.sender != owner)
      throw;
    _;
  }

  function update(uint price) onlyOwner{
    currentPrice = price;
    lastUpdate = now;
  }

  function lastUpdated()constant returns (uint){
    return now - lastUpdate;
  }

  function FiatPrice(){
    owner = msg.sender;
    lastUpdate = now;
  }

  function transferOwner(address _owner) onlyOwner {
    owner = _owner;
  }
}
