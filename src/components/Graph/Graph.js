import React, { useRef, useState, useEffect } from 'react'
import Chart from 'chart.js'
import './Graph.scss'

export default function Graph({ symbol }) {
  //https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=IBM&apikey=demo
  const [stockData, setStockData] = useState([])

  const canvasRef = useRef(null)

  useEffect(() => {
    console.log('symbol: ', symbol)

    symbol = symbol.length === 0 ? 'IBM' : symbol
    setStockData([])
    fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${API_KEY}`
    )
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        console.log(data)
        let tempData = []
        data = data['Time Series (Daily)']

        for (let date in data) {
          tempData.push(parseInt(data[date]['1. open']))
        }

        tempData = tempData.reverse()
        console.log(tempData)
        setStockData(tempData)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [symbol])

  useEffect(() => {
    const ctx = canvasRef.current
    const lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [...Array(stockData.length).keys()].map(() => ''),
        datasets: [
          {
            label: '',
            data: stockData,
            borderColor: 'rgb(158, 228, 147)'
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [
            {
              ticks: {
                suggestedMin: Math.min(...stockData) * 0.95,
                suggestedMax: Math.max(...stockData) * 1.05,
                fontColor: 'WHITE'
              },
              scaleLabel: {
                display: true,
                fontColor: 'WHITE',
                fontSize: 18,
                labelString: 'Price'
              }
            }
          ],
          xAxes: [
            {
              ticks: {
                fontColor: 'WHITE'
              },
              scaleLabel: {
                display: true,
                fontColor: 'WHITE',
                fontSize: 18,
                labelString: ''
              }
            }
          ]
        }
      }
    })

    return () => {
      lineChart.destroy()
    }
  }, [stockData])

  return (
    <div>
      <div id="chart-container">
        <h1>{symbol.length === 0 ? 'IBM' : symbol} Stock</h1>
        <canvas id="chart" ref={canvasRef} width="900px" height="600px" />
      </div>
      <div id="buy-container"></div>
    </div>
  )
}
