import React, { useRef, useState, useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { docDataState, signedInState } from '../../atoms/atoms'
import Graph from '../Graph/Graph'
import './HomePage.scss'

export default function HomePage() {
  const signedIn = useRecoilValue(signedInState)
  const [docData, setDocData] = useRecoilState(docDataState)
  const [symbol, setSymbol] = useState('')

  const inputRef = useRef(null)

  useEffect(() => {
    console.log(docData)
  }, [docData])

  const handleButtonClick = () => {
    const inputValue = inputRef.current.value
    setSymbol(inputValue)
  }

  return (
    <>
      <h1 id="search">Search for Stocks</h1>
      <input id="input" ref={inputRef} autoComplete={'off'}></input>
      <button onClick={handleButtonClick} id="button">
        Search
      </button>

      <Graph symbol={symbol} />
      <div>
        {signedIn && docData && (
          <div id="button-container">
            <button id="buy">Buy</button>
            <button id="sell">Sell</button>
          </div>
        )}
      </div>

      <div>{!signedIn && <div></div>}</div>
    </>
  )
}
