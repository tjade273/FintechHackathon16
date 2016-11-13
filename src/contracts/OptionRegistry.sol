pragma solidity ^0.4.4;
import "./Prices.sol";
import "./OptionMarket.sol";

contract OptionRegistry{

  Prices priceFeed;


    enum OptionType{Put, Call}

    struct Option{
      address buyer;
      address writer;

      uint expiration;
      uint strikePrice;

      uint quantity;

      string commodity;
      OptionType optionType;
    }

    function transfer(Option storage option, address to) internal{
      if(msg.sender != option.buyer) throw;
      option.buyer = to;
    }


  struct User{
    address addr;
    uint balance;
    uint boundCollateral;
    uint[] ownedIDs;
    uint[] issuedIds;
  }

  mapping(uint => Option) options;
  mapping(uint => OptionType) typeIDs;

  mapping(address => User) users;

  OptionsMarket public market = new OptionsMarket();

  uint nonce;


  modifier onlyMarket{
    if(msg.sender != address(market)) throw;
    _;
  }

  function writeOption(address from, address to, uint typeID, uint quantity, uint expiration, uint strikePrice, string commodity) onlyMarket returns (uint id){
    id = uint(sha3(from, nonce++));
    Option option = options[id];
    if(option.writer != address(0)) throw;
    User user = users[from];

    //Create  new option
    option.buyer = to;
    option.writer = from;

    option.expiration = expiration;
    option.quantity = quantity;
    option.strikePrice = strikePrice;
    option.commodity = commodity;
    option.optionType = typeIDs[typeID];

    user.issuedIds.push(id);
    users[to].ownedIDs.push(id);
    user.boundCollateral += calculateCollateral(strikePrice);
    if(user.boundCollateral > user.balance) throw;
  }

  function calculateCollateral(uint strike) returns (uint){
    return strike;
  }


  function executeOption(uint id){
    Option option = options[id];
    uint payout = execute(id, priceFeed.getPrice(option.commodity));
    User writer  = users[option.writer];

    writer.balance -= payout;
    writer.boundCollateral -= payout;

    User buyer = users[option.buyer];
    buyer.balance += payout;
  }



  function withdrawEther(uint amount){
    User user = users[msg.sender];
    if(user.balance - user.boundCollateral > amount) throw;
    user.balance -= amount;
    if(!msg.sender.send(amount)) throw;
  }

  function balanceOf(address user) returns (uint){
    return users[user].balance;
  }

  function transfer(uint id, address to) {
    Option option = options[id];
    if(msg.sender != option.buyer) throw;
    option.buyer = to;
  }

  function execute(uint id, uint marketPrice) internal returns (uint payout){
    Option option = options[id];
    if(option.expiration > now) throw;

    uint strikePrice = option.strikePrice;
    if(option.optionType == OptionType.Put){
      if(strikePrice - marketPrice > strikePrice){
         return 0;
      }
      else return (strikePrice - marketPrice)*option.quantity;
    }
    else if (option.optionType == OptionType.Call){
      if(marketPrice - strikePrice > marketPrice){
        return 0;
      }
      else return (marketPrice - strikePrice)*option.quantity;
    }
  }

  function transferETH(address from, address to, uint amount) onlyMarket {
    User f = users[from];
    User t = users[to];

    if(f.balance - f.boundCollateral < amount) throw;

    f.balance -= amount;
    t.balance += amount;
  }

  function depositETH() payable {
    users[msg.sender].balance += msg.value;
  }

  function OptionRegistry(address pricefeed){
    typeIDs[0] = OptionType.Call;
    typeIDs[1] = OptionType.Put;
    priceFeed  = Prices(pricefeed);
  }

  function getOptionInfo(uint ID) constant returns (address, address, uint, uint, uint, bool){
    Option option = options[ID];
    return (option.buyer,option.writer,option.expiration,option.strikePrice, option.quantity, option.optionType == OptionType.Call);
  }
}
