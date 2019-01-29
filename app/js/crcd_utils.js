//--------------------------------------------------------------------------------------
//--- Handler for the save as image function.
//--------------------------------------------------------------------------------------
function downloadCanvas(link, canvasId) {

  var clubName = $('#clubName').val();
  var eventDate = $('#eventDate').val();
  var levelName = $('#levelName').val();
  var className = $('#className').val();
  var fileName = (levelName + "|" + className + "|" + clubName + "|" + eventDate);

  window.open(canvas.toDataURL('png'));

}

//--------------------------------------------------------------------------------------
//--- Generate a human-readable timestamp
function returnTimestamp() {
  var dt = new Date()
  var timestamp = (dt.getMonth() + 1) + "/" + dt.getDate() + "/" + dt.getFullYear() + " ";
  timestamp += dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();

  return timestamp;

}

//--------------------------------------------------------------------------------------
//--- Generate a GUID
//--------------------------------------------------------------------------------------
function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

//--------------------------------------------------------------------------------------
//--- Tally all objects
//--------------------------------------------------------------------------------------
function tallyObjects() {

  //--- First, we need to clear out the table in the object library modal
  $('#objectTable tbody').empty();

  //--- Get the values from local storage
  canvas.forEachObject(function (obj) {

    if (obj.id) {

      var objId = obj.id;
      var objType = obj.type;
      var objDescription = "";

      if (objId.includes("num_right")) {
        objDescription = "Right Grid Measurement Number";
      } else if (objId.includes("num_left")) {
        objDescription = "Left Grid Measurement Number";
      } else if (objId.includes("num_top")) {
        objDescription = "Top Grid Measurement Number";
      } else if (objId.includes("num_bottom")) {
        objDescription = "Bottom Grid Measurement Number";
      } else if (objId.includes("line_h_")) {
        objDescription = "Horizontal Grid Line";
      } else if (objId.includes("line_v_")) {
        objDescription = "Vertical Grid Line";
      }


      //--- Add each entry to the table in the modal
      var rowString = "<tr>";
      rowString += "<td>" + objId + "</td>";
      rowString += "<td>" + objType + "</td>";
      rowString += "<td>" + objDescription + "</td>";
      $('#objectTable').append(rowString);
    }
  });


}

//--------------------------------------------------------------------------------------
//--- Clear the canvas entirely.
//--------------------------------------------------------------------------------------
function clearTheCanvas() {
  canvas.clear();
}

//--------------------------------------------------------------------------------------
//--- Try removing the lines
//--------------------------------------------------------------------------------------
function removeLines(removeLine, context) {
  var objects = canvas.getObjects(),
    i = objects.length;
  while (i--) {
    if ((objects[i].id) && (objects[i].id.includes("line_"))) {
      canvas.remove(objects[i])
    }
  }
}

//--------------------------------------------------------------------------------------
//--- Close a tab
//--------------------------------------------------------------------------------------
function registerCloseEvent() {

  $(".closeTab").click(function (e) {

    
    var tabId = $(event.target).attr("data-tab-id");
    console.log(tabId)

      $('#closeTabModal').on('show.bs.modal', function (event) {
      var tabContentId = $(event.target).attr("data-tab-id");
    //  console.log(event.target)
    //--- Get the courseId from the modal
    //var courseId = $('#localTabId').val();
    $(e).parent().parent().remove(); //remove li of tab
       $('#myTab a:last').tab('show'); // Select first tab
       $(tabContentId).remove(); //remove respective tab content
      })
   });
}

//--------------------------------------------------------------------------------------