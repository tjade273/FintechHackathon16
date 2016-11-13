import "Prices.sol";
contract OptionContract{ //Library to manage options
  //Prices priceContract;

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

  function execute(Option storage option, uint marketPrice) internal returns (uint payout){
    if(option.expiration < now) throw;

    uint strikePrice = option.strikePrice;
    if(option.optionType == OptionType.Put){
      if(strikePrice - marketPrice > strikePrice){
         return 0;
      }
      else return strikePrice - marketPrice;
    }
    else if (option.optionType == OptionType.Call){
      if(marketPrice - strikePrice > marketPrice){
        return 0;
      }
      else return marketPrice - strikePrice;
    }
  }
}
