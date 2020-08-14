const { web3 } = require('./getWeb3');

/**
 * Encode methodId with it's parameter.
 * @param {String} methodId to execute.
 * @param {Array} paramType  parameter type. e.g ['uint256'].
 * @param {Array} paramValue paramater value . e.g['23'].
 * @return {String} string represent of encoded hex value.
 */
const encodeMethodIdWithParameters = (methodId, paramType, paramValue) => {
    if (typeof methodId !== 'string') {
        throw new Error("String type is needed.");
    }

    if (!paramType.length || !paramValue.length) {
        throw new Error('Empty parameter provided.');
    }

    if (!Array.isArray(paramType) || !Array.isArray(paramValue)) {
        throw new Error('Supplied parameters should be element of Array');
    }

    const encodedId = web3.eth.abi.encodeFunctionSignature(methodId);
    const encodedParam = web3.eth.abi.encodeParameters(paramType, paramValue);
    const finalResult = encodedId + encodedParam.slice(2, encodedParam.length);

    return finalResult;
};

/**
 * @dev reterive given accounts.
 * @param {String} id of given account.
 * @return {String} string represent fo hex value of 20 bytes.
 */
const getAccounts = async function (id) {
    const accounts = await web3.eth.getAccounts();
    return accounts[id];
};

/**
 *
 * @param {String} methodId method to call.
 * @param {String} mainContractAddress receiver address.
 * @param {Array} paramType list of methods to execute e.g.['uint256', 'String].
 * @param {Array} paramValue arguments for paraType. e.g.['1','hello world I'm corona virus'].
 * @return {String} signed data in hex format.
 */
const getSignedData = async function (methodId, mainContractAddress, paramType, paramValue) {
    // console.log('inside signed data')
    if (typeof methodId !== 'string') {
        throw new Error("String type is needed.");
    }

    let deployData;

    if (!paramType || !paramValue) {
        deployData = await web3.eth.abi.encodeFunctionSignature(methodId);
    } else {
        deployData = encodeMethodIdWithParameters(
            methodId,
            paramType,
            paramValue
        );
    }

    const acc1 = await getAccounts(1);
    const estimatedGasPrice = await web3.eth.getGasPrice();
    const signedData = await web3.eth.signTransaction({
        from: acc1,
        gasPrice: estimatedGasPrice,
        // Incase additional gas is needed than estimated gas
        gas: 8000000,
        to: mainContractAddress,
        value: "",
        data: deployData
    });

    return signedData;
};

const storageLoop = async (contractAddress, from, to) => {
    if(from > to) {
        throw new Error('From range should be lower that traget to range.');
    }

    for(i=from; i<to; i++) {
        const data = await web3.eth.getStorageAt(contractAddress, i);
        console.log(`index: ${i} : ${data}`);
    }
    return true;
};

/**
 * @param {String} payload payload data in hex format.
 * @param {String} contractAddress ethernaut contract address.
 * @param {String} account deployer address.
 * @return {Object} receipt of the transaction.
 */
const sendTransaction = async (payload, contractAddress, account, value = '') => {
    const gasPrice = await web3.eth.getGasPrice();
    return web3.eth.sendTransaction({
        from: account,
        to: contractAddress,
        value: value,
        gas: 8000000,
        gasPrice: gasPrice * 10,
        data: payload
    }).on('transactionHash', function (hash) {
        console.log("txHash", hash);
    });
};

const valueFromLogs = (receipt, logsName) => {
    const value = receipt['logs'][0][logsName];
    return value;
};

const checkLength = (data, check) => {
    if (data.length !== check) {
        throw new Error(`Length should be ${check}`);
    }
    return true;
};

module.exports = {
    encodeMethodIdWithParameters: encodeMethodIdWithParameters,
    getAccounts: getAccounts,
    getSignedData: getSignedData,
    storageLoop: storageLoop,
    sendTransaction: sendTransaction,
    valueFromLogs: valueFromLogs,
    checkLength: checkLength
};
