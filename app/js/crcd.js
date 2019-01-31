//--------------------------------------------------------------------------------------
//--- CRCDv5
//--------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------
//--- This is the only allowable reference to the drawing canvas.
//--------------------------------------------------------------------------------------
//--- Main canvas for drawing.
var canvas = this.__canvas = new fabric.Canvas('panel1Canvas', {
  backgroundColor: 'rgb(255,255,255)'
});

//--- Preview canvas for later use.
var previewCanvas = this.__canvas = new fabric.Canvas('preview', {
  backgroundColor: 'rgb(255,0,0)',
  height: '400',
  width: '400',
});
//--------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------
//--- These are some globals we'll need
//--------------------------------------------------------------------------------------
var gridSizeFactor = 9; //--- Helps us size the grid to the page size.
var size = 90; //--- Helps us draw stuff. Note similarity to value above.
var x_gridNumberLeftOffset = 20;
var x_gridNumberTopOffset = 5;
var x_gridNumberTop = gridHeight - 25;
var y_gridNumberLeft = gridWidth - 15;
var y_gridNumberTopOffset = 20;
var y_gridNumberLeftOffset = 20;
var y_gridNumberTop = 5;
var clubName = $('#clubName').val();
var eventDate = $('#eventDate').val();
var levelName = $('#levelName').val();
var className = $('#className').val();
var fileName = (levelName + " " + className + " - " + clubName + " - " + eventDate);
//--------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------
//--- This handles the click of the "Create Course" button in the create course modal. 
//--- Basically, this is the entire reason we are even here.
//--------------------------------------------------------------------------------------
function addCanvasToTab(canvasId) {

  //console.log(canvasId)
    var canvas = new fabric.Canvas(canvasId);
    drawGridInTab(canvas);
    drawNumbersInTab(canvas);

}

