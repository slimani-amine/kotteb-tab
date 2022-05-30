const { REACT_APP_ACCESS_KEY } = process.env

const query = 'nebula'
const orientation = 'landscape'
const pageNo = Math.floor(Math.random() * 200) + 1

const UNSPLASH_API = `https://api.unsplash.com/search/photos?client_id=${REACT_APP_ACCESS_KEY}&&orientation=${orientation}&&query=${query}&&page=${pageNo}`

const QUOTES_URL = 'https://api.quotable.io/random'

const WEATHER_API = `https://api.openweathermap.org/data/2.5/weather`

export { UNSPLASH_API, QUOTES_URL, WEATHER_API }
