// this needs to run on a server (probably same as alexa at home skill server) but on a diffent port
// (obviously) - this will then pipe the requested di.fm HTTP stream over HTTPS so that amazon alexa
// audio player can play the stream 

'use strict';

var config     = require('./config');
var express    = require('express');
var https      = require('https');
var fs         = require('fs');
var bodyParser = require('body-parser');
var request    = require('request');

const serverPort = config.httpsServer.internalPort;
const serverIP   = config.httpsServer.internalIP;

// SSL Certificate - highly recommend using a free (yes free) letsencrypt.org ssl certificate
var privateKey  = fs.readFileSync("./sslcert/privkey.pem", 'utf8');
var certificate = fs.readFileSync("./sslcert/fullchain.pem", 'utf8');
var credentials = {key: privateKey, cert: certificate};

const app = express();
app.use(bodyParser.json({ type: 'application/json' }));

// https://<externalURL>/di/<channelname>?code=<listenKey> will return
// pipes unsecure HTTP DI.FM link to your own servers HTTPS link so that Alexa
// Skill SDK will play the audio
app.get('/di/:channel', function(req, res) {
    console.log("Channel requested is " + req.params.channel);
    var url = 'http://prem2.di.fm:80/' + req.params.channel + '?' + req.query.code;
    var proxyRequest = request(url);
    req.pipe(proxyRequest);
    proxyRequest.pipe(res);
});

// https://<externalURL>/ditest/<channelname>?code=<listenKey> will return
// OK              - channel is playable
// Not Found       - channel does not exist
// Unauthorized    - listenKey is incorrect
app.get('/ditest/:channel', function(req, res) {
    var url = 'http://prem2.di.fm:80/' + req.params.channel + '?' + req.query.code;
    request.get(url).on('response', function(response) {
        res.sendStatus(response.statusCode);
    });
});

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(serverPort, serverIP, function () {
    console.log('Digital Imported Alexa Skill Proxy Server: ' + serverIP + ':' + serverPort);
});



