

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

  })();

  this.eachRow = function(callback) {
    for (var i = 0; i < this.height; i++) {
      callback(this.data[i]);
    }
  };
  
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
    return this.size().equals(other.size()) &&
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
    
  };
  
  
  /**
   * Return this matrix + negative otherMatrix
   */
  this.subbed = function(other) {
    return this.added(other.negated);
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

  
  this.invertible = function() {
    //    return this.isSquare() && 
    return false;
  };
  /**
   * Return the inverse if possible
   */
  this.inverse = function() {
    if (! this.isSquare()) return null;
    
    return {};
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
    }
    return det;
  };

  

  /**
   * Test for linear independence
   */
  this.isLinearlyIndependent = function() {

    if (this.width() > this.height()) return false;
    
    var reduced = this.rref();
    var zeroRows = reduced.data.map(this.hidden.isZeroRow).reduce(function(a, b) {
      return a + b ? 1 : 0;
    }, 0);
    // shit is real messed up...
    return ! (zeroRows > 0);
  };

  /**
   * Pretty Print Matrix if specified form, vector, matrix, or algebraic
   */
  this.toString = function(form) {
    if (!this.data) return "[Null Matrix]";

    if (form === "algebraic")  {
      // fill me in!
      return "[[algebraic form]]";
    } else if (form === "vector") {
      // fill me in!
      return "[[vector form]]";
    } else if (! form || form === "matrix") {
      
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
      
    } else {
      
      return "unknown form: " + form + "\n" + this.toString("matrix");
      
    }
  };
  
};

Matrix.zero = function(n) {
  if (n > 0) {
    var data = new Array(n);
    for (var i = 0; i < n; i++) {
      data[i] = new Array(n);
      for (var j = 0; j < n; j++) {
	data[i][j] = 0;
      }
    }
    return new Matrix(data);
  } else {
    return null;
  }
};

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
