

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
      data[0].length == data.map(function(row) { return row.length;}).reduce(function(a, b) {
	return a > b ? a : b;
      })) {
    this.data = data;
  }

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
    var m = this.copy();
    var lead = 0;
    for (var r = 0; r < this.height(); r++) {
      var i = r;
      while (m.data[i][lead] == 0) {
	i++;
	if (this.height() == i) {
	  i = r;
	  lead++;
	}
      }
      
      var temp = m.data[i];
      m.data[i] = m.data[r];
      m.data[r] = temp;
      
      var val = m.data[r][lead];
      for (var j = 0; j < this.width(); j++) {
	m.data[r][j] /= val;
      }
      
      for (var i = 0; i < this.height(); i++) {
	if (i == r) continue;
	val = m.data[i][lead];
	for (var j = 0; j < this.width(); j++) {
	  m.data[i][j] -= val * m.data[r][j];
	}
      }
      lead++;
    }
    return new Matrix(m.data);
  };

  /**
   * Return the inverse if possible
   */
  this.inverse = function() {
    // fill me in!
    return {};
  };

  /**
   * Return the determinant of this
   */
  this.det = function() {
    // fill me in!
    return 0;
  };

  this.isLinearlyIndependent = function() {
    // fill me in!
    return false;
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


/**
 * Exports
 */
module.exports = {
  Matrix: Matrix
};
