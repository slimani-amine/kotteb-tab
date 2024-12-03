const { BASE_URL, REACT_APP_ACCESS_KEY } = process.env

const query = 'islamique'
// const orientation = 'landscape'
const pageNo = Math.floor(Math.random() * 200) + 1

const RANDOM_BG_URL = `https://quranapi.lissene.dev/api/v1/tab/background/random`

const QURAN = `https://quranapi.lissene.dev/api/v1/quran/recitations?reciter=66dada5e69f96db230265707&riwayat=66be128148d3e348549305f0`

const QUOTES_URL = 'https://zenquotes.io/api/random'

const WEATHER_API = `https://api.openweathermap.org/data/2.5/weather`

export { RANDOM_BG_URL, QURAN, QUOTES_URL, WEATHER_API }
