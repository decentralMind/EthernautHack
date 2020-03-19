require('dotenv').config()
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require('web3');
const mnemonic = process.env.SEED12;
// Infura ropsten end point.
const endPoint = 'https://' + process.env.ROPSTEN;

/**
 * @dev Initialise Web3.
 */
const getWeb3 = () => {
  const web3 =  new Web3(new HDWalletProvider(mnemonic, endPoint));
  if(!web3) {
    throw new Error('Problem initializing web3');
  }
  return web3;
}

module.exports= {
  web3 : getWeb3()
} 
