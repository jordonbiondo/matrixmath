#!/usr/bin/env node


var fatty = require('fattest');
var mm = require('./matrix.js');

var tests = new fatty.Env();



function matrixEqlTest(a, b) {
  return a.equals(b) && b.equals(a);
};


tests.def(matrixEqlTest, [new mm.Matrix([[1, 2, 3], [1, 2, 3]]),
			  new mm.Matrix([[1, 2, 3], [1, 2, 3]])], true);

tests.def(matrixEqlTest, [new mm.Matrix([[1, 2, 3], [1, 2, 3]]),
                          new mm.Matrix([[1, 2, 3], [1, 2, 3]])], true);

tests.def(matrixEqlTest, [new mm.Matrix([[1, 2, 3], [1, 2, 3], [6, 5, 10]]),
                          new mm.Matrix([[1, 2, 3], [1, 2, 3], [0, 0, 0]])], false);

tests.def(matrixEqlTest, [new mm.Matrix([[1, 2, 3], [1, 2, 3], [6, 5, 10]]),
                          new mm.Matrix([[1, 2, 3], [1, 2, 3]])], false);

tests.def(matrixEqlTest, [new mm.Matrix([[1, 1, 1], [2, 2, 2]]).scaled(2),
			  new mm.Matrix([[2, 2, 2], [4, 4, 4]])], true);

tests.def(matrixEqlTest, [new mm.Matrix([[1, 1, 1], [2, 2, 2]]).scaled(1),
                          new mm.Matrix([[1, 1, 1], [2, 2, 2]])], true);

tests.def(matrixEqlTest, [new mm.Matrix([[1, 1, 1], [2, 2, 2]]).scaled(0.5),
                          new mm.Matrix([[.5, .5, .5], [1, 1, 1]])], true);

tests.def(matrixEqlTest, [new mm.Matrix([[1, 1, 1], [2, 2, 2]]).negated(),
			  new mm.Matrix([[-1, -1, -1], [-2, -2, -2]])], true);

tests.def(matrixEqlTest, [new mm.Matrix([[1, 1, 1], [2, 2, 2]]).negated(),
                          new mm.Matrix([[-1, -1, -1], [-2, -2, -2]])], true);

tests.def(matrixEqlTest, [
  (function() {
    var x = new mm.Matrix([[1, 1, 1], [2, 2, 2]]);
    var y = x.copy();
    x.data[0][0] = 100;
    return y;
  })(),
  new mm.Matrix([[1, 1, 1], [2, 2, 2]])], true);


tests.run();
