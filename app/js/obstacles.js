
function addDogwalk() {
  //------------------------------------------------------------------------
  //--- Construct a dogwalk
  //------------------------------------------------------------------------  
  var dw_seg_1 = new fabric.Rect({
      width: 23,
      height: 7,
      fill: '#A5A5A5',
      stroke: 'black',
      strokeWidth: 2,
  });

  var dw_seg_2 = new fabric.Rect({
      left: 23,
      width: 60,
      height: 7,
      fill: '#FFFFFF',
      stroke: 'black',
      strokeWidth: 2,
  });

  var dw_seg_3 = new fabric.Rect({
      left: 83,
      width: 88,
      height: 7,
      fill: '#FFFFFF',
      stroke: 'black',
      strokeWidth: 2,
  });

  var dw_seg_4 = new fabric.Rect({
      left: 171,
      width: 60,
      height: 7,
      fill: '#FFFFFF',
      stroke: 'black',
      strokeWidth: 2,
  });

  var dw_seg_5 = new fabric.Rect({
      left: 231,
      width: 23,
      height: 7,
      fill: '#A5A5A5',
      stroke: 'black',
      strokeWidth: 2,
  });

  var dw_seg_6 = new fabric.Rect({
      left: 88,
      top: -3,
      width: 3,
      height: 3,
      fill: '#A5A5A5',
      stroke: 'black',
      strokeWidth: 2,
  });

  var dw_seg_7 = new fabric.Rect({
      left: 162,
      top: -3,
      width: 3,
      height: 3,
      fill: '#A5A5A5',
      stroke: 'black',
      strokeWidth: 2,
  });

  var dw_seg_8 = new fabric.Rect({
      left: 162,
      top: 7,
      width: 3,
      height: 3,
      fill: '#A5A5A5',
      stroke: 'black',
      strokeWidth: 2,
  });
  var dw_seg_9 = new fabric.Rect({
      left: 88,
      top: 7,
      width: 3,
      height: 3,
      fill: '#A5A5A5',
      stroke: 'black',
      strokeWidth: 2,
  });

  var dw_group = new fabric.Group([dw_seg_1, dw_seg_2, dw_seg_3, dw_seg_4, dw_seg_5, dw_seg_6, dw_seg_7, dw_seg_8, dw_seg_9], {
      left: 100,
      top: 300
  });
  dw_group.id = "dogwalk";
  dw_group.lockScalingY = true;
  dw_group.lockScalingX = true;
  dw_group.setControlsVisibility({
      'tl': false,
      'tr': false,
      'bl': false,
      'br': false,
      'mb': false,
      'ml': false,
      'mr': false,
      'mt': false
  });
  canvas.add(dw_group);
  //------------------------------------------------------------------------
  //--- End of dogwalk
  //------------------------------------------------------------------------


}  
  

function addAframe() {  

  //------------------------------------------------------------------------
  //--- Construct an A-frame
  //------------------------------------------------------------------------
  var af_seg_1 = new fabric.Rect({
      width: 26,
      height: 26,
      fill: '#A5A5A5',
      stroke: 'black',
      strokeWidth: 2,
  });
  var af_seg_2 = new fabric.Rect({
      left: 26,
      width: 35,
      height: 26,
      fill: '#FFFFFF',
      stroke: 'black',
      strokeWidth: 2,
  });
  var af_seg_3 = new fabric.Rect({
      left: 61,
      width: 35,
      height: 26,
      fill: '#FFFFFF',
      stroke: 'black',
      strokeWidth: 2,
  });
  var af_seg_4 = new fabric.Rect({
      left: 96,
      width: 26,
      height: 26,
      fill: '#A5A5A5',
      stroke: 'black',
      strokeWidth: 2,
  });

  var af_group = new fabric.Group([af_seg_1, af_seg_2, af_seg_3, af_seg_4], {
      left: 50,
      top: 50
  });
  af_group.lockScalingY = true;
  af_group.lockScalingX = true;
  af_group.setControlsVisibility({
      'tl': false,
      'tr': false,
      'bl': false,
      'br': false,
      'mb': false,
      'ml': false,
      'mr': false,
      'mt': false
  });
  canvas.add(af_group);
  //------------------------------------------------------------------------
  //--- End of A-frame
  //------------------------------------------------------------------------
}  