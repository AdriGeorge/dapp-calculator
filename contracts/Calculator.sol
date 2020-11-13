// SPDX-License-Identifier: MIT

pragma solidity >=0.4.0 <=0.8.0;

contract Calculator {

  function calculate (int256 x, int256 y, string memory operation) public pure returns (int256) {
    int result = 0;
    if (keccak256(abi.encodePacked(operation)) == keccak256(abi.encodePacked("+"))){
      result = x + y;
    }
    if (keccak256(abi.encodePacked(operation)) == keccak256(abi.encodePacked("-"))){
      result = x - y;
    }
    if (keccak256(abi.encodePacked(operation)) == keccak256(abi.encodePacked("/"))){
      require (y != 0, "y is 0!");
      result = x / y;
    }
    if (keccak256(abi.encodePacked(operation)) == keccak256(abi.encodePacked("*"))){
      result = x * y;
    }
      return result;
  }
}