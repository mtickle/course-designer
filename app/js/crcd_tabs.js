//--------------------------------------------------------------------------------------
  //--- Tab management
  //--------------------------------------------------------------------------------------

  //--- Update the interface with the last selected tab
  $(".nav-tabs").on("click", "a", function (e) {
    var tabId = $(e.target).attr("href");
    if (tabId) {
      $('#currentTabId').html(tabId.replace("#", "") + "Canvas");
    }
  });

  //--- Remove a tab
  $('#tabs').on('click', '.close', function () {
    var tabCount = $('#tabs li').length;
    //--- And, let's knock out the close button if there is just one tab.
    if (tabCount == 1) {
      $("#dontDoThat").modal();
      return;
    }

    var tabID = $(this).parents('a').attr('href');
    $(this).parents('li').remove();
    $(tabID).remove();
    var firstTab = $('#tabs a:first');
    $('#currentTabId').html($('#tabs a:first').attr('href').replace("#", "") + "Canvas");
    //firstTab.tab('show');
    $('#tabs li:last-child a').tab('show');
  });

  //--- Add a tab
  $('#btnAddTab').click(function (e) {

    var lastTab = $('#tabs a:last').attr('href').replace("#panel", "");
    var nextTab = parseInt(lastTab) + 1
    var tabCount = $('#tabs li').length;
    var tabId = "tab" + nextTab;
    var panelID = "panel" + nextTab;
    var canvasId = tabId + "Canvas";

    console.log(tabCount);


    //--- Don't let them create more than five tabs.
    if (tabCount > 4) {
      $("#maximumTabCount").modal();
      return;
    }

    //--- Create the tab
    var tabLabel = "Course " + nextTab;
    var tabString = '';
    tabString+='<li class="nav-item">';
    tabString+='<a class="nav-link" id="#' + tabId + '" data-toggle="tab" href="#' + panelID + '" role="tab" aria-controls="#' + tabId + '" aria-selected="true">' + tabLabel + '&nbsp;<button type="button" class="close" aria-label="Close" ><span aria-hidden="true">&times;</span></button></a>';
    tabString+='</li>';


    //--- Create a holder for the tab content
    var tabContent ="";
    tabContent += '<div class="tab-pane fade" id="' + panelID + '" role="tabpanel" aria-labelledby="tab1">';
    tabContent += '<span id="' + tabId + 'fileClubName">' + tabLabel + '</span><span id="' + tabId + 'fileCourseLevelAndClass"></span><span id="' + tabId + 'fileEventDate"></span>';
    tabContent += '<div class="designer" id="designer">';
    tabContent += '<div id="' + tabId + 'CourseId" class="label label-default"></div>';
    tabContent += '<canvas id="' + canvasId + '"></canvas>';
    tabContent += '</div>'; 
    tabContent += '</div>';

    //--- Add the new tab and new content holder.
    $(tabString).appendTo('#tabs');
    $(tabContent).appendTo('#tab-content');
    $('#currentTabId').html(canvasId);
    addCanvasToTab(canvasId)

    //-- Make the new tab active
    //$('#tabs a:last').tab('show');
    $('#tabs li:last-child a').tab('show');
  });
