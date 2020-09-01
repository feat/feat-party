const axios = require('axios')
const dev = process.env.NODE_ENV !== 'production'

const instance = axios.create({
  baseURL: dev ? `https://localhost:${process.env.API_PORT}` : process.env.API_ENDPOINT,
})

module.exports = instance
