import React from 'react';
import "./style.css";
import Die from "./Die";
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti'; // instalirali


export default function App() {
  const [dice, setDice] = React.useState(allNewDice())

  // new state. It represents whether the user has won the game yet or not
  const [tenzies, setTenzies] = React.useState(false)
  
  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    // every - is it will look for a specific condition and if every item in that array returns a true for that condition then it will return the value true

    // dal imaju isti value
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)
    if (allHeld && allSameValue) { // ??? OBA UVJETA MORAJU BITI TOČNA? A AKO JE NPR. allHeld FALSE ONDA SE TO SVE ZANEMARI?
      setTenzies(true)
    }
  }, [dice]) // to run every time the dice array changes in state


  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    }
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie())
    }
    return newDice;
  }
  
  function rollDice() {
    // AKO JE TENZIES SUPROTAN OD TRENUTNE VRIJEDNOSTI ???
    if (!tenzies) {
      setDice(oldDice => oldDice.map(die => {
        return die.isHeld ? 
          die : // sure that we just keep it as part of our array
          generateNewDie()
      })) 
    } else {
      setTenzies(false)
      setDice(allNewDice())
    }
      // if tenzis is true in other words if they've won the game then first I want to set tenzis to false
      // because I don't want the game to still be won and then I can generate all new dice 
  }
  
  function holdDice(id) {
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ?
        { ...die, isHeld: !die.isHeld } : // ??? ZA UPDATE DA AKO JE TRUE NEKA BUDE FALSE, A AKO JE FALSE NEKA STAVI TRUE
        die // it's not the id that we clicked on or that we interacted with just keep the same object that we had before
    }))
  }

  const diceElements = dice.map(die => (
    <Die key={die.id} value={die.value} isHeld={die.isHeld} holdDice={() => holdDice(die.id) } />
    // mi smo napravili anonimnu funkciju. React će znati na koju kućicu smo klikli
    /* jedan od načina je da moremo pass id to the die id={die.id} holdDice={holdDice} i onda da pozovemo holdDice na click
    i pass the id that's passed as a prop here */
  ));


  return (
    <main>
      {/* if tenzis are true then React will render Confetti */}
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">
        {diceElements}
      </div>
      <button className="roll-dice" onClick={rollDice}>
        {tenzies ? 'New game' : 'Roll'}
        {/* if tenzies is true ispiši New game, ako je false roll*/}
      </button>
    </main>
  );
}