function drawGridInTab(canvas) {

  //--- THis is where we break stuff.
  //var canvas = new fabric.Canvas(canvasId);


  //--- Clear the course! We'll not want to do this once we start adding things to the
  //--- field. We'll just want to remove gridlines and numbers.
  //--- TODO: Add a way to remove numbers and lines only.
  canvas.clear();
  $('#courseId').empty();

  //--- Get the dimensions of the grid from the form.
  var gridWidth = $('#gridWidth').val();
  var gridHeight = $('#gridHeight').val();

  //--- Get the measurement options from the form.
  var topBottomMeasureMode = $('#topBottomMeasureMode :selected').text();
  var leftRightMeasureMode = $('#leftRightMeasureMode :selected').text();

  //--- Fix the sizes to scale to the canvas size.
  gridWidth = gridWidth * gridSizeFactor;
  gridHeight = gridHeight * gridSizeFactor;

  //--- Size the grid properly. We have to add 2 pixels to the height and width because 
  //--- Fabric doesn't offer a "stroke inside" option and the border will fall outside 
  //--- of the canvas.
  canvas.setDimensions({
    width: gridWidth + 2,
    height: gridHeight + 2
  });

  //--- Draw a border around the entire canvas.
  canvas.add(new fabric.Rect({
    left: 0,
    top: 0,
    fill: 'transparent',
    width: gridWidth,
    height: gridHeight,
    strokeWidth: 1,
    stroke: '#999',
    selectable: false
  }));

  //--- Here is where we start swapping grid display options.
  //--- First, we'll handle top to bottom options.

  //--- This needs clarification:
  //--- The "Vertical" measurement on the form drives the lines from top to bottom.
  //--- The "Horizontal" measurement on the form drives the lines from left to right.  

  if (topBottomMeasureMode === "Center") {
    //--- THIS DRAWS HORIZONAL LINES!!
    //--- This is baseline mode. All lines start from the middle.
    //--- Add baseline lines along the Y axis. First thing is to find the middle and 
    //--- put a bold line there.

    //--- First, find the middle of the field along the x axis.
    var midPointHorizontal = gridHeight / 2;
    var upperLimit = Math.ceil((gridHeight / size) / 2);
    var fullUpperLimit = Math.ceil(gridHeight / size);

    //--- Now give us a line across the field and make it heavy.
    var hMidLine = new fabric.Line([gridWidth, 0, 0, 0], {
      left: 0,
      top: midPointHorizontal,
      stroke: '#999',
      selectable: false,
      strokeWidth: 2,
      id: 'line_horizontal_baseline_center'
    });
    canvas.add(hMidLine);
    canvas.sendToBack(hMidLine);

    //--- Now, we're going to start at the mid point and work our way to the bottom.
    for (var i = 0; i < upperLimit; ++i) {
      var hLine = new fabric.Line([gridWidth, 0, 0, 0], {
        left: 0,
        top: (i * size) + midPointHorizontal,
        stroke: '#999',
        selectable: false,
        id: 'line_horizontal_baseline_bottom_' + i
      });
      canvas.add(hLine);
      canvas.sendToBack(hLine);
    }

    //--- Next, let's add the lines between the top and the mid point.  
    for (var i = 0; i < upperLimit; ++i) {
      var hLine = new fabric.Line([gridWidth, 0, 0, 0], {
        left: 0,
        top: midPointHorizontal - (i * size),
        stroke: '#999',
        selectable: false,
        id: 'line_horizontal_baseline_top_' + i
      });
      canvas.add(hLine);
      canvas.sendToBack(hLine);
    }

  } else {
    //--- This is top/bottom mode for numbering. We don't need to differentiate between 
    //--- top or bottom ordering since we are just drawing lines.
    for (var i = 0; i < Math.ceil(gridHeight / size); ++i) {
      var hLine = new fabric.Line([gridWidth, 0, 0, 0], {
        left: 0,
        top: i * size,
        stroke: '#999',
        selectable: false,
        id: 'line_horizontal_' + i
      });
      canvas.add(hLine);
      canvas.sendToBack(hLine);
    }
  }


  //--- Now we'll handle left to right options
  if (leftRightMeasureMode === "Center") {
    //--- THIS DRAWS VERTICAL LINES!!
    //--- Add baseline lines along the Y axis. First thing is to find the middle and 
    //--- put a bold line there.
    var midPointVertical = gridWidth / 2;
    var upperLimit = Math.ceil((gridWidth / size) / 2);
    var fullUpperLimit = Math.ceil(gridWidth / size);
    var vMidLine = new fabric.Line([0, 0, 0, gridHeight], {
      left: midPointVertical,
      top: 0,
      stroke: '#999',
      selectable: false,
      strokeWidth: 2,
      id: 'line_vertical_baseline_center'
    });
    canvas.add(vMidLine);
    canvas.sendToBack(vMidLine);

    //--- Now, we're going to start at the mid point and work our way to the right. Note 
    //--- that we can reuse the midPointHorizontal value as the size of each half.  
    for (var i = 0; i < upperLimit; ++i) {
      var vLine = new fabric.Line([0, 0, 0, gridHeight], {
        left: (i * size) + midPointVertical,
        top: 0,
        stroke: '#999',
        selectable: false,
        id: 'line_vertical_baseline_right_' + i
      });
      canvas.add(vLine);
      canvas.sendToBack(vLine);
    }

    //--- Next, let's add the lines between the left wall and the mid point.  
    for (var i = 0; i < upperLimit; ++i) {
      var vLine = new fabric.Line([0, 0, 0, gridHeight], {
        left: midPointVertical - (i * size),
        top: 0,
        stroke: '#999',
        selectable: false,
        id: 'line_vertical_baseline_left_' + i
      });
      canvas.add(vLine);
      canvas.sendToBack(vLine);
    }

  } else {
    //--- This is left/right mode for numbering. We don't need to differentiate between 
    //--- left or right ordering since we are just drawing lines.
    for (var i = 0; i < Math.ceil(gridHeight / size); ++i) {
      var vLine = new fabric.Line([0, 0, 0, gridHeight], {
        left: gridWidth - (i * size),
        top: 0,
        stroke: '#999',
        selectable: false,
        id: 'line_vertical_' + i
      });
      canvas.add(vLine);
      canvas.sendToBack(vLine);
    }
  }
}

