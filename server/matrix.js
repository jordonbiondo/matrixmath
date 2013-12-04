/* matrix.js --- 
 * 
 * Filename: matrix.js
 * Description: Mathematical Matrix Class
 * Author: Jordon Biondo
 * Maintainer: Jordon Biondo <biondoj@mail.gvsu.edu>
 * Created: Tue Dec  3 21:37:29 2013 (-0500)
 * Version: 0.1.0
 * Last-Updated: Tue Dec  3 21:38:38 2013 (-0500)
 *           By: Jordon Biondo
 *     Update #: 2
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




var _ = require('underscore');

/**
 * Create a new Matrix, data must be a 2D num array.
 *   - sub arrays are rows.
 *   - all rows must have the same length
 */
var Matrix = function(data) {
  
  /**
   * Check size on init
   */
  if (data &&
      data[0].length === data.map(function(row) { return row.length;}).reduce(function(a, b) {
	return a > b ? a : b;
      })) {
    this.data = data;
  }

  
  /**
   * Private methods, awww yissss
   */
  this.hidden = new (function() {

    /**
     * Is array all zeros?
     */
    this.isZeroRow = function(row) {
      for (var i = 0; i < row.length; i++) if (row[i] !== 0) return false;
      return true;
    };

    /**
     * Is row: 0 ... 0 b ?
     */
    this.isNoSolutionRow = function(row) {
      for (var i  = 0; i < row.length -1 ; i++) if (row[i] !== 0) return false;
      return row[row.length -1] !== 0;
    };

  })();

  
  /**
   * Copy this matrix
   */
  this.copy = function() {
    return new Matrix(this.data.map(function(row) {
      return row.slice(0);
    }));
  };

  /**
   * 
   */
  this.equals = function(other) {
    var context = this;
    return this.height() === other.height() &&
      this.width() === other.width() &&
      (function() {
	for (var i = 0; i < context.height(); i++) {
	  for (var j = 0; j < context.height(); j++) {
	    if (context.data[i][j] !== other.data[i][j]) return false;
	  }
	}
	return true;
      })();
  };
  
  /**
   * Height
   */
  this.height = function() {
    if (!data) return 0;
    else return this.data.length;
  };

  /**
   * Width
   */
  this.width = function() {
    if (!data) return 0;
    else return this.data[0].length;
  };

  
  /**
   * Size {height, width}
   */
  this.size = function() {
    return {
      height: this.height(),
      width: this.width(),
      equals: function(other) {
	return this.height === other.height && this.width === other.width;
      }
    };
  };
  
  /**
   * Return this matrix scaled by S
   */
  this.scaled = function(s) {
    if (!s) return this.copy();
    return new Matrix(this.copy().data.map(function(row) {
      return row.map(function(v) { return v * s; });
    }));
  };
  
  /**
   * Return this matrix * -1
   */
  this.negated = function() {
    return this.scaled(-1);
  };
  
  /**
   * Return this matrix + otherMatrix
   */
  this.added = function(other) {
    if (!this.size().equals(other.size())) {
      return null; // matrices must be the same size
    } else {
      var result = this.copy();
      for (var i = 0; i < this.height(); i++) {
	for (var j = 0; j < this.height(); j++) {
	  result.data[i][j] = this.data[i][j] + other.data[i][j];
	}
      }
      return result;
    }
  };
  
  
  /**
   * Return this matrix + negative otherMatrix
   */
  this.subbed = function(other) {
    return this.added(other.negated());
  };

  /**
   * Returns this matrix * other
   */
  this.multiplied = function(other) {
    if (this.width() != other.height()) return null;
    return Infinity;
  };

  
  /**
   * Return the rref of this
   * Modified from http://rosettacode.org/wiki/Reduced_row_echelon_form#JavaScript
   */
  this.rref = function() {
    var copied = this.copy();
    var lead = 0;
    for (var r = 0; r < copied.height(); r++) {
      if (this.width() <= lead) {
	return copied;
      }
      var i = r;
      while (copied.data[i][lead] === 0) {
	i++;
	if (copied.height() === i) {
	  i = r;
	  lead++;
	  if (this.width() === lead) {
	    return copied;
	  }
	}
      }
      
      var temp = copied.data[i];
      copied.data[i] = copied.data[r];
      copied.data[r] = temp;
      
      var val = copied.data[r][lead];
      for (var j = 0; j < copied.width(); j++) {
	copied.data[r][j] /= val;
      }
      
      for (var i = 0; i < copied.height(); i++) {
	if (i === r) continue;
	val = copied.data[i][lead];
	for (var j = 0; j < copied.width(); j++) {
	  copied.data[i][j] -= val * copied.data[r][j];
	}
      }
      lead++;
    }
    return copied;
  };


  /**
   * is matrix a square?
   */
  this.isSquare = function() {
    return this.height() === this.width() && this.height() >= 1;
  };
  
  /**
   * Is this matrix row equivalent to the other 
   */
  this.isRowEquivalent = function(other) {
    if (!this.size().equals(other.size)) return false;
    else {
      return this.rref().equals(other.rref());
    }
  };
  

  /**
   * Augmented, add a zero column to the end
   */
  this.augmented = function() {
    var copy = this.copy();
    copy.data.map(function(row) {
      return row.concat([0]);
    });
    return copy;
  };

  
  /**
   * is this matrix invertible
   */
  this.invertible = function() {
    if (! this.isSquare()) return false;
    var reduced = this.rref();
    if (! reduced.equals(Matrix.identity(this.height()))) return false;
    // c. A has n pivot positions. -- covered by above
    
    // d. TheequationAx=0hasonlythetrivialsolution.
    // e. The columns of A form a linearly independent set.
    // f. The linear transformation x 􏰜→ Ax is one-to-one.
    // g. TheequationAx=bhasatleastonesolutionforeachbinRn.
    // h. The columns of A span Rn .
    // i. The linear transformation x 􏰜→ Ax maps Rn onto Rn.
    // j. Thereisann×nmatrixCsuchthatCA=I.
    // k. Thereisann×nmatrixDsuchthatAD=I.
    // l. AT is an invertible matrix.
    return true;
  };


  /**
   * Return the inverse if possible
   */
  this.inverse = function() {
    if (! this.invertible()) return null;
    var origSize = this.height();
    var comp = this.copy();
    var ident = Matrix.identity(origSize);
    for (var i = 0; i < origSize; i++) {
      comp.data[i] = comp.data[i].concat(ident.data[i]);
    }
    return new Matrix(comp.rref().data.map(function(row) {
      return row.slice(origSize);
    }));
  };

  
  /**
   * Return the determinant of this
   * Modified from http://paulbourke.net/miscellaneous/determinant/
   */
  this.det = function() {
    if (! this.isSquare()) return null;
    var n = this.height();
    // fill me in!
    //double Determinant(double **a,int n)
    var i = 0;
    var thisCopy = this.copy();
    var nextSub;
    if (n < 1) { 
      return null;
    } else if (n === 1) { /* Shouldn't get used */
      return thisCopy.data[0][0];
    } else if (n === 2) {
      return thisCopy.data[0][0] * thisCopy.data[1][1] - thisCopy.data[1][0] * thisCopy.data[0][1];
    } else {
      var det = 0;
      for (var j1 = 0; j1 < n; j1++) {
	nextSub = Matrix.zero(n - 1);
        for (i = 1; i < n; i++) {
          var j2 = 0;
          for (var j = 0; j < n; j++) {
            if (j === j1) continue;
            nextSub.data[i-1][j2] = thisCopy.data[i][j];
            j2++;
          }
        }
        det += Math.pow(-1.0,1.0+j1+1.0) * thisCopy.data[0][j1] * nextSub.det();
      }
      return det;
    }
    
  };


  /**
   * Get span, fill me in
   */
  this.span = function() {
    if (this.isSquare()) {
      if (this.rref().equals(Matrix.identity(this.height()))) {
	return "R" + this.height();
      }
    }
    return "foobar";
  };

  /**
   * Test for linear independence
   */
  this.isLinearlyIndependent = function(callback) {

    // EX: if we have more than n vectors of Rn we now they are not lin ind
    if (this.width() > this.height()) return callback("Vectors are in R" + this.height() + 
						      ", only a collection of at most " + 
						      this.height() +
						      " vectors can be linearly independent, " +
						      "but you have " + this.width() +
						      ". Therefore we know that at least one vector " +
						      "can be made by a linear combination " +
						      "of the others.");
      
      
    // get the rref form
    var reduced = this.rref();
    // if the matrix is a square, it is lin ind iff it reduces to identity
    if (reduced.isSquare()) {
      if (reduced.equals(Matrix.identity(reduced.height()))) {
	return true;
      } else {
	return callback("At least one vector can be made by a linear combination of the others.");
      }
    }
    
    // count the number of rows containing only 0
      var zeroRows = _.filter(reduced.data, this.hidden.isZeroRow).length;
      if (zeroRows > (reduced.height() - this.width())) {
	return callback("At least one vector can be made by a linear combination of the others.");
      } else {
	return true;
      }
  };

  
  /**
   * Number of solutions for this as if it was an augmented matrix
   */
  this.numberOfSolutions = function() {
    // assuming this is set up as an augmented matrix
    // get the rref form
    var reduced = this.rref();
    var varN = this.width() -1;
    var eqN = this.height();
    // count the number of rows matching [0...0 b], if more than 0, return 0
    if (_.filter(reduced.data, this.hidden.isNoSolutionRow).length > 0) return 0;
    // else count the number of rows matching [0 ... 0], if more than 0, return infinity
    else if (_.filter(reduced.data, this.hidden.isZeroRow).length > (eqN - varN)) return Infinity;
    // else there is a unique solution!
    else return 1;
  };
  
  
  /**
   * Pretty Print Matrix 
   */
  this.toString = function() {
    if (!this.data) return "[Null Matrix]";
    var value = "[";
    for (var i = 0; i < this.data.length; i++) {
      value += "[";
      for (var j = 0; j < this.data[0].length; j++) {
	value += this.data[i][j];
	if (j != this.data[0].length - 1) value += ", ";
      }
      if (i != this.data.length - 1) {
	value += "]\n ";
      } else {
	value += "]]";
      }
    }
    return value;
  };
  
};

/**
 * Returns a zero matrix of size n, or nxm
 */
Matrix.zero = function(n, m) {
  if (!m) m = n;
  if (n > 0) {
    var data = new Array(n);
    for (var i = 0; i < n; i++) {
      data[i] = new Array(m);
      for (var j = 0; j < m; j++) data[i][j] = 0;
    }
    return new Matrix(data);
  } else {
    return null;
  }
};

/**
 * Return an identity matrix of size N
 */
Matrix.identity = function(n) {
  if (n > 0) {
    var m = Matrix.zero(n);
    for (var i = 0; i < n; i++) m.data[i][i] = 1;
    return m;
  } else {
    return null;
  }
};

/**
 * Exports
 */
module.exports = {
  Matrix: Matrix
};
