/* matrix_tests.js --- 
 * 
 * Filename: matrix_tests.js
 * Description: Mathematical Matrix Class Testing
 * Author: Jordon Biondo
 * Maintainer: Jordon Biondo <biondoj@mail.gvsu.edu>
 * Created: Tue Dec  3 21:37:29 2013 (-0500)
 * Version: 0.1.0
 * Last-Updated: Tue Dec  3 21:39:23 2013 (-0500)
 *           By: Jordon Biondo
 *     Update #: 4
 * URL: github.com/jordonbiondo/matrixmath
 */

/* This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 3, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; see the file COPYING.  If not, write to
 * the Free Software Foundation, Inc., 51 Franklin Street, Fifth
 * Floor, Boston, MA 02110-1301, USA.
 */

/* Code: */



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



// added test
tests.def(matrixEqlTest, [new mm.Matrix([[1, 1, 1],
					 [2, 2, 2]])
			  .added(
			    new mm.Matrix([[1, 1, 1],
                                           [2, 2, 2]])),
			  
			  new mm.Matrix([[2, 2, 2],
					 [4, 4, 4]])], true);

tests.def(matrixEqlTest, [new mm.Matrix([[1, 1, 1],
                                         [2, 2, 2]])
                          .subbed(
                            new mm.Matrix([[1, 1, 1],
                                           [2, 2, 2]])),
                          
                          new mm.Matrix([[0, 0, 0],
                                         [0, 0, 0]])], true);



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
//           [new mm.Matrix([[-4, -3, 0], [0, -1, 4], [1, 0, 3]])], true);

// tests.def(function(m) {return m.isLinearlyIndependent();},
//           [new mm.Matrix([[-4, -3], [0, -1], [1, 0]])], true);


tests.def(function(m) { return m.det(); }, [new mm.Matrix([[1, 2, 3],
                                                           [2, 4, 1],
                                                           [4, 8, 4]])], 0);


/**
 * Run the tests
 */
tests.run();

var result = new mm.Matrix([[1, 1, 1, 2],
			    [1, 1, 1, 4],
			    [1, 1, 2, 10]]).isLinearlyIndependent(function(error) {
  console.log(error);
});

if (result) console.log(result);


console.log(new mm.Matrix([[1, 2],
			   [3, 4]]).lup().toString());
console.log(new mm.Matrix([[1, 2, 3],
                           [1, 3, 2],
                           [4, 3, 2]]).det());
