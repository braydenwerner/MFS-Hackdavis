const getData = async (symbol) => {
  var data
  fetch(
    'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&outputsize=compact&interval=1min&apikey=MGR1YK7CRLHP6ANJ',
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        data = body
      }
    }
  )
  return data
}

console.log(getData('IBM'))
