const { web3 } = require('./getWeb3');
const path = require('path');

const compileContractCode = function (fileLocation, fileName, fileExtension) {
    const fileNameWithExtension = fileName + fileExtension;
    const filePath = path.join(fileLocation, fileNameWithExtension);
    const input = {
        language: 'Solidity',
        sources: {
            fileNameWithExtension : {
                //This is bad way, change it.
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
    const abi = output.contracts[fileNameWithExtension][fileName].abi;
    const compiledBytes = output.contracts[fileNameWithExtension][fileName].evm.bytecode.object;

    return {
        abi: abi,
        compiledBytes: compiledBytes
    }
}



// const deployToRopsten = async function (fileLocaton, fileName) {
//     const contractData = compileContractCode(filePath);
//     const myContract = new web3.eth.Contract(contractData.abi);
//     const currentGasPrice = await web3.eth.getGasPrice();

//     console.log('gas price', currentGasPrice);

//     const estimatedGas = await web3.eth.estimateGas({ data: '0x' + contractData.compiledBytes });

//     console.log('estimated gas', estimatedGas);

//     const deployData = await myContract.deploy({
//         data: '0x' + contractData.compiledBytes
//     }).send({
//         from: acc1,
//         gas: estimatedGas + 100000,
//         gasPrice: currentGasPrice,
//     }).on('transactionHash', function (hash) {
//         console.log('hash', hash);
//     });

//     return deployData;
// }

// deployToRopsten();


module.exports = {
    compileContractCode: compileContractCode
}