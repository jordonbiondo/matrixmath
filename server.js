var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var _ = require('underscore');
var async = require('async');


// websockets configuration
io.configure(function () {
  io.set('log level', 1);
});

// serve all client contents statically
app.use('/client', express.static(__dirname + '/client'));
app.get('/', function(req, res) { res.sendfile(__dirname+'/client/matrixmath.html"'); });
