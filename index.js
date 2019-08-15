const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const StringDecoder = require('string_decoder').StringDecoder;

const httpServer = http.createServer(function(req, res) {
  mainServer(req, res);
});

const mainServer = function(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');
  const method = req.method;
  const objectStringQuery = parsedUrl.query;
  const headers = req.headers;

  const decoder = new StringDecoder();
  let buffer = '';
  req.on('data', function(data) {
    buffer += decoder.write(data);
  });

  req.on('end', function() {
    buffer = decoder.end();

    const payload = JSON.stringify(buffer);
    res.setHeader('Content-Type', 'application/json');
    res.end(payload);
    console.info('requested path: ', trimmedPath);
    console.info('method: ', method);
    console.info('objectStringQuery: ', objectStringQuery);
    console.info('payload: ', payload);
  });
};

httpServer.listen(3000, function() {
  console.log('Server listening on port 3000');
});
