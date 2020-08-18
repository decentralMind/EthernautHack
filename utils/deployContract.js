const { web3 } = require('./getWeb3');
const path = require('path');
var fs = require('fs');
var solc = require('solc');

const compileContractCode = function (fileLocation, fileName, fileExtension) {
    const fileNameWithExtension = fileName + fileExtension;
    const filePath = path.join(fileLocation, fileNameWithExtension);
    console.log('filepath', filePath);
    const input = {
        language: 'Solidity',
        sources: {
            [fileNameWithExtension] : {
                content: fs.readFileSync(filePath, 'utf8')
            }
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    const compiledBytes = output.contracts[fileNameWithExtension][fileName].evm.bytecode.object;
    const abi = output.contracts[fileNameWithExtension][fileName].abi;

    return {
        abi: abi,
        compiledBytes: compiledBytes
    };
};

const deployContract = async function (account, fileLocation, fileName, fileExtension, arguments= '', value='') {
    // const filePath = path.join(fileLocation, fileName);
    const contractData = compileContractCode(fileLocation, fileName, fileExtension);
    const myContract = new web3.eth.Contract(contractData.abi);
    const currentGasPrice = await web3.eth.getGasPrice();

    if(arguments) {
      if(!Array.isArray(arguments)) {
        throw new Error('Argumetns must be array type');
      }
    }

    const deployData = await myContract.deploy({
        arguments: arguments,
        data: '0x' + contractData.compiledBytes
    }).send({
        from: account,
        gas: 4000000,
        gasPrice: currentGasPrice,
        value: value
    }).on('transactionHash', function (hash) {
        console.log('hash', hash);
    });

    return deployData;
};

module.exports = {
    compileContractCode: compileContractCode,
    deployContract: deployContract
};
