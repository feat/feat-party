const proxy = require('http-proxy-middleware');
const debug = require('../services/debug');
const dev = process.env.NODE_ENV !== 'production';

module.exports = proxy('/socket.io', {
  target: dev
    ? `https://localhost:${process.env.API_PORT}`
    : process.env.SOCKET_ENDPOINT,
  ws: true,
  secure: false,
  // xfwd: true,
  // onError: (err, req, res) => {
  //   console.log(res);
  //   res.writeHead(500, {
  //     'Content-Type': 'text/plain',
  //   });  
  //   res.end('Error')
  // },
  logProvider: () => ({
    log: debug.socketProxy,
    debug: debug.socketProxy,
    info: debug.socketProxy,
    warn: debug.socketProxy,
    error: debug.socketProxy,
  }), 
  onProxyReq: (proxyReq, req) => {
    const apiHeaders = req.getApiHeaders();
    Object.entries(apiHeaders).forEach(([key, value]) => {
      // console.log(key, value);
      proxyReq.setHeader(key, value);
    });
    if (process.env.SOCKET_TOKEN) {
      proxyReq.setHeader('X-Feat-Socket-IO-Token', process.env.SOCKET_TOKEN)
    }
  },
})