function drawGrid() {

  //--- Clear the course! We'll not want to do this once we start adding things to the
  //--- field. We'll just want to remove gridlines and numbers.
  //--- TODO: Add a way to remove numbers and lines only.
  canvas.clear();
  $('#courseId').empty();

  //--- Get the dimensions of the grid from the form.
  var gridWidth = $('#gridWidth').val();
  var gridHeight = $('#gridHeight').val();

  //--- Get the measurement options from the form.
  var topBottomMeasureMode = $('#topBottomMeasureMode :selected').text();
  var leftRightMeasureMode = $('#leftRightMeasureMode :selected').text();

  //--- Fix the sizes to scale to the canvas size.
  gridWidth = gridWidth * gridSizeFactor;
  gridHeight = gridHeight * gridSizeFactor;

  //--- Size the grid properly. We have to add 2 pixels to the height and width because 
  //--- Fabric doesn't offer a "stroke inside" option and the border will fall outside 
  //--- of the canvas.
  canvas.setDimensions({
    width: gridWidth + 2,
    height: gridHeight + 2
  });

  //--- Draw a border around the entire canvas.
  canvas.add(new fabric.Rect({
    left: 0,
    top: 0,
    fill: 'transparent',
    width: gridWidth,
    height: gridHeight,
    strokeWidth: 1,
    stroke: '#999',
    selectable: false
  }));

  //--- Here is where we start swapping grid display options.
  //--- First, we'll handle top to bottom options.

  //--- This needs clarification:
  //--- The "Vertical" measurement on the form drives the lines from top to bottom.
  //--- The "Horizontal" measurement on the form drives the lines from left to right.  

  if (topBottomMeasureMode === "Center") {
    //--- THIS DRAWS HORIZONAL LINES!!
    //--- This is baseline mode. All lines start from the middle.
    //--- Add baseline lines along the Y axis. First thing is to find the middle and 
    //--- put a bold line there.

    //--- First, find the middle of the field along the x axis.
    var midPointHorizontal = gridHeight / 2;
    var upperLimit = Math.ceil((gridHeight / size) / 2);
    var fullUpperLimit = Math.ceil(gridHeight / size);

    //--- Now give us a line across the field and make it heavy.
    var hMidLine = new fabric.Line([gridWidth, 0, 0, 0], {
      left: 0,
      top: midPointHorizontal,
      stroke: '#999',
      selectable: false,
      strokeWidth: 2,
      id: 'line_horizontal_baseline_center'
    });
    canvas.add(hMidLine);
    canvas.sendToBack(hMidLine);

    //--- Now, we're going to start at the mid point and work our way to the bottom.
    for (var i = 0; i < upperLimit; ++i) {
      var hLine = new fabric.Line([gridWidth, 0, 0, 0], {
        left: 0,
        top: (i * size) + midPointHorizontal,
        stroke: '#999',
        selectable: false,
        id: 'line_horizontal_baseline_bottom_' + i
      });
      canvas.add(hLine);
      canvas.sendToBack(hLine);
    }

    //--- Next, let's add the lines between the top and the mid point.  
    for (var i = 0; i < upperLimit; ++i) {
      var hLine = new fabric.Line([gridWidth, 0, 0, 0], {
        left: 0,
        top: midPointHorizontal - (i * size),
        stroke: '#999',
        selectable: false,
        id: 'line_horizontal_baseline_top_' + i
      });
      canvas.add(hLine);
      canvas.sendToBack(hLine);
    }

  } else {
    //--- This is top/bottom mode for numbering. We don't need to differentiate between 
    //--- top or bottom ordering since we are just drawing lines.
    for (var i = 0; i < Math.ceil(gridHeight / size); ++i) {
      var hLine = new fabric.Line([gridWidth, 0, 0, 0], {
        left: 0,
        top: i * size,
        stroke: '#999',
        selectable: false,
        id: 'line_horizontal_' + i
      });
      canvas.add(hLine);
      canvas.sendToBack(hLine);
    }
  }


  //--- Now we'll handle left to right options
  if (leftRightMeasureMode === "Center") {
    //--- THIS DRAWS VERTICAL LINES!!
    //--- Add baseline lines along the Y axis. First thing is to find the middle and 
    //--- put a bold line there.
    var midPointVertical = gridWidth / 2;
    var upperLimit = Math.ceil((gridWidth / size) / 2);
    var fullUpperLimit = Math.ceil(gridWidth / size);
    var vMidLine = new fabric.Line([0, 0, 0, gridHeight], {
      left: midPointVertical,
      top: 0,
      stroke: '#999',
      selectable: false,
      strokeWidth: 2,
      id: 'line_vertical_baseline_center'
    });
    canvas.add(vMidLine);
    canvas.sendToBack(vMidLine);

    //--- Now, we're going to start at the mid point and work our way to the right. Note 
    //--- that we can reuse the midPointHorizontal value as the size of each half.  
    for (var i = 0; i < upperLimit; ++i) {
      var vLine = new fabric.Line([0, 0, 0, gridHeight], {
        left: (i * size) + midPointVertical,
        top: 0,
        stroke: '#999',
        selectable: false,
        id: 'line_vertical_baseline_right_' + i
      });
      canvas.add(vLine);
      canvas.sendToBack(vLine);
    }

    //--- Next, let's add the lines between the left wall and the mid point.  
    for (var i = 0; i < upperLimit; ++i) {
      var vLine = new fabric.Line([0, 0, 0, gridHeight], {
        left: midPointVertical - (i * size),
        top: 0,
        stroke: '#999',
        selectable: false,
        id: 'line_vertical_baseline_left_' + i
      });
      canvas.add(vLine);
      canvas.sendToBack(vLine);
    }

  } else {
    //--- This is left/right mode for numbering. We don't need to differentiate between 
    //--- left or right ordering since we are just drawing lines.
    for (var i = 0; i < Math.ceil(gridHeight / size); ++i) {
      var vLine = new fabric.Line([0, 0, 0, gridHeight], {
        left: gridWidth - (i * size),
        top: 0,
        stroke: '#999',
        selectable: false,
        id: 'line_vertical_' + i
      });
      canvas.add(vLine);
      canvas.sendToBack(vLine);
    }
  }
}

