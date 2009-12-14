if (!window['console']) { window.console = {};  window.console.log = function(){};};    
if (!window['com']) { com = {}; };
if (!window['com']['huydung']) { com.huydung = {}; }; 
if (!window['com']['huydung']['images']) { window.com.huydung.images = {};};

com.huydung.images.Hunter = function(options){
  var results = [];
  var templater = new com.huydung.util.Template;
  var concreteImageHunter;
  var searchers = [];
  var previewPanel;
  var resultPanel;
  var searchTimeout;
  var desiredRatio = -1;
  
  var thumbnailTemplate = 
    '<div class="image-res">'+
      '<a href="{href}" title="{title}" rel="{rel}">'+
        '<img src="{src}" />'+
      '</a>'+
    '</div>';
  var previewTemplate =   
      '<strong>{title}</strong>' +    
      '<div style="padding-bottom:10px;">'+
        '<a href="{info}" id="button-info" target="_blank">Image Info</a>  |  ' +
        '<a href="{href}" id="button-download" target="_blank">Download original</a>  |  ' +
        '<a href="{href}" target="_blank" id="button-crop">CROP/RESIZE and download</a>' +
      '</div>'+  
  '<img src="" />'
  var buildThumbnails = function( searchResults, isAppend ){
    //console.log( searchResults.length );
    var html = isAppend ? resultPanel.html() : '';
    for (var i in searchResults){
      var img = searchResults[i];
      html += templater.fill({
        href: img.url,
        src: img.thumbnail,
        title: img.title,
        rel: img.info
      }, thumbnailTemplate);
      
    };
    resultPanel.html(html);        
  };
  
  var buildTabs = function( img ){
	  
  };     
  
  return {        
    init : function( obj ){
      concreteImageHunter = obj;
      console.log(concreteImageHunter);
      $('#search-query').keyup(function(e){
        if(e.keyCode == 13){
          $('#search-submit').click();
        }            
      });
      
      //Cache some jQuery Obj
      previewPanel = $('#preview');
      resultPanel = $('#search-result');
      
      //register search submit event
      $('#search-submit').click(function(){
        var query = $('#search-query').val();    
        if( query != null && query.length > 0 ){
          var searchBy = [];
          $('input.search-option:checked').each(function(){
            //console.log($(this).val());
            searchBy.push( $(this).val() );              
          });
          obj.search( query, searchBy );  
        }                      
      });
      
      //register image desired ratio changed event
      $('.crop-var').change(function(){
        if( cropper ){
        	cropper.saveDesiredRatio(
      			  parseInt($('#crop-width').val(), 10), 
      			  parseInt($('#crop-height').val(), 10)
      	  	); 
        };
      });
      
      //register preview image event
      $('.image-res a').live('click', concreteImageHunter.addPreview);
      $('#button-crop').live('click', concreteImageHunter.cropAndDownload);
      //previewPanel.find('img').live('load', concreteImageHunter.produceCropControl);
      //prepare for Cropping
      if( $('#crop-width').val() == "" || !$('#crop-height').val() == "" ){
    	  $('#crop-width').val(200);
          $('#crop-height').val(120);       	  
      };
    },
    addPreview: function(){
    	var $thumb = $(this);
      
      var previewHtml = templater.fill( {
        href:   $thumb.attr('href'), 
        title:  $thumb.attr('title'),
        info:   $thumb.attr('rel')
      }, previewTemplate );
      previewPanel.html(previewHtml);      
      if( cropper ){
        previewPanel
          .find('img')
          .attr('src', $thumb.attr('href'))
          .unbind('load').bind('load', cropper.produceCropControl);
      };           
               
      return false;
    },    
    cropAndDownload: function(){
    	if( cropper ){
    		var ds = cropper.getDimensions();
    		//alert( com.huydung.util.DumpObject( ds ) );
    		var url = 'http://localhost/imageshunter/cropimage.php?' +
    		  com.huydung.util.ObjectUtil.toUrlParameters(ds);
    		window.open(url, "image", "width="+(ds['width'] + 50)+",height="+(ds['height'] + 50) );
    		return false;
    	};
    },
    search: function(query, searchBy){
      console.log('Start searching for query: '+ query);
      $('#app-body').prepend('<div class="message" style="text-align:center;">Searching...</div>');
      
      searchTimeout = setTimeout( "saySorry()" , 5000);
      resultPanel.html('');
      previewPanel.html('<div class="tmp" style="width:100%;height:100%;background-color:#FFF;"></div>');
      if( cropper ){
      	cropper.reset();
        	cropper.saveDesiredRatio(
  			  parseInt($('#crop-width').val(), 10), 
  			  parseInt($('#crop-height').val(), 10)
  	  	); 
      };
      
      for( var i in searchBy ){
        if( searchers[ searchBy[i] ] != null ){
          console.log('Start searching with searcher named '+ searchBy[i]);
          var searcher = searchers[ searchBy[i] ];
          searcher.search( query );
          $(searcher).bind('searcher.completed', function(e, searchResults){
            $('#app-body .message').remove();
            clearTimeout(searchTimeout);
            results = results.concat(searchResults);
            buildThumbnails( searchResults, true );
            $firstThumb = $('#search-result .image-res:first a');
            //console.log($firstThumb);
            if( !$firstThumb.is('.clicked') ){
              $firstThumb.click().addClass('clicked');
            };                 
          });              
        }
      }          
    },
    addSearcher : function(searcher){ 
      console.log('Added searcher '+ searcher.name);
      searchers[ searcher.name ] = searcher; 
    },
    addCropper : function(imageCropper){ cropper = imageCropper; },
    getSearchers: function(){return searchers; }     
  };
};

function saySorry(){
  $('#app-body .message').html('Sorry, seem that there are no results for the searched query.');
}