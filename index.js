const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const StringDecoder = require('string_decoder').StringDecoder;

// Create httpServer
const httpServer = http.createServer(function(req, res) {
  mainServer(req, res);
});

// Start httpServer
httpServer.listen(3000, function() {
  console.log('HTTP Server listening on port 3000');
});

// httpsServerOptions
const httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  certificate: fs.readFileSync('./https/certificate.pem')
};

// Create httpsServer
const httpsServer = https.createServer(httpsServerOptions, function(res, res) {
  mainServer(req, res);
});

// Start httpsServer
httpsServer.listen(3001, function() {
  console.log('HTTPS Server listening on port 3001');
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

    const handlerPath = router.hasOwnProperty(trimmedPath) ? router[trimmedPath] : handlers.notFound;

    const data = {
      headers,
      method,
      payload: JSON.parse(buffer)
    }
    buffer = decoder.end();

    handlerPath(data, function(statusCode, payload) {
      console.log('payload: ', payload);
      payload = typeof payload === 'object' ? payload : {};
      const payloadString = JSON.stringify(payload);

      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
    });
  });
};

// set handlers
const handlers = {};

// define hello route
handlers.hello = function(data, callback) {
  callback(200, { data, "message": "Successfuly fetched hello world" });
}
// define notFound route
handlers.notFound = function(data, callback) {
  callback(404, { "message": "Not Found!" });
}

// define router
const router = {
  'hello' : handlers.hello
};
