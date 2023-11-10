import "./App.css";
import React, { useEffect, useState } from "react";
import web3 from "./web3";
import lottery, { address } from './lottery';


function App() {
  const [manager, setManager] = useState('');
  const [peopleEntered, setPeopleEntered] = useState(0);
  const [prize, setPrize] = useState(0);
  const [value, setValue] = useState(0);
  const [winner, setWinner] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchContractData() {
      const owner = await lottery.methods.manager().call();
      setManager(owner);

      const participants = await lottery.methods.getPlayers().call();
      setPeopleEntered(participants.length);

      const reward = await web3.eth.getBalance(address);
      setPrize(parseInt(reward));

      const accounts = await web3.eth.getAccounts();
      setUserAddress(accounts[0]);
    }

    fetchContractData();
  },[]);


  function changeValue(event) {
    console.log(event.target.value);
    setValue(event.target.value);
  }

  async function enterHandler(event) {
    event.preventDefault();

    setMessage('Waiting on a transaction success...');

    await lottery.methods.enter().send({
      from : userAddress,
      value : web3.utils.toWei(value, 'ether'),
    });

    setMessage( 'You have been entered!');
  };

  async function pickWinnerHandler() {
    setMessage('Waiting on a transaction success...');

    const winner = await lottery.methods.pickWinner().send({
      from : manager,
    });

    setWinner(winner.to);
    setMessage('A winner has been picked!');
  }

  return (
    <div style={{ display : 'flex', flexDirection : 'column', alignItems : 'center', justifyContent : 'center'}}>
    <h1>Ethereum Lottery</h1>
    <hr style={{ width : '40%'}} />

    <p>Manager is : <strong>{manager} </strong> </p>
    <p>
      There are currently <strong>{peopleEntered}</strong> people entered to win a lottery!
    </p>

    <p>Current prize is : <strong>{web3.utils.fromWei(prize, 'ether')} ETH!</strong></p>
    <hr style={{ width : '40%'}}  />

    <h2>Want to try your luck ?</h2>
    <p>Enter some ETHER to compete : 
      <input type="number" value={value} onChange={changeValue} style={{ margin : '0 1vw', height : '4vh'}} />
    </p>
    <button onClick={enterHandler} style={{ width : '25%'}}>Enter</button>
    <hr style={{ width : '25%'}}/>

  {manager === userAddress && (
    <>
    <button onClick={pickWinnerHandler} style={{ width : '25%'}}>
      Pick Winner
    </button>

    {winner && <p>Winner is : <strong>{winner} </strong> !</p>}
    </>
  )}

  {message && (
  <div style={{ backgroundColor : 'rgba(255, 255, 255, 0.87)', margin : '2vh 0', borderRadius : '10px', width : '50%', display : 'flex', justifyContent : 'center', alignItems : 'center'}}>
    <p style={{ color : '#242424'}}>{message}</p>
  </div>
  )}

  </div>
  )
}

export default App;
