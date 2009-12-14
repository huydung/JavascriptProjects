if (!window['com']) { com = {}; };
if (!window['com']['huydung']) { com.huydung = {}; }; 
if (!window['com']['huydung']['images']) {com.huydung.images = {};};

/*
* @class com.huydung.images.Cropper A helper class for working with JCrop Plugin, 
* allow to create new image with exacted dimensions
* @requires JCrop Plugin (http://deepliquid.com/content/Jcrop.html)
* @requires JQuery (http://jquery.com/)
* @author Nguyễn Huy Dũng (http://nguyenhuydung.com)
*/

com.huydung.images.Cropper = function(url){
	var desiredRatio = -1; // the desired aspect Ratio that the cropper will try to keep
	var $img; // hold a reference to the image Tag that is being cropped
  var $cropControl;	 // hold a reference o the Jcrop API
	var concreteImageCropper; // hold a reference to the Class instance
	
	/*
	* Method to create Jcrop controls on the image
  * @private 
  */
	var produceControl = function(){
		if( desiredRatio != -1 ){  	
    	var w, h;
    	var imageRatio = $img.width() / $img.height();
    	var initialSelection;
    	
    	// If one dimensions length is missing in the desired ratio,
    	// fill it with the actual image ratio
    	if( desiredRatio.width == 0 ){
 	      desiredRatio.ratio = imageRatio;
   	    desiredRatio.width = desiredRatio.ratio * desiredRatio.height;
    	};
    	if( desiredRatio.height == 0 ){
 	      desiredRatio.ratio = imageRatio;
   	    desiredRatio.height =  desiredRatio.width / desiredRatio.ratio;
    	};
    	
    	//try to create the biggest possible initial selection on the actual image
      //(reserve desired ratio)
    	if( imageRatio < desiredRatio.ratio ){
    		w = $img.width();
    		h = Math.round(w / desiredRatio.ratio) ;
    		initialSelection = [
          0, Math.round(($img.height() - h) / 2), 
          w, Math.round(($img.height() - h) / 2 + h)
        ];
    	} else {
    		h = $img.height();
    		w = Math.round(h * desiredRatio.ratio);
    		initialSelection = [
          0, Math.round(($img.width() - w) / 2),
          h, Math.round(($img.width() - w) / 2 + w)
        ];
    	};
    	console.log(desiredRatio);
    	console.log(initialSelection);
    	
    	// Create/Update the Jcrop Controls
    	if( !$cropControl ){
    		$cropControl = $.Jcrop($img,{
      		aspectRatio: desiredRatio.ratio,
      		bgColor: 'green',
      		bgOpacity: 0.3,
      		setSelect: initialSelection
      	});        
    	}else{
      	$cropControl
    			.setOptions({aspectRatio: desiredRatio.ratio })
    			.animateTo(initialSelection);
    	};      	
    };
	};
	return {
    /*
    * <p>Save a reference to the class instance for later use if needed</p>
    */
		init : function(obj){
			concreteImageCropper = obj;
		},
		
		/*
		* <p>Save the user preferences on dimenstions of the cropped image.</p>
		* <p>In case the Jcrop controls for this particular image has already been created, update them to match new preferences</p>
    * @param {int} width The desired width of the croppped image
    * @param {int} height The desired height of the croppped image
    * @public
    */
		saveDesiredRatio : function(w, h){
			if( w == 0 && h == 0 ){ desiredRatio = -1; return; };
			desiredRatio = {width: w, height: h, ratio: h == 0 ? 0 : w/h};
			if( $img != null && $cropControl != null ){
				produceControl();
			};
		}, 
     
    /*
		* <p>Reset all internal variables</p>
    * @public
    */  
		reset: function(){
			$img = null;
			desiredRatio = -1;
			$cropControl = null;
		},
		
		/*
		* <p>Allow other object to produce Jcrop controls on images</p>
		* @param {jQuery.Event} The event object passed on binding
    * @public
    */
		produceCropControl: function(evt){ 
			$img = $(evt.currentTarget);
			$cropControl = null;
      produceControl();
    },
    
    /*
		* <p>Get the selected dimensions</p>
		* @param {jQuery.Event} The event object passed on binding
    * @public
    */
    getDimensions: function(){
    	if( $cropControl ){
    		var c = $cropControl.tellSelect();
    		if( c && c.w > 0 && c.h > 0 ){
    		  return {
      			url: 			        $img.attr('src'),
      			action:           'crop',
      			"ratio-x-start": 	(c.x / $img.width()).toFixed(2),
      			"ratio-y-start": 	(c.y / $img.height()).toFixed(2),
      			"ratio-x-end": 	  (c.x2 / $img.width()).toFixed(2),
      			"ratio-y-end": 	  (c.y2 / $img.height()).toFixed(2),
      			"width": 			    desiredRatio.width,
      			"height": 			  desiredRatio.height
      		};  
    		}else{
    		  return {
    		    url: 			        $img.attr('src'),
    		    action:           ''
    		  };
    		};    		      		
    	};
    }
	}
};