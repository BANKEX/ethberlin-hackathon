pragma solidity ^0.4.24;

import { Pairing, Verifier } from './contract.col';


contract TrustedResource {
    
    uint[] public trustedInput;
    uint[] public challengingInput;
    bytes32 public challengingHash;
    address public challengingAuthor;
    uint256 public minValue;
    uint256 public challengeTime;
    Verifier public verifier;

    mapping(address => uint256) public balances;
    mapping(address => uint256) public lastSumbitted;
    uint256 public lastSumbittedOfAll;

    event ChallengeWon();
    event Sumbmitted(
        uint[2] a,
        uint[2] a_p,
        uint[2][2] b,
        uint[2] b_p,
        uint[2] c,
        uint[2] c_p,
        uint[2] h,
        uint[2] k,
        uint[] input
    );

    constructor(Verifier _verifier, uint256 _minValue, uint256 _challengeTime) public {
        verifier = _verifier;
        minValue = _minValue;
        challengeTime = _challengeTime;
    }

    function submit(
        uint[2] a,
        uint[2] a_p,
        uint[2][2] b,
        uint[2] b_p,
        uint[2] c,
        uint[2] c_p,
        uint[2] h,
        uint[2] k,
        uint[] input
    ) public payable {
        balances[msg.sender] += msg.value;
        require(balances[msg.sender] >= minValue, "submit: not enought value stacked");
        require(now - lastSumbittedOfAll >= challengeTime, "submit: wait until challenge period expired");

        trustedInput = challengingInput;
        challengingInput = input;
        challengingHash = keccak256(abi.encodePacked(a, a_p, b, b_p, c, c_p, h, k, input));
        challengingAuthor = msg.sender;

        emit Sumbmitted(a, a_p, b, b_p, c, c_p, h, k, input);
    }

    function withdraw() public {
        require(now - lastSumbitted[msg.sender] >= challengeTime, "withdraw: wait until challenge period expired");

        uint256 value = balances[msg.sender];
        balances[msg.sender] = 0;
        msg.sender.transfer(value);
    }

    function challenge(
        uint[2] a,
        uint[2] a_p,
        uint[2][2] b,
        uint[2] b_p,
        uint[2] c,
        uint[2] c_p,
        uint[2] h,
        uint[2] k,
        uint[] input
    ) public {
        bytes32 hash = keccak256(abi.encodePacked(a, a_p, b, b_p, c, c_p, h, k, input));
        require(hash == challengingHash, "challenge: arguments hash did not match");
        require(!verifier.verifyTx(a, a_p, b, b_p, c, c_p, h, k, input), "challenge: you lose");

        uint256 reward = balances[challengingAuthor] / 2;
        msg.sender.transfer(reward);
        address(0).transfer(balances[challengingAuthor] - reward); // Burn half to prevent self-challenging
        balances[challengingAuthor] = 0;

        emit ChallengeWon();
    }
}
