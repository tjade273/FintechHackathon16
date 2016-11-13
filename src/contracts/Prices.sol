contract Prices {
  uint lastUpdate;
  address public owner;

  mapping(string => uint) prices;

  modifier onlyOwner{
    if(msg.sender != owner)
      throw;
    _;
  }

  function update(string commodity, uint price) onlyOwner{
    prices[commodity] = price;
    lastUpdate = now;
  }

  function getPrice(string commodity) constant returns (uint){
    return prices[commodity];
  }

  function lastUpdated()constant returns (uint){
    return now - lastUpdate;
  }

  function Prices(){
    owner = msg.sender;
    lastUpdate = now;
  }

  function transferOwner(address _owner) onlyOwner {
    owner = _owner;
  }
}
