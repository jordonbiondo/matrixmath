#!/usr/bin/env node


var fatty = require('fattest');
var mm = require('./matrix.js');

var tests = new fatty.Env();



/**
 * assert that matrices a == b and b == a
 */
function matrixEqlTest(a, b) {
  return a.equals(b) && b.equals(a);
};

// test equality ok
tests.def(matrixEqlTest, [new mm.Matrix([[1, 2, 3],
					 [1, 2, 3]]),
			  new mm.Matrix([[1, 2, 3],
					 [1, 2, 3]])], true);
// test zero matrix
tests.def(matrixEqlTest, [new mm.Matrix([[0, 0, 0],
					 [0, 0, 0],
					 [0, 0, 0]]),
                          mm.Matrix.zero(3)], true);

// test identity
tests.def(matrixEqlTest, [new mm.Matrix([[1, 0, 0],
					 [0, 1, 0],
					 [0, 0, 1]]),
                          mm.Matrix.identity(3)], true);
// test identity
tests.def(matrixEqlTest, [new mm.Matrix([[1, 0, 0, 0],
					 [0, 1, 0, 0],
					 [0, 0, 1, 0],
					 [0, 0, 0, 1]]),
                          mm.Matrix.identity(4)], true);

// test identity bad
tests.def(matrixEqlTest, [new mm.Matrix([[1, 0, 0, 0],
                                         [0, 1, 0, 0],
                                         [0, 0, 1, 0],
                                         [0, 0, 0, 0]]),
                          mm.Matrix.identity(4)], false);



// test equality nope
tests.def(matrixEqlTest, [new mm.Matrix([[1, 2, 3],
					 [1, 2, 3]]),
                          new mm.Matrix([[1, 4, 3],
					 [1, 2, 3]])], false);

//test equality same size bad
tests.def(matrixEqlTest, [new mm.Matrix([[1, 2, 3],
					 [1, 2, 3],
					 [6, 5, 10]]),
                          new mm.Matrix([[1, 2, 3],
					 [1, 2, 3],
					 [0, 0, 0]])], false);

// test equality different size 
tests.def(matrixEqlTest, [new mm.Matrix([[1, 2, 3],
					 [1, 2, 3],
					 [6, 5, 10]]),
                          new mm.Matrix([[1, 2, 3],
					 [1, 2, 3]])], false);

// test scale
tests.def(matrixEqlTest, [new mm.Matrix([[1, 1, 1], [2, 2, 2]]).scaled(2),
			  new mm.Matrix([[2, 2, 2], [4, 4, 4]])], true);

// test 1 scale
tests.def(matrixEqlTest, [new mm.Matrix([[1, 1, 1],
					 [2, 2, 2]]).scaled(1),
                          new mm.Matrix([[1, 1, 1],
					 [2, 2, 2]])], true);

// test .5 scale
tests.def(matrixEqlTest, [new mm.Matrix([[1, 1, 1],
					 [2, 2, 2]]).scaled(0.5),
                          new mm.Matrix([[.5, .5, .5],
					 [1, 1, 1]])], true);

// negate test
tests.def(matrixEqlTest, [new mm.Matrix([[1, 1, 1],
					 [2, 2, 2]]).negated(),
			  new mm.Matrix([[-1, -1, -1],
					 [-2, -2, -2]])], true);

// test squareness bad
tests.def(function(m) { return m.isSquare(); },
	  [new mm.Matrix([[1, 1, 1],
			  [2, 2, 2]])],
	  false);

// test squareness good
tests.def(function(m) {return m.isSquare();},
	  [new mm.Matrix([[1, 1, 1],
                          [2, 2, 2],
			  [3, 3, 3]])],
          true);

// copy should work by value, not reference
tests.def(matrixEqlTest, [
  (function() {
    var x = new mm.Matrix([[1, 1, 1],
			   [2, 2, 2]]);
    var y = x.copy();
    x.data[0][0] = 100;
    return y;
  })(),
  new mm.Matrix([[1, 1, 1],
		 [2, 2, 2]])], true);


// copy by value, not reference
tests.def(matrixEqlTest, [
  (function() {
    var x = new mm.Matrix([[1, 1, 1],
			   [2, 2, 2]]);
    var y = x.copy();
    x.data[0][0] = 100;
    return y;
  })(),
  new mm.Matrix([[1, 1, 1],
		 [2, 2, 2]])], true);

// test rref
tests.def(matrixEqlTest, [new mm.Matrix([[1, 2, 3],
					 [3, 4, 3]]).rref(),
                          new mm.Matrix([[1, 0, -3],
					 [0, 1, 3]])], true);

// test rref
tests.def(matrixEqlTest, [new mm.Matrix([[1, 2, 3],
                                         [2, 1, 1],
					 [4, 9, 4]]).rref(),
                          new mm.Matrix([[1, 0, 0],
                                         [0, 1, 0],
					 [0, 0, 1]])], true);


// det test
tests.def(function(m) { return m.det(); }, [new mm.Matrix([[1, 2, 3],
							   [2, 1, 1],
							   [4, 9, 4]])], 29);
// det test
tests.def(function(m) { return m.det(); }, [new mm.Matrix([[3, 2, 3],
                                                           [2, 23, 1],
                                                           [4, 9, 4]])], 19);
// det test
tests.def(function(m) { return m.det(); }, [new mm.Matrix([[3, 2, 3],
                                                           [2, 23, 1],
                                                           [9, 9, 4]])], -316);

// no det on non square
tests.def(function(m) { return m.det(); }, [new mm.Matrix([[3, 2, 3],
                                                           [2, 23, 1]])], null);

// tests.def(function(m) {return m.isLinearlyIndependent();},
// 	  [new mm.Matrix([[-4, -3, 0], [0, -1, 4], [1, 0, 3], [5, 4, 6]])], true);


// tests.def(function(m) {return m.isLinearlyIndependent();},
//           [new mm.Matrix([[-4, -3, 0], [0, -1, 4], [1, 0, 3]])], true);

// tests.def(function(m) {return m.isLinearlyIndependent();},
//           [new mm.Matrix([[-4, -3], [0, -1], [1, 0]])], true);

tests.def(function(m) {return m.isLinearlyIndependent();},
          [new mm.Matrix([[-4, -3, 0, 1 ],
			  [ 0, -1, 4, 3 ],
			  [ 1,  0, 3, 10]])], false);

tests.def(function(m) { return m.det(); }, [new mm.Matrix([[1, 2, 3],
                                                           [2, 4, 1],
                                                           [4, 8, 4]])], 0);


/**
 * Run the tests
 */
tests.run();