//--------------------------------------------------------------------------------------
//--- Draw numbers on the grid
//--------------------------------------------------------------------------------------
function drawNumbersInTab(canvas) {

 //--- THis is where we break stuff.
  //var canvas = new fabric.Canvas(canvasId);
  //var canvas = document.getElementById(canvasId).fabric;

  //--- Get the grid dimensions from the form.
  var gridWidth = $('#gridWidth').val();
  var gridHeight = $('#gridHeight').val();

  //--- Get the measurement options from the form.
  var topBottomMeasureMode = $('#topBottomMeasureMode :selected').text();
  var leftRightMeasureMode = $('#leftRightMeasureMode :selected').text();

  //--- Fix the sizes.
  gridWidth = gridWidth * gridSizeFactor;
  gridHeight = gridHeight * gridSizeFactor;

  //--- Draw the numbers on the grid.
  //--- Let's start with the basics. How many numbers will we need on each axis?
  var x_numberOfNumbers = gridHeight / size;
  var y_numberOfNumbers = gridWidth / size;
  var x_numbersArrayLimit = x_numberOfNumbers * 10
  var y_numbersArrayLimit = y_numberOfNumbers * 10

  //--- Some declarations to keep it neat and tidy.
  var fontSize = 14
  var fontFamily = 'Helvetica'
  var fontWeight = 'normal'
  var opacity = 1

  //--- create an array to hold the course numbers
  var x_arrNumbers = [];
  var y_arrNumbers = [];

  //--- Create a loop and add the needed course numbers to the array.
  //--- We'll create the numbers in increments of 10.
  for (var a = 10; a < x_numbersArrayLimit; a += 10) {
    x_arrNumbers.push(a);
  }
  for (var a = 10; a < y_numbersArrayLimit; a += 10) {
    y_arrNumbers.push(a);
  }

  //--- Handle the direction of the numbers.
  if (topBottomMeasureMode == "Bottom") {
    x_arrNumbers.sort(function (a, b) {
      return b - a
    });
  } else if (topBottomMeasureMode == "Top") {
    x_arrNumbers.sort(function (a, b) {
      return a - b
    });
  }

  if (leftRightMeasureMode == "Left") {
    y_arrNumbers.sort(function (a, b) {
      return b - a
    });
  } else if (leftRightMeasureMode == "Right") {
    y_arrNumbers.sort(function (a, b) {
      return a - b
    });
  }

  //--- HOLY SHIT THIS IS PISSING ME THE FUCK OFF
  //--- We need to clear off all the numbers from the grid. Fabric doesn't
  //--- really allow us to grab objects by ID and change them, so it really 
  //--- seems to work best to clear off the numbers and then just redraw them.
  canvas.forEachObject(function (obj) {
    var numId = obj.id;
    if (numId) {
      if (numId.includes("num_") && obj.type === "text") {
        obj.text = " ";
      }
    }
  });

  //--- Start a loop based on the numberOfNumbers value. Then, add 
  //--- a number to the course based on i, but get that number from
  //--- arrNumbers. The loop starts at 1 so that the first number falls 
  //--- in the correct place, we when we get the number from arrNumbers, we
  //--- need to offset by one to hit the correct place in the array.

  if (topBottomMeasureMode === "Center") {

    //--- Calculate the center
    var midPointVertical = gridHeight / 2;

    //--- Give me a zero on the left side.
    canvas.add(new fabric.Text("0", {
      left: 5,
      top: midPointVertical + x_gridNumberTopOffset,
      fontSize: fontSize,
      fontFamily: fontFamily,
      fontWeight: fontWeight,
      id: numId,
      selectable: false
    }));

    //--- Give me a zero on the right side.
    canvas.add(new fabric.Text("0", {
      left: gridWidth - 12,
      top: midPointVertical + x_gridNumberTopOffset,
      fontSize: fontSize,
      fontFamily: fontFamily,
      fontWeight: fontWeight,
      id: numId,
      selectable: false
    }));

    //--- Baseline numbers are weird. We basically have to count backwards on 
    //--- both sides to make the numbers correct. Let's start by figuring out 
    //--- how many horizontal lines we need to draw.
    var horizontalLineCount = Math.ceil((gridHeight / 2) / size)

    //--- Add the numbers to the grid to the bottom of the midpoint line.
    //--- We're counting backwards here, starting from the value in horizontalLineCount
    //--- and going to zero. The number value will be displayed as y times 10. This 
    //--- is for the left side.
    for (var y = horizontalLineCount - 1; y > 0; y--) {
      var num = (y * 10).toString();
      var numId = "num_baseline_bottom_left_" + num;
      canvas.add(new fabric.Text("-" + num, {
        left: 5,
        top: midPointVertical + (y * size) + 5,
        fontSize: fontSize,
        fontFamily: fontFamily,
        fontWeight: fontWeight,
        id: numId,
        selectable: false
      }));
    }

    //--- Now show them on the right side
    for (var y = horizontalLineCount - 1; y > 0; y--) {
      var num = (y * 10).toString();
      var numId = "num_baseline_bottom_right_" + num;
      canvas.add(new fabric.Text("-" + num, {
        left: gridWidth - 25,
        top: midPointVertical + (y * size) + 5,
        fontSize: fontSize,
        fontFamily: fontFamily,
        fontWeight: fontWeight,
        id: numId,
        selectable: false
      }));
    }

    //--- Next, let's add the lines between the mid point and the top on the left
    for (var y = 1; y < Math.ceil((gridHeight / size) / 2); ++y) {
      var num = (y * 10).toString();
      var numId = "num_baseline_bottom_left_" + num;
      canvas.add(new fabric.Text(num, {
        left: 5,
        top: midPointVertical - (y * size - 5),
        fontSize: fontSize,
        fontFamily: fontFamily,
        fontWeight: fontWeight,
        id: numId,
        selectable: false
      }));
    }

    //--- Next, let's add the lines between the mid point and the top on the right
    for (var y = 1; y < Math.ceil((gridHeight / size) / 2); ++y) {
      var num = (y * 10).toString();
      var numId = "num_baseline_bottom_left_" + num;
      canvas.add(new fabric.Text(num, {
        left: gridWidth - 20,
        top: midPointVertical - (y * size - 5),
        fontSize: fontSize,
        fontFamily: fontFamily,
        fontWeight: fontWeight,
        id: numId,
        selectable: false
      }));
    }
  } else {

    //--- Here are the x-axis numbers on the RIGHT.
    for (var x = 1; x < x_numberOfNumbers; ++x) {
      var num = x_arrNumbers[x - 1].toString();
      var numId = "num_right_" + num;
      canvas.add(new fabric.Text(num, {
        left: gridWidth - x_gridNumberLeftOffset,
        top: x * size + x_gridNumberTopOffset,
        fontSize: fontSize,
        fontFamily: fontFamily,
        fontWeight: fontWeight,
        opacity: 1,
        id: numId,
        selectable: false
      }));
    }

    //--- Here are the x-axis numbers on the LEFT.
    for (var x = 1; x < x_numberOfNumbers; ++x) {
      var num = x_arrNumbers[x - 1].toString();
      var numId = "num_left_" + num;
      canvas.add(new fabric.Text(num.toString(), {
        left: 5,
        top: x * size + x_gridNumberTopOffset,
        fontSize: fontSize,
        fontFamily: fontFamily,
        fontWeight: fontWeight,
        id: numId,
        selectable: false
      }));deleteFromLocalStorage
    }

  }

  if (leftRightMeasureMode === "Center") {

    //--- Calculate the mid point
    var midPointHorizontal = gridWidth / 2;

    //--- Give me a zero at the bottom
    canvas.add(new fabric.Text("0", {
      left: gridWidth - (midPointHorizontal + (y_gridNumberLeftOffset / 2)),
      top: gridHeight - y_gridNumberTopOffset,
      fontSize: fontSize,
      fontFamily: fontFamily,
      fontWeight: fontWeight,
      id: numId,
      selectable: false
    }));

    //--- Now a zero at the top.
    canvas.add(new fabric.Text("0", {
      left: gridWidth - (midPointHorizontal + (y_gridNumberLeftOffset / 2)),
      top: y_gridNumberTop,
      fontSize: fontSize,
      fontFamily: fontFamily,
      fontWeight: fontWeight,
      id: numId,
      selectable: false
    }));

    //--- Baseline numbers are weird. We basically have to count backwards on 
    //--- both sides to make the numbers correct. Let's start by figuring out 
    //--- how many vertical lines we need to draw.
    var verticalLineCount = Math.ceil((gridWidth / 2) / size)

    //--- Add the numbers to the grid to the right of the midpoint line at the top.
    //--- We're counting backwards here, starting from the value in verticalLineCount
    //--- and going to zero. The number value will be displayed as y times 10.
    for (var y = verticalLineCount - 1; y > 0; y--) {
      var num = (y * 10).toString();
      var numId = "num_baseline_bottom_right_" + num;
      canvas.add(new fabric.Text(num, {
        left: midPointHorizontal + (y * size) - 20, //--- place the number to the left of the line
        top: y_gridNumberTop,
        fontSize: fontSize,
        fontFamily: fontFamily,
        fontWeight: fontWeight,
        id: numId,
        selectable: false
      }));
    }

    //--- Here are the same numbers along the bottom.
    for (var y = verticalLineCount - 1; y > 0; y--) {
      var num = (y * 10).toString();
      var numId = "num_baseline_bottom_right_" + num;
      canvas.add(new fabric.Text(num, {
        left: midPointHorizontal + (y * size) - 20,
        top: gridHeight - y_gridNumberTopOffset,
        fontSize: fontSize,
        fontFamily: fontFamily,
        fontWeight: fontWeight,
        id: numId,
        selectable: false
      }));
    }


    //--- Next, let's add the lines between the left wall and the mid point at the bottom.  
    for (var y = 1; y < Math.ceil((gridWidth / size) / 2); ++y) {
      var num = (y * 10).toString();
      var numId = "num_baseline_bottom_left_" + num;
      canvas.add(new fabric.Text("-" + num, {
        left: midPointHorizontal - (y * size + 25),
        top: gridHeight - y_gridNumberTopOffset,
        fontSize: fontSize,
        fontFamily: fontFamily,
        fontWeight: fontWeight,
        id: numId,
        selectable: false
      }));
    }

    //--- Next, let's add the lines between the left wall and the mid point at the top.  
    for (var y = 1; y < Math.ceil((gridWidth / size) / 2); ++y) {
      var num = (y * 10).toString();
      var numId = "num_baseline_top_left_" + num;
      canvas.add(new fabric.Text("-" + num, {
        left: midPointHorizontal - (y * size + 25),
        top: y_gridNumberTop,
        fontSize: fontSize,
        fontFamily: fontFamily,
        fontWeight: fontWeight,
        id: numId,
        selectable: false
      }));
    }

  } else {

    //--- Here are the y axis on the bottom.
    for (var y = 1; y < y_numberOfNumbers; ++y) {
      var num = y_arrNumbers[y - 1].toString();
      var numId = "num_bottom_" + num;
      canvas.add(new fabric.Text(num.toString(), {
        left: gridWidth - (y * size + y_gridNumberLeftOffset),
        top: gridHeight - y_gridNumberTopOffset,
        fontSize: fontSize,
        fontFamily: fontFamily,
        fontWeight: fontWeight,
        id: numId,
        selectable: false
      }));
    }

    //--- Here are the y axis on the top.
    for (var y = 1; y < y_numberOfNumbers; ++y) {
      var num = y_arrNumbers[y - 1].toString();
      var numId = "num_top_" + num;
      canvas.add(new fabric.Text(num.toString(), {
        left: gridWidth - (y * size + y_gridNumberLeftOffset),
        top: y_gridNumberTop,
        fontSize: fontSize,
        fontFamily: fontFamily,
        fontWeight: fontWeight,
        id: numId,
        selectable: false
      }));
    }
  }
}

