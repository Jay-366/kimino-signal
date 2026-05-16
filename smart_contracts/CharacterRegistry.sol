// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CharacterRegistry is ERC721URIStorage, Ownable {
    // State Variable: unsigned 256-bit integer acting as an auto-incrementing tracker.
    uint256 private _currentTokenId;

    constructor() ERC721("CharacterRegistry", "CHAR") Ownable(msg.sender) {}

    // Executes the minting loop, safely mints to student's address, and sets IPFS URI.
    function registerCharacter(address to, string memory ipfsURI) public {
        _currentTokenId++;
        uint256 newId = _currentTokenId;
        
        _safeMint(to, newId);
        _setTokenURI(newId, ipfsURI);
    }
}
