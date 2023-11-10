// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0; // solidity version

contract Lottery { // contract
    address public manager; // owner address
    address[] public players; // list of players addresses

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > .01 ether); // require to pay more than .01 ether

        players.push(msg.sender); // push address of person who calling enter() in players array
    }

    function random() private view returns(uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
        // returns a random hexadecimal and convert it to number (uint)
    }

    function pickWinner() public restricted {
       uint index = random() % players.length; // get an index of winner
       payable(players[index]).transfer(address(this).balance); 
       // mark as payable to someone :
       // players[index] get an address of winner by index
       // transfer => send winner money
       // (this) is reference to current contract address

        // reset contract state
        // empty list of players
        players = new address[](0); 
        // new address - creates new dynamic array of type address 
        // (0) after creation of new array of addresses we want to have an inital size of 0
        // lastly, redefine our old players array to this (empty array of addresses)
    }

    modifier restricted() {
        require(msg.sender == manager); // add this to function where you call modifier
        _; // just keep the other parts of function same
    }

    function getPlayers() public view returns(address[] memory) {
        return players;
    }
}