import React, { useEffect, useState } from 'react'
import './Leaderboard.scss'

export default function Leaderboard() {
  const [userData, setUserData] = useState([])
  useEffect(() => {
    //  return an array of objects
    //  username, wealth, pct, # stocks
    let tempUserData = []
    let usernames = [
      'idekwtmbili',
      'dudeman42',
      'braydenw',
      'bit.ly/a-dog',
      'c4m00',
      'stocklover55',
      'placerwiz',
      'ryrysmiley',
      'xtremestocker', // <- cool guy
      'dinoRAWR!'
    ]

    for (let username of usernames) {
      let wealth = Math.round(Math.random() * 1800 + 200)
      tempUserData.push({
        username: username,
        wealth: wealth,
        change: (wealth - 1000) / 10 + '%',
        totalStocks: Math.round(Math.random() * 48 + 2)
      })
    }
    tempUserData.sort((a, b) => b.wealth - a.wealth)

    console.log(tempUserData)
    setUserData(tempUserData)
  }, [])
  let isPrimary = true
  return (
    <div>
      <div id="space-div-0"></div>
      <h1 id="leaderboard-h1">Leaderboard</h1>
      <table id="leaderboard-table" rules="none">
        <thead>
          <tr
            id="leaderboard-header-row"
            className={`isPrimaryColor-${isPrimary}`}
          >
            <th>#</th>
            <th>Username</th>
            <th>Wealth</th>
            <th>% Change</th>
            <th># of Stocks</th>
          </tr>
        </thead>
        {userData.map((user, i) => {
          isPrimary = !isPrimary

          return (
            <tbody key={i}>
              <tr
                id="leaderboard-inner-row"
                className={`isPrimaryColor-${isPrimary}`}
              >
                <td id="leaderboard-position">{i + 1}</td>
                <td>{user.username}</td>
                <td>{user.wealth}</td>
                <td>{user.change}</td>
                <td>{user.totalStocks}</td>
              </tr>
            </tbody>
          )
        })}
      </table>
      <div id="space-div"></div>
    </div>
  )
}
