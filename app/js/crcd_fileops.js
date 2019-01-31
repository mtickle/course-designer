//--------------------------------------------------------------------------------------
//--- Save the course to local storage
//--------------------------------------------------------------------------------------
function saveCourseToLocalStorage(mode) {

  //--- First things first ... which canvas is open?
   var currentCanvas = $('#currentTabId').html();
   console.log(currentCanvas)
   var courseIdHolder = "#" + currentCanvas.replace("Canvas","CourseId")
   var tabId = currentCanvas.replace("Canvas","")

console.log(mode)

  //--- Turn the canvas into JSON and keep it.
  //var json = JSON.stringify(canvas);
  var newJson = canvas.toJSON(['id', '_controlsVisibility', 'lockMovementX', 'lockMovementY', 'lockRotation', 'lockScalingX', 'lockScalingY', 'lockUniScaling']);
  var json = JSON.stringify(newJson);

  //--- Get the current courseId from the page. This might be empty, but 
  //--- that's cool. We'll deal with that in a bit.
  if (mode == "existing") {
    var currentUuid = $(courseIdHolder).html();
  } else if (mode == "new") {
    var currentUuid = "";
  }

  //--- activate save button

  //--- If currentUuid has a value, then this course map has already been saved 
  //--- at least once. Set uuid to currentUuid so we UPDATE the values in 
  //--- local storage. If currentUuid is empty, its a new design and we need to 
  //--- create a new uuid to save it with.
  if (currentUuid) {
    var uuid = currentUuid;
    var statusMessage = "Course design updated in local storage.";
  } else {
    var uuid = guid();
    var statusMessage = "Course design saved to local storage.";
  }

  //--- Save this on the page so we can do all that magic that we just
  //--- did above.
  $("#courseId").html(uuid);


  //--- Get these values from the form. Internal storage is limited to 
  //--- a key and a value, so we need to be crafty with how we store it. 
  //--- We'll store the uuid as the key and smoosh together the level, class
  //--- club, date and whatever else in the value, pipe delimited, with the 
  //--- JSON representation of the course design.
  var saveTimeStamp = returnTimestamp();

  var clubName = $('#clubName').val();
  var eventDate = $('#eventDate').val();
  var levelName = $('#levelName').val();
  var className = $('#className').val();
  var canvasHeight = canvas.height;
  var canvasWidth = canvas.height;
  var fileJSONName = (levelName + "|" + className + "|" + clubName + "|" + eventDate + "|" + canvasHeight + "|" + canvasWidth);
  //var fileJSONName = (levelName + "|" + className + "|" + clubName + "|" + eventDate);
  var jsonPackage = saveTimeStamp + "|" + fileJSONName + "|" + json;

  //--- Store it.
  localStorage.setItem(uuid, jsonPackage);



  //--- Update the interface.
  $('#' + tabId + 'fileClubName').text(clubName + " - ");
  $('#' + tabId + 'fileCourseLevelAndClass').text(levelName + " " + className + " - ");
  $('#' + tabId + 'fileEventDate').text(eventDate);
  $('#exportToJSON').prop( "disabled", false );


  //--- Make a sexy notification.
  $.notify({
    message: statusMessage,
  },{
    delay: "3000",
    type: "success",
    placement: {
      from: "top",
      align: "center"
    },
    animate: {
      enter: 'animated fadeInDown',
      exit: 'animated fadeOutUp'
    },
  });




}


