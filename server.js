var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var _ = require('underscore');
var async = require('async');
var argv = require('optimist').argv;

var mm = require('./server/matrix.js');

// websockets configuration
io.configure(function () {
  io.set('log level', 1);
});

// serve all client contents statically
if (argv.logger) app.use(express.logger());

// serve all client contents statically
app.use('/client', express.static(__dirname + '/client'));
app.get('/', function(req, res) { res.sendfile(__dirname + '/client/matrixmath.html'); });

server.listen(process.env.PORT || 3000);

io.sockets.on('connection', function(socket) {
  
  socket.on('compute', function(matrixData) {
    var matrix = new mm.Matrix(matrixData.data);
    var rref = matrix.rref();
    
    var solutions = rref.numberOfSolutions();
    var solutionsObj = {
      value: solutions,
      text: "The system of equations defined by the rows has " + (function(count) {
	if (count === Infinity) return "infinitely many solutions.";
	else if (count === 0) return "no solution.";
	else return "a unique solution.";
      })(solutions)
    };
    
    var consistent = {
      value: (solutions !== 0),
      text: "This matrix defines a" +
	((solutions !== 0) ? " consistent" : "n inconsistent") +
	" system of equations."
    };
    
    var isLinInd = rref.isLinearlyIndependent(function(error) {
      return error;
    });
    socket.emit("matrixFill", {
	matrix: matrix,
	size: matrix.size(),
	rref: rref,
	det: matrix.det(),
	inverse: matrix.inverse(),
	linInd: isLinInd,
	solutions: solutionsObj,
	consistent: consistent
      });
  });
  
});
