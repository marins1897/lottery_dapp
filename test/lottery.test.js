const assert = require('assert');
const ganache = require('ganache');
const { Web3 } = require('web3');
const { bytecode, interface } = require('../compile');


const web3 = new Web3(ganache.provider()); // creates instance of Web3 and tell it to connect to Ganache local network

let lottery;
let accounts;

beforeEach(async () => {
    // fetch accounts before each assertion
    accounts = await web3.eth.getAccounts(); 

    // use one of them to deploy contract
    lottery = await new web3.eth.Contract(interface)
        .deploy({ data : bytecode })
        .send({ from : accounts[0], gas : '1000000' });
    });


describe('Contract test', () => {
    it('Lottery deployment', () => {
        assert.ok(lottery.options.address); // it just needs to exist
    });

    it('Allows one acount to enter the lottery', async () => {
        await lottery.methods.enter().send({
            from : accounts[1],
            value : web3.utils.toWei('0.02', 'ether') // enter the lottery with 0.02 ether
        });

        const players = await lottery.methods.getPlayers().call({
            from : accounts[1],
        });

        assert.equal(accounts[1], players[0]); // address of first player in smart contract is address of accounts[1]
        assert.equal(1, players.length); // there is only one player who entered the lottery for now 
    });

    it('Allows multiple acounts to enter the lottery', async () => {
        await lottery.methods.enter().send({
            from : accounts[1],
            value : web3.utils.toWei('0.02', 'ether') // enter the lottery with 0.02 ether
        });
        await lottery.methods.enter().send({
            from : accounts[2],
            value : web3.utils.toWei('0.02', 'ether') // enter the lottery with 0.02 ether
        });
        await lottery.methods.enter().send({
            from : accounts[3],
            value : web3.utils.toWei('0.02', 'ether') // enter the lottery with 0.02 ether
        });

        const players = await lottery.methods.getPlayers().call({
            from : accounts[1],
        });

        assert.equal(accounts[1], players[0]); // address of first player in smart contract is address of accounts[1]
        assert.equal(accounts[2], players[1]);
        assert.equal(accounts[3], players[2]);
        assert.equal(3, players.length); // there is only one player who entered the lottery for now 
    });

    it('Requires a minimum amount of ether to enter the lottery', async () => {
        try {
            await lottery.methods.enter().send({
                from : accounts[1],
                value : 10 //wei
            });

            assert(false);

        } catch (err) {
            assert(err); // there was an error
            // assert check for thruthiness
            // assert.ok checks for existence
        }
    });

    it('Only manager can call pick a winner', async () => {
        try {
            await lottery.methods.pickWinner().send({
                from : accounts[1], // not the manager
            });

            assert(false);

        } catch (err) {
            assert(err); 
        }
    });

    it('Sends money to the winner and resets the players array', async () => {
        await lottery.methods.enter().send({ // entering the lottery
            from : accounts[1],
            value : web3.utils.toWei('2', 'ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[1]); // balance of account before picking a winner

        // he is only player so he is going to be winner
        await lottery.methods.pickWinner().send({
            from : accounts[0], 
        });

        const finalBalance = await web3.eth.getBalance(accounts[1]); // after picking winner

        const difference = finalBalance - initialBalance;
        assert(difference > web3.utils.toWei('1.7', 'ether'));

        const players = await lottery.methods.getPlayers().call({
            from : accounts[1]
        });

        assert.equal(players.length, 0);
    });
});