$(document).ready(function () {

  //--------------------------------------------------------------------------------------
  //--- I want to open the app and go right into the designer.
  drawGridInTab(canvas);
  drawNumbersInTab(canvas);
  $('#currentTabId').html("panel1Canvas");
  
  //--------------------------------------------------------------------------------------


  //--------------------------------------------------------------------------------------
  //--- BOZO: This is going to be a temporary hack.
  //--------------------------------------------------------------------------------------

  var selectedHandler = function (evt) {
    var selectedObject = evt.target;
    selectedObject.setControlsVisibility({
      'tl': false,
      'tr': false,
      'bl': false,
      'br': false,
      'mb': false,
      'ml': false,
      'mr': false,
      'mt': false
    });

  };
  canvas.on({
    'object:selected': selectedHandler
  });
  //--------------------------------------------------------------------------------------



  //--------------------------------------------------------------------------------------
  //--- Call the function to draw the grid. This is called from the "Create New Course" 
  //--- modal window.
  $('#btnGrid').click(drawGrid);
  $('#launchDesigner').click(drawGrid);
  //--------------------------------------------------------------------------------------
  //--- This completely empties out the canvas.
  //--------------------------------------------------------------------------------------
  $('#btnClearTheCourse').click(clearTheCanvas);
  //--------------------------------------------------------------------------------------
  //--- This handles the various save operations
  //--------------------------------------------------------------------------------------
  //--- Save what is currently active with no changes.
  $("#exportToJSON").click(
    function () {
      saveCourseToLocalStorage("existing")
    });
  //--- Save from the modal with no changes.
  $("#btnSaveProperties").click(
    function () {
      saveCourseToLocalStorage("existing")
    });
  //--- Save from the modal as a new course
  $("#btnSaveAsNew").click(
    function () {
      saveCourseToLocalStorage("new")
    });
  //--------------------------------------------------------------------------------------
  //--- This populates the local course library.
  //--------------------------------------------------------------------------------------
  $("#openCourseLibrary").click(populateCourseLibrary);
  //--------------------------------------------------------------------------------------
  //--- This populates the object tally.
  //--------------------------------------------------------------------------------------
  $("#openObjectTally").click(tallyObjects);
  //--------------------------------------------------------------------------------------
  //--- Remove the course map from local storage
  //--------------------------------------------------------------------------------------
  $('#btnDeleteFromLocalStorage').click(deleteFromLocalStorage);
  //--------------------------------------------------------------------------------------
  //--- Hydrate the canvas with a saved course map.
  //--------------------------------------------------------------------------------------
  $('#btnOpenFromLocalStorage').click(openCourseFromLocalStorage);
  //--------------------------------------------------------------------------------------
  //--- Toggle the numbers and their various activities.
  $('#numbersLeft').click(drawNumbers);
  $('#numbersRight').click(drawNumbers);
  $('#numbersTop').click(drawNumbers);
  $('#numbersBottom').click(drawNumbers);
  $('#numbersForward').click(drawNumbers);
  $('#numbersBackward').click(drawNumbers);

  $("#redrawGrid").click(
    function () {
      drawGrid();
      drawNumbers();
    });

  $("#gridBaseline").click(
    function () {
      drawGrid();
      drawNumbers();
    });

  $("#gridNormal").click(
    function () {
      drawGrid();
      drawNumbers();
    });

  

  //--------------------------------------------------------------------------------------

  //--------------------------------------------------------------------------------------
  //--- Some admin stuff to make my life easier
  $('#wipeLocalStorage').click(function () {
    localStorage.clear();
  });
  $('#removeLines').click(removeLines);
  //--------------------------------------------------------------------------------------
  //--- Manage toggling between the designer, the course library and the events calendar.
  //--------------------------------------------------------------------------------------

  $("#openCourseLibrary").click(function () {
    $("#designerContainer").hide();
    $("#courseLibraryContainer").show();
    $("#objectTallyContainer").hide();
  });

  $("#openDesigner").click(function () {
    $("#designerContainer").show();
    $("#courseLibraryContainer").hide();
    $("#objectTallyContainer").hide();
  });

  $("#openObjectTally").click(function () {
    $("#designerContainer").hide();
    $("#courseLibraryContainer").hide();
    $("#objectTallyContainer").show();
  });

  //--------------------------------------------------------------------------------------


  //--------------------------------------------------------------------------------------
  //--- Let's throw some stuff on the field.
  //--------------------------------------------------------------------------------------
  $('#addAFrame').click(addAframe);
  $('#addDogwalk').click(addDogwalk);
  //--------------------------------------------------------------------------------------

  //--------------------------------------------------------------------------------------
  //--- Remove the selected item.
  //--------------------------------------------------------------------------------------
  $("#removeSelected").click(function () {
    var activeObject = canvas.getActiveObject(),
      activeGroup = canvas.getActiveGroup();

    if (activeGroup) {
      var objectsInGroup = activeGroup.getObjects();
      canvas.discardActiveGroup();
      objectsInGroup.forEach(function (object) {
        canvas.remove(object);
      });
    } else if (activeObject) {
      canvas.remove(activeObject);
    }
  });
  //--------------------------------------------------------------------------------------

  //--------------------------------------------------------------------------------------
  //--- Confirm deletion from local storage
  //--------------------------------------------------------------------------------------
  $('#deleteFromLocalStorage').on('show.bs.modal', function (event) {

    //--- Get a reference to the button and pull the courseId from it.
    var button = $(event.relatedTarget)
    var courseId = button.data('course-id')
    var modal = $(this)
    modal.find('#deleteCourseId').val(courseId);

  });
  //--------------------------------------------------------------------------------------



  //--------------------------------------------------------------------------------------
  //--- Show a preview of the saved course map
  //--------------------------------------------------------------------------------------
  $('#previewFromLocalStorage').on('show.bs.modal', function (event) {

    //--- Get a reference to the button and pull the courseId from it.
    var button = $(event.relatedTarget)
    var courseId = button.data('course-id')
    var modal = $(this)
    modal.find('#modalCourseId').html(courseId);

    //--- Now get the data from local storage and parse out the JSON.
    var jsonPackage = localStorage.getItem(courseId);
    var arrJsonPackage = jsonPackage.split("|");
    var canvasHeight = arrJsonPackage[5];
    var canvasWidth = arrJsonPackage[6];
    var previewJson = arrJsonPackage[7];

    //--- We're going to have to do some resizing stuff here.
    previewCanvas.setDimensions({
      width: canvasWidth / 3,
      height: canvasHeight / 3
    });

    //--- Clear the canvas and hydrate it with the JSON.
    previewCanvas.clear();
    previewCanvas.loadFromJSON(previewJson);
    canvas.renderAll();

  });
  //--------------------------------------------------------------------------------------



  //--------------------------------------------------------------------------------------
  //--- This handles exporting the course as an image.
  //--------------------------------------------------------------------------------------
  $("#exportToPNG").click(function () {
    console.log("bitch")
    downloadCanvas(this, 'paper');
  });
  //--------------------------------------------------------------------------------------

});