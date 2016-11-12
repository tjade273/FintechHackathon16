contract Prices {
  uint public currentPrice;
  uint lastUpdate;
  address public owner;

  mapping(string => uint) prices;

  modifier onlyOwner{
    if(msg.sender != owner)
      throw;
    _;
  }

  function updateFiat(uint price) onlyOwner{
    currentPrice = price;
    lastUpdate = now;
  }

  function updateCommodity(string commodity, uint price) onlyOwner{
    prices[commodity] = price;
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
