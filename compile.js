const path = require('path'); // help us build a path over to Lottery.sol file
const fs = require('fs');
const solc = require('solc');

const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol'); // will make a path to Lottery.sol (using path because this will work either on Windows or Linux machines)
// read the contents of file
const source = fs.readFileSync(lotteryPath, 'utf-8'); 

var input = {
    language: 'Solidity',
    sources: {
        'Lottery.sol' : {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [ '*' ]
            }
        }
    }
};

var output = JSON.parse(solc.compile(JSON.stringify(input)));

// export compiled contract ABI and bytecode
const interface = output.contracts['Lottery.sol'].Lottery.abi;
const bytecode = output.contracts['Lottery.sol'].Lottery.evm.bytecode.object;

module.exports = {
    interface,
    bytecode,
};

// OR
/**
 * module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  'Lottery.sol'
].Lottery;
 */