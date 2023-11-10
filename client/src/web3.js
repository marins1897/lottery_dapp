import { Web3 } from "web3";
if(window.ethereum){
    try {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        console.log(accounts)           
    } catch (error) {
        console.log(error)
    }
} // connect to Metamask account and get Provider

const web3 = new Web3(window.ethereum);

export default web3;
