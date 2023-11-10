require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
const { interface, bytecode } = require('./compile'); // use ABI abd bytecode from compiled contract for deployment  

const { MNEMONIC, INFURA_API } = process.env;

const provider = new HDWalletProvider(
    MNEMONIC, // 1. account mnemonic, 
    INFURA_API // 2. node of ethereum network
); 

const web3 = new Web3(provider); // create a instance of web3 and connect to network using provider (which network and with which account)

async function deploy() {
    const accounts = await web3.eth.getAccounts(); // get accounts addresses from our web3 instance (basically out metamask accounts which we provided by MNEMONIC)

    console.log(`Attempting to deploy from account : ${accounts[0]}`);

    const result = await new web3.eth.Contract(interface) // make a new Contract instance by providing compiled ABI
        .deploy({ data : bytecode }) // deploy contract bytecode and pass initialMessage in constructor function
        .send({ from : accounts[0], gas : '1000000' }); // send transaction for deploying contract from first account in Metamask wallet

    console.log(interface);
    console.log(`Contract deployed to : ${result.options.address}`);

    provider.engine.stop(); // to prevent a hanging deployment
};

deploy();