function drawNumbers() {

  //--- Get the grid dimensions from the form.
  var gridWidth = $('#gridWidth').val();
  var gridHeight = $('#gridHeight').val();

  //--- Get the measurement options from the form.
  var topBottomMeasureMode = $('#topBottomMeasureMode :selected').text();
  var leftRightMeasureMode = $('#leftRightMeasureMode :selected').text();

  //--- Fix the sizes.
  gridWidth = gridWidth * gridSizeFactor;
  gridHeight = gridHeight * gridSizeFactor;

  //--- Draw the numbers on the grid.
  //--- Let's start with the basics. How many numbers will we need on each axis?
  var x_numberOfNumbers = gridHeight / size;
  var y_numberOfNumbers = gridWidth / size;
  var x_numbersArrayLimit = x_numberOfNumbers * 10
  var y_numbersArrayLimit = y_numberOfNumbers * 10

  //--- Some declarations to keep it neat and tidy.
  var fontSize = 14
  var fontFamily = 'Helvetica'
  var fontWeight = 'normal'
  var opacity = 1

  //--- create an array to hold the course numbers
  var x_arrNumbers = [];
  var y_arrNumbers = [];

  //--- Create a loop and add the needed course numbers to the array.
  //--- We'll create the numbers in increments of 10.
  for (var a = 10; a < x_numbersArrayLimit; a += 10) {
    x_arrNumbers.push(a);
  }
  for (var a = 10; a < y_numbersArrayLimit; a += 10) {
    y_arrNumbers.push(a);
  }

  //--- Handle the direction of the numbers.
  if (topBottomMeasureMode == "Bottom") {
    x_arrNumbers.sort(function (a, b) {
      return b - a
    });
  } else if (topBottomMeasureMode == "Top") {
    x_arrNumbers.sort(function (a, b) {
      return a - b
    });
  }

  if (leftRightMeasureMode == "Left") {
    y_arrNumbers.sort(function (a, b) {
      return b - a
    });
  } else if (leftRightMeasureMode == "Right") {
    y_arrNumbers.sort(function (a, b) {
      return a - b
    });
  }

  //--- HOLY SHIT THIS IS PISSING ME THE FUCK OFF
  //--- We need to clear off all the numbers from the grid. Fabric doesn't
  //--- really allow us to grab objects by ID and change them, so it really 
  //--- seems to work best to clear off the numbers and then just redraw them.
  canvas.forEachObject(function (obj) {
    var numId = obj.id;
    if (numId) {
      if (numId.includes("num_") && obj.type === "text") {
        obj.text = " ";
      }
    }
  });

  //--- Start a loop based on the numberOfNumbers value. Then, add 
  //--- a number to the course based on i, but get that number from
  //--- arrNumbers. The loop starts at 1 so that the first number falls 
  //--- in the correct place, we when we get the number from arrNumbers, we
  //--- need to offset by one to hit the correct place in the array.

  if (topBottomMeasureMode === "Center") {

    //--- Calculate the center
    var midPointVertical = gridHeight / 2;

    //--- Give me a zero on the left side.
    canvas.add(new fabric.Text("0", {
      left: 5,
      top: midPointVertical + x_gridNumberTopOffset,
      fontSize: fontSize,
      fontFamily: fontFamily,
      fontWeight: fontWeight,
      id: numId,
      selectable: false
    }));

    //--- Give me a zero on the right side.
    canvas.add(new fabric.Text("0", {
      left: gridWidth - 12,
      top: midPointVertical + x_gridNumberTopOffset,
      fontSize: fontSize,
      fontFamily: fontFamily,
      fontWeight: fontWeight,
      id: numId,
      selectable: false
    }));

    //--- Baseline numbers are weird. We basically have to count backwards on 
    //--- both sides to make the numbers correct. Let's start by figuring out 
    //--- how many horizontal lines we need to draw.
    var horizontalLineCount = Math.ceil((gridHeight / 2) / size)

    //--- Add the numbers to the grid to the bottom of the midpoint line.
    //--- We're counting backwards here, starting from the value in horizontalLineCount
    //--- and going to zero. The number value will be displayed as y times 10. This 
    //--- is for the left side.
    for (var y = horizontalLineCount - 1; y > 0; y--) {
      var num = (y * 10).toString();
      var numId = "num_baseline_bottom_left_" + num;
      canvas.add(new fabric.Text("-" + num, {
        left: 5,
        top: midPointVertical + (y * size) + 5,
        fontSize: fontSize,
        fontFamily: fontFamily,
        fontWeight: fontWeight,
        id: numId,
        selectable: false
      }));
    }

    //--- Now show them on the right side
    for (var y = horizontalLineCount - 1; y > 0; y--) {
      var num = (y * 10).toString();
      var numId = "num_baseline_bottom_right_" + num;
      canvas.add(new fabric.Text("-" + num, {
        left: gridWidth - 25,
        top: midPointVertical + (y * size) + 5,
        fontSize: fontSize,
        fontFamily: fontFamily,
        fontWeight: fontWeight,
        id: numId,
        selectable: false
      }));
    }

    //--- Next, let's add the lines between the mid point and the top on the left
    for (var y = 1; y < Math.ceil((gridHeight / size) / 2); ++y) {
      var num = (y * 10).toString();
      var numId = "num_baseline_bottom_left_" + num;
      canvas.add(new fabric.Text(num, {
        left: 5,
        top: midPointVertical - (y * size - 5),
        fontSize: fontSize,
        fontFamily: fontFamily,
        fontWeight: fontWeight,
        id: numId,
        selectable: false
      }));
    }

    //--- Next, let's add the lines between the mid point and the top on the right
    for (var y = 1; y < Math.ceil((gridHeight / size) / 2); ++y) {
      var num = (y * 10).toString();
      var numId = "num_baseline_bottom_left_" + num;
      canvas.add(new fabric.Text(num, {
        left: gridWidth - 20,
        top: midPointVertical - (y * size - 5),
        fontSize: fontSize,
        fontFamily: fontFamily,
        fontWeight: fontWeight,
        id: numId,
        selectable: false
      }));
    }
  } else {

    //--- Here are the x-axis numbers on the RIGHT.
    for (var x = 1; x < x_numberOfNumbers; ++x) {
      var num = x_arrNumbers[x - 1].toString();
      var numId = "num_right_" + num;
      canvas.add(new fabric.Text(num, {
        left: gridWidth - x_gridNumberLeftOffset,
        top: x * size + x_gridNumberTopOffset,
        fontSize: fontSize,
        fontFamily: fontFamily,
        fontWeight: fontWeight,
        opacity: 1,
        id: numId,
        selectable: false
      }));
    }

    //--- Here are the x-axis numbers on the LEFT.
    for (var x = 1; x < x_numberOfNumbers; ++x) {
      var num = x_arrNumbers[x - 1].toString();
      var numId = "num_left_" + num;
      canvas.add(new fabric.Text(num.toString(), {
        left: 5,
        top: x * size + x_gridNumberTopOffset,
        fontSize: fontSize,
        fontFamily: fontFamily,
        fontWeight: fontWeight,
        id: numId,
        selectable: false
      }));deleteFromLocalStorage
    }

  }

  if (leftRightMeasureMode === "Center") {

    //--- Calculate the mid point
    var midPointHorizontal = gridWidth / 2;

    //--- Give me a zero at the bottom
    canvas.add(new fabric.Text("0", {
      left: gridWidth - (midPointHorizontal + (y_gridNumberLeftOffset / 2)),
      top: gridHeight - y_gridNumberTopOffset,
      fontSize: fontSize,
      fontFamily: fontFamily,
      fontWeight: fontWeight,
      id: numId,
      selectable: false
    }));

    //--- Now a zero at the top.
    canvas.add(new fabric.Text("0", {
      left: gridWidth - (midPointHorizontal + (y_gridNumberLeftOffset / 2)),
      top: y_gridNumberTop,
      fontSize: fontSize,
      fontFamily: fontFamily,
      fontWeight: fontWeight,
      id: numId,
      selectable: false
    }));

    //--- Baseline numbers are weird. We basically have to count backwards on 
    //--- both sides to make the numbers correct. Let's start by figuring out 
    //--- how many vertical lines we need to draw.
    var verticalLineCount = Math.ceil((gridWidth / 2) / size)

    //--- Add the numbers to the grid to the right of the midpoint line at the top.
    //--- We're counting backwards here, starting from the value in verticalLineCount
    //--- and going to zero. The number value will be displayed as y times 10.
    for (var y = verticalLineCount - 1; y > 0; y--) {
      var num = (y * 10).toString();
      var numId = "num_baseline_bottom_right_" + num;
      canvas.add(new fabric.Text(num, {
        left: midPointHorizontal + (y * size) - 20, //--- place the number to the left of the line
        top: y_gridNumberTop,
        fontSize: fontSize,
        fontFamily: fontFamily,
        fontWeight: fontWeight,
        id: numId,
        selectable: false
      }));
    }

    //--- Here are the same numbers along the bottom.
    for (var y = verticalLineCount - 1; y > 0; y--) {
      var num = (y * 10).toString();
      var numId = "num_baseline_bottom_right_" + num;
      canvas.add(new fabric.Text(num, {
        left: midPointHorizontal + (y * size) - 20,
        top: gridHeight - y_gridNumberTopOffset,
        fontSize: fontSize,
        fontFamily: fontFamily,
        fontWeight: fontWeight,
        id: numId,
        selectable: false
      }));
    }


    //--- Next, let's add the lines between the left wall and the mid point at the bottom.  
    for (var y = 1; y < Math.ceil((gridWidth / size) / 2); ++y) {
      var num = (y * 10).toString();
      var numId = "num_baseline_bottom_left_" + num;
      canvas.add(new fabric.Text("-" + num, {
        left: midPointHorizontal - (y * size + 25),
        top: gridHeight - y_gridNumberTopOffset,
        fontSize: fontSize,
        fontFamily: fontFamily,
        fontWeight: fontWeight,
        id: numId,
        selectable: false
      }));
    }

    //--- Next, let's add the lines between the left wall and the mid point at the top.  
    for (var y = 1; y < Math.ceil((gridWidth / size) / 2); ++y) {
      var num = (y * 10).toString();
      var numId = "num_baseline_top_left_" + num;
      canvas.add(new fabric.Text("-" + num, {
        left: midPointHorizontal - (y * size + 25),
        top: y_gridNumberTop,
        fontSize: fontSize,
        fontFamily: fontFamily,
        fontWeight: fontWeight,
        id: numId,
        selectable: false
      }));
    }

  } else {

    //--- Here are the y axis on the bottom.
    for (var y = 1; y < y_numberOfNumbers; ++y) {
      var num = y_arrNumbers[y - 1].toString();
      var numId = "num_bottom_" + num;
      canvas.add(new fabric.Text(num.toString(), {
        left: gridWidth - (y * size + y_gridNumberLeftOffset),
        top: gridHeight - y_gridNumberTopOffset,
        fontSize: fontSize,
        fontFamily: fontFamily,
        fontWeight: fontWeight,
        id: numId,
        selectable: false
      }));
    }

    //--- Here are the y axis on the top.
    for (var y = 1; y < y_numberOfNumbers; ++y) {
      var num = y_arrNumbers[y - 1].toString();
      var numId = "num_top_" + num;
      canvas.add(new fabric.Text(num.toString(), {
        left: gridWidth - (y * size + y_gridNumberLeftOffset),
        top: y_gridNumberTop,
        fontSize: fontSize,
        fontFamily: fontFamily,
        fontWeight: fontWeight,
        id: numId,
        selectable: false
      }));
    }
  }
}

