const { REACT_APP_ACCESS_KEY } = process.env

const query = 'nebula'
const orientation = 'landscape'

export const URL = `https://api.unsplash.com/search/photos?client_id=${REACT_APP_ACCESS_KEY}&&orientation=${orientation}&&query=${query}`

export const QUOTES_URL = 'https://api.quotable.io/random'
