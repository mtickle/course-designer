//--------------------------------------------------------------------------------------
//--- Inject new course IPC
//-------------------------------------------------------------------------------------- 
// $(document).ready(function () {
//     var ipc = require('electron').ipcRenderer;

//     ipc.on('menu:new-course', function(){
//       ipc.send('window:new-course');
//   });
// });
//--------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------
//--- This handles clearing the course. This needs to be fixed to just remove 
//--- items from the field and not actually remove the field.
//-------------------------------------------------------------------------------------- 
$('#btnClearTheCourse').click(function () {
    var canvas = this.__canvas = new fabric.Canvas('paper');  
    canvas.getActiveGroup().forEachObject(function(o){ canvas.remove(o) }); canvas.discardActiveGroup().renderAll();
    canvas.clear();      
});
//--------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------
//--- Button handler for the "Create New Couse" modal.
//--------------------------------------------------------------------------------------
$(function () {
  $('#btnGrid').click(function () {
    drawGrid();
  });
});
//--------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------
//--- This handles exporting the course as an image.
//--------------------------------------------------------------------------------------
$("#exportToPNG").click(function(){
  downloadCanvas(this, 'paper', 'test.png');
});
//--------------------------------------------------------------------------------------
function downloadCanvas(link, canvasId, filename) {
    link.href = document.getElementById(canvasId).toDataURL();
    link.download = filename;
}
//--------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------
//--- This is supposed to export the canvas as a JSON, but its not really working.
//--------------------------------------------------------------------------------------
//--- WHAT YOU HAVE TRIED SO FAR (and failed with):
//--- 1. Setting all the objects in the field as active and selectable.
//--- 2. Giving the objects IDs.
//--- 3. toDatalessJSON
//--- 4. canvas.isDrawingMode = false;
//--- 5. fabric.Object.prototype.objectCaching = false;
//--- 6. JSON.stringify(canvas) 
//--------------------------------------------------------------------------------------
//--- HERE'S THE PROBLEM: Everytime you get a reference to the drawing canvas
//--- as "new fabric.Canvas", another fucking upper-canvas gets created and then
//--- you end up exporting nothing because the NEW upper-canvas is BLANK. YOU ASSHOLE. 
//--------------------------------------------------------------------------------------
$("#exportToJSON").click(function(){

  var canvas = document.getElementById('paper');
  alert("This doesn't work.");
  //var canvas = this.__canvas = new fabric.Canvas('paper');  
  
});
//--------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------
//--- This is the main function that will draw and redraw the field grid. It handles both
//--- drawing the gridlines and the placement of measurement markers.
//--------------------------------------------------------------------------------------
function drawGrid() {

  //--------------------------------------------------------------------------------------
  //--- Declarations
  //--------------------------------------------------------------------------------------
    //var canvas = this.__canvas = new fabric.Canvas('c');
    var gridHeaderGroup = new fabric.Group();
    var gridLinesGroup = new fabric.Group();
    var gridNumbersGroup = new fabric.Group();
    var gridSizeFactor = 9;
    var gridNumber;
    //--------------------------------------------------------------------------------------


  //--------------------------------------------------------------------------------------
  //--- Hide the jumbotron div.
  if (document.getElementById("jumbotron").style.display != "none") {
     document.getElementById("jumbotron").style.display = "none"
  }
   //--------------------------------------------------------------------------------------

    //--------------------------------------------------------------------------------------
    //--- Size the grid properly. We have to add 2 pixels to the height and width because 
    //--- Fabric doesn't offer a "stroke inside" option and the border will fall outside 
    //--- of the canvas.
    //--------------------------------------------------------------------------------------
    var gridWidth = $('#gridWidth').val() * gridSizeFactor;
    var gridHeight = $('#gridHeight').val() * gridSizeFactor;
    var canvasContainer = document.getElementById('designer'); 

    //--- Fuck you, fabric. Fuck you and your multiple canvases that you
    //--- just leave laying around and NEVER FUCKING CLEAN UP.

    canvasContainer.innerHTML = "";
    var canvas = document.createElement('canvas');
    canvas.id = "paper";
    canvasContainer.appendChild(canvas);
    var canvas = this.__canvas = new fabric.Canvas('paper', {backgroundColor: 'rgb(255,255,255)'});

    canvas.setDimensions({
      width: gridWidth + 2,
      height: gridHeight + 52
    });
  //--------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------
//--- Add some text to the course map
//--------------------------------------------------------------------------------------
var clubName =  $('#clubName').val();
var eventDate =  $('#eventDate').val();
var levelName =  $('#levelName').val();
var className =  $('#className').val();

    var text = new fabric.Text(levelName + " " + className + " -  " + clubName + " - " + eventDate, {
      id: "headerText", 
      left: 20,
      top: 5,
      fontSize: 24,
      fontFamily: 'Helvetica',
      fontWeight: 'normal',
    });
gridHeaderGroup.add(text);
canvas.add(gridHeaderGroup);
//--------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------
//--- Declarations for the grid lines.
//--------------------------------------------------------------------------------------
  var width = gridWidth;
  var height = gridHeight;
  var j = 0;
  var line = null;
  var rect = [];
  var size = 90;  
  var x_gridNumberOffset = 14;
  var x_gridNumberTopOffset = 7;
  var x_gridNumberTop = gridHeight - 25;
  var y_gridNumberLeft = gridWidth - 12;
  var y_gridNumberOffset = 12;
  var y_gridNumberTopOffset = 5;
//--------------------------------------------------------------------------------------



//--------------------------------------------------------------------------------------
//--- Draw a border around the entire canvas.
//--------------------------------------------------------------------------------------
  var rect = new fabric.Rect({
    left: 0,
    top: 0,
    fill: 'transparent',
    width: gridWidth,
    height: gridHeight,
    strokeWidth: 1,
    stroke: '#999'
  });
  gridLinesGroup.add(rect);
//--------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------
//--- Draw the vertical lines in a loop and add each to the gridLinesGroup.
//--------------------------------------------------------------------------------------
  for (var i = 0; i < Math.ceil(width / 20); ++i) {
    var line = new fabric.Line([0, 0, 0, gridHeight], {
      stroke: '#999',
      strokeWidth: 1,
      left: i * size,
      top: 35,
    });
    gridLinesGroup.add(line);
  }
//--------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------
//--- Draw the horizontal lines in a loop and add each to the gridLinesGroup.
//--------------------------------------------------------------------------------------
  for (var i = 0; i < Math.ceil(width / 20); ++i) {
    var line = new fabric.Line([gridWidth, 0, 0, 0], {
      stroke: '#999',
      strokeWidth: 1,
      left: 0,
      top: i * size + 35,
    });
    gridLinesGroup.add(line);
  }
//--------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------
//--- If the checkbox to draw the grid lines is selected, add the gridLinesGroup to 
//--- the canvas.
//--------------------------------------------------------------------------------------
  if ($(showGrid).is(":checked")) {
    canvas.add(gridLinesGroup);
  }
//--------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------
//--- Now, add the measurement markers to the grid. I hate this part. There is some 
//--- significant work to be done here with the different ways that the numbers 
//--- be rendered.
//--------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------
//--- Add the numbers along the Y axis.
//--------------------------------------------------------------------------------------
  for (var y = 0; y < Math.ceil(width / 20); ++y) {
    if (parseInt(y) != 0) {
      gridNumber = (y).toString();
    } else {
      gridNumber = " ";
    }
    var text = new fabric.Text(gridNumber, {
      left: y_gridNumberLeft,
      top: y * size + y_gridNumberTopOffset,
      fontSize: 12,
      fontFamily: 'Helvetica',
      fontWeight: 'normal'
    });
    gridNumbersGroup.add(text);
  }
//--------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------
//--- Add the numbers along the Y axis.
//--------------------------------------------------------------------------------------
  for (var x = 0; x < Math.ceil(width / 20); ++x) {

    if (parseInt(x) < 100) {
      gridNumber = x.toString();
    } else {
      gridNumber = " ";
    }
    var text = new fabric.Text(gridNumber, {
      left: x * size - x_gridNumberOffset,
      top: x_gridNumberTop + x_gridNumberTopOffset,
      fontSize: 12,
      fontFamily: 'Helvetica',
      fontWeight: 'normal'
    });
    gridNumbersGroup.add(text);
  }
//--------------------------------------------------------------------------------------


//--- Render the grid numbers if selected
  if ($(showNumbers).is(":checked")) {
    //canvas.add(gridNumbersGroup);
  }
}