//--------------------------------------------------------------------------------------
//--- Open the stored course map from local storage.
//--------------------------------------------------------------------------------------
function openCourseFromLocalStorage() {

  //--- Make sure we can see the designer
  $("#designerContainer").show();
  $("#courseLibraryContainer").hide();
  $("#eventsContainer").hide();

  //--- Get the courseId from the modal
  var courseId = $('#modalCourseId').html();

  //--- Put the courseID on the page so we don't lose it.
  $('#courseId').html(courseId);

  //--- Now get the data from local storage and parse out the JSON.
  var jsonPackage = localStorage.getItem(courseId);
  var arrJsonPackage = jsonPackage.split("|");
  var courseLevel = arrJsonPackage[1];
  var courseClass = arrJsonPackage[2];
  var courseClub = arrJsonPackage[3];
  var courseDate = arrJsonPackage[4];
  var canvasHeight = arrJsonPackage[5];
  var canvasWidth = arrJsonPackage[6];
  var designerJson = arrJsonPackage[7];

  //--- Now we need to make sure that we have the right course information 
  //--- available so it saves correctly.
  $('#clubName').val(courseClub);
  $('#eventDate').val(courseDate);
  $('#levelName').val(courseLevel);
  $('#className').val(courseClass);

  //--- Update the interface
  $('#fileDetails').show();
  $('#fileClubName').text(courseClub);
  $('#fileCourseLevelAndClass').text(courseLevel + " " + courseClass);
  $('#fileEventDate').text(courseDate);
  $('#exportToJSON').show();


  //--- We're going to have to do some resizing stuff here.
  canvas.setDimensions({
    width: canvasWidth,
    height: canvasHeight
  });

  //--- Clear the canvas and hydrate it with the JSON.
  canvas.clear();
  canvas.loadFromJSON(designerJson);
}

//--------------------------------------------------------------------------------------
//--- Delete the stored course map from local storage.
//--------------------------------------------------------------------------------------
function deleteFromLocalStorage() {

  //--- Get the courseId from the modal
  var courseId = $('#deleteCourseId').val();

  //--- Remove the item from local storage
  localStorage.removeItem(courseId);

  //--- Reload the course library
  populateCourseLibrary();

  //--- Make a sexy notification.
  $.notify("Course map deleted from local storage.", {
    type: 'success',
    delay: 3000,
    placement: {
      from: "top",
      align: "center"
    },
    animate: {
      enter: 'animated bounceInDown',
      exit: 'animated bounceOutUp'
    }
  });

}

//--------------------------------------------------------------------------------------
//--- This populates the local course library.
//--------------------------------------------------------------------------------------
function populateCourseLibrary() {

  //--- First, we need to clear out the table in the course library modal
  $('#courseLibraryTable tbody').empty();

  //--- Get the values from local storage
  for (var i = 0, len = localStorage.length; i < len; i++) {

    //--- Get the key and split up the timestamp and file name.
    var key = localStorage.key(i);
    var value = localStorage[key];
    var arrCourse = value.split("|");

    //--- Get the values and pretty them up if needed.
    var courseId = key;
    var courseSaveDate = arrCourse[0];
    var courseLevel = arrCourse[1];
    var courseClass = arrCourse[2];
    var courseClub = arrCourse[3];
    var courseDate = arrCourse[4];

    //--- Add each entry to the table in the modal
    var rowString = "<tr>";
    rowString += "<td>" + courseSaveDate + "</td>";
    rowString += "<td>" + courseLevel + "</td>";
    rowString += "<td>" + courseClass + "</td>";
    rowString += "<td>" + courseClub + "</td>";
    rowString += "<td>" + courseDate + "</td>";
    rowString += "<td><span class='label label-default'>Draft</span></td>"
    rowString += "<td>";
    rowString += '<button type="button" data-course-id="' + courseId + '"  id="btnPreviewFromLocalStorage" class="btn btn-default btn-xs" data-toggle="modal" data-target="#previewFromLocalStorage">'
    rowString += '<span class="glyphicon glyphicon-picture" aria-hidden="true"></span> Open </button>&nbsp;'
    rowString += '<button type="button" class="btn btn-default btn-xs" data-toggle="modal" data-course-id="' + courseId + '" data-target="#deleteFromLocalStorage">'
    rowString += '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Delete </button>'
    rowString += "</td>";
    rowString += "</tr>";
    $('#courseLibraryTable').append(rowString);
  }
}