/* client.js --- 
 * 
 * Filename: client.js
 * Author: Jordon Biondo
 * Maintainer: Jordon Biondo <biondoj@mail.gvsu.edu>
 * Created: Tue Dec  3 21:37:29 2013 (-0500)
 * Version: 0.1.0
 * Last-Updated: Tue Dec  3 21:39:58 2013 (-0500)
 *           By: Jordon Biondo
 *     Update #: 5
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

var defaultMatrixWidth = 3;
var defaultMatrixHeight = 3;

var lastSendTime;

var socket;

socket = io.connect();

socket.on("matrixFill", function(data) {
  if (new Date() - lastSendTime > (.4 * 1000)) {
    $('#computeSpinner').removeClass('spin');
  } else {
    setTimeout(function() {
      $('#computeSpinner').removeClass('spin');
    }, 400);;
  }
  $("#matrixInfo").empty();
  $("#detValue").val((data.det) ? data.det : "Not possible");
  fillMatrixTable("#rrefMatrix", data.rref);
  if (data.linInd === true) {
    addMatrixInfoLine("The column vectors of this matrix are linearly independent! ", true);
  } else {
    addMatrixInfoLine("The column vectors of this matrix are not linearly independent. "
		      + data.linInd, false);
  }
  if (data.inverse) {
    addMatrixInfoLine("This matrix is invertible because it " +
                      "reduces to the identity matrix.", true);

    fillMatrixTable("#inverseMatrix", data.inverse);
  } else {
    addMatrixInfoLine("This matrix is not invertible because " +
                      "cannot be reduced to an identity matrix.", false);
    spoofFillMatrix("#inverseMatrix", data.size.height, data.size.width);
  }

  addMatrixInfoLine(data.solutions.text, (data.solutions.value !== 0));
  addMatrixInfoLine(data.consistent.text, (data.consistent.value));

});



/**
 * Fill table with matrix
 */
function fillMatrixTable(table, matrix) {
  $(table).empty();
  $.each(matrix.data, function(i, row) {
    tRow = $('<tr>', {
      class: 'matrixRow'
    });
    $.each(row, function(j, value) {

      tRow.append($('<td>', {
        text: (parseFloat(value)) ? (Math.round(parseFloat(value*1000)) / 1000) : value,
        class: 'matrixData'
      }));

    });
    $(table).append(tRow);
  });
}

/**
 * Fill output with empty data
 */
function spoofFillMatrix(table, n, m) {
  fillMatrixTable(table, {
    data: (function() {
      var result = new Array(n);
      for (var i = 0; i < n; i++) {
        var row = new Array(m);
        for (var j = 0; j < m; j++) {
          row[j] = "  ";
        }
        result[i] = row;
      }
      return result;
    })()
  });
}

/**
 * Resize matrix input
 */
function resizeMatrixInputTable(height, width) {
  var oldData = getInputData(true);
  $("#inputMatrix").empty();
  for (var i = 0; i < height; i++) {
    tRow = $('<tr>', { class: 'matrixRow' });
    for (var j = 0; j < width; j++) {

      tRow.append($('<td>', {
        class: 'matrixData',
        html: $("<input>", {
          class: "matrixInput form-control",
          type: "number"
        })
      }));
    }
    $("#inputMatrix").append(tRow);
  }
  spoofFillMatrix("#rrefMatrix", height, width);
  spoofFillMatrix("#inverseMatrix", height, width);
  fillInputMatrix(oldData);
}

/**
 * Try resizing input matrix
 */
function tryResizeInput() {
  var n = parseInt($("#matrixHeightInput").val());
  var m = parseInt($("#matrixWidthInput").val());
  if ((!isNaN(n)) &&
      (!isNaN(m)) &&
      m > 0 &&
      n > 0) {
    resizeMatrixInputTable(n, m);
  } else {
    console.log("error resizing");
  }
}

function fillInputMatrix(data) {
  $("#inputMatrix tr").each(function(i) {
    var thisRow = [];
    var tableData = $(this).find('td input');
    if (tableData.length > 0) {
      tableData.each(function(j, elm) {
        elm.value = ( data  ? (data[i] ? data[i][j] : null) : null);
      });
    }
  });
}

function addMatrixInfoLine(message, good) {
  var info = $("#matrixInfo");

  var item = $("<li>", {
    class: "alert-box " + (good ? "success" : "warning")
  });

  var innerlist = $("<ul>", {
    class: "inline-list"
  });

  innerlist.append($("<li>", {
    class: "glyphicon "  + ((good) ? "glyphicon-ok" : "glyphicon-asterisk")
  }));

  innerlist.append($("<li>", {
    text: message,
  }));
  item.append(innerlist);

  info.append(item);
}

/**
 * Get input matrix
 */
function getInputData(ignoreErrors) {
  var data = [];
  var error = false;
  $("#inputMatrix tr").each(function() {
    if (error && !ignoreErrors) return false;
    var thisRow = [];
    var tableData = $(this).find('td input');
    if (tableData.length > 0) {
      tableData.each(function() {
        var val = parseFloat($(this).val());
        if (isNaN(val)) {
          error = true;
        } else {
          thisRow.push(val);
        }
      });
      data.push(thisRow);
    }
  });
  if (error && !ignoreErrors) return null;
  return data;
}


/**
 * Get input and send if OK
 */
function trySendMatrix() {
  var data = getInputData()
  var error = data === null;

  if (!error) {
    $('#computeSpinner').addClass('spin');
    lastSendTime = new Date();
    socket.emit("compute", {data: data});
  } else {
    //alert("bad input");
    $("#myAlert").fadeTo(200, 1);
    /* $("#badInputModal").modal({
     show: true,
     keyboard: true,
     backdrop: true
     }); */
  }
}

$(document).ready(function() {
  $('#myAlert').hide();
  resizeMatrixInputTable(defaultMatrixHeight, defaultMatrixWidth);
  $("#sizeForm").submit(function() {
    tryResizeInput();
    return false;
  });
  $("#matrixWidthInput, #matrixHeightInput").change(function() {
    tryResizeInput();
  });
  $("#inputMatrixForm").submit(function() {
    trySendMatrix();
    return false;
  });

});



