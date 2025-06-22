import { useState } from "react"
export default function Tutorial( {state,changeState}) {


    return (
        <div className="tut-container">
          
            <div className="bottom card">
              <div className="exit">
                <button onClick={() => changeState(prev => !prev)}>X</button>
            </div>
                <h2>How to Play</h2>
                <p>
                    Welcome to the Memory Game! Your goal is to click on each unique card only once.
                </p>
                <ul>
                    <li>Click a card to earn points.</li>
                    <li>Don’t click the same card twice — or your score resets!</li>
                    <li>Cards will shuffle after every click to make it more challenging.</li>
                    <li>Try to beat your best score!</li>
                </ul>
                <p>Good luck and have fun testing your memory!</p>
            </div>
        </div>
    )
}