if (!window['com']) { com = {}; };
if (!window['com']['huydung']) { com.huydung = {}; }; 
if (!window['com']['huydung']['images']) { window.com.huydung.images = {};};

com.huydung.images.FlickrSearcher = function(){
  var savedResults = [];
  var concreteFlickrSearch;

  var template = new com.huydung.util.Template;
  var imageUrlTemplate = 
    'http://farm{farm-id}.static.flickr.com/{server-id}/{id}_{secret}{thumb}.jpg';
  var imageInfoTemplate = 
    'http://www.flickr.com/photos/{user-id}/{photo-id}';
  var constructImageURL = function(photo, isThumb){          
    return template.fill({
      "farm-id": photo.farm,
      "server-id": photo.server,
      "id": photo.id,
      "secret": photo.secret,
      "thumb": isThumb ? '_t' : ''
    }, imageUrlTemplate);
  };
  var constructImageInfoURL = function(photo){
    return template.fill({
      "user-id": photo.owner,
      "photo-id": photo.id
    }, imageInfoTemplate);
  }
  return{
    name : 'flickr',
    search : function( query ){
      console.log('Flickr Search Started');
      var url = "http://www.flickr.com/services/rest/?method=flickr.photos.search"+
          "&format=json&api_key=95b6913025ca27f54d84432218307fcd&per_page=64&text=" +   
          escape(query) + '&jsoncallback=?';
      console.log(url);
      $.getJSON( url, concreteFlickrSearch.addResult );
    },
    init : function(obj){
      //console.log(obj);
      concreteFlickrSearch = obj;
    },
    
    addResult: function(data){
      if( data.photos.photo && data.photos.photo.length > 0 ){
        var results = [];
        for( var i in data.photos.photo){
          var photo = data.photos.photo[i];
          results.push({
            thumbnail: constructImageURL(photo, true),
            info: constructImageInfoURL(photo),
            url: constructImageURL(photo, false),
            title: photo.title + ' (Flickr)'
          });
        };
        
        $(concreteFlickrSearch).trigger('searcher.completed', [results] );
        $(concreteFlickrSearch).trigger('searcher.completed.full', [results] );
        console.log( 'Flickr Search Complete' );
      }
    }
  }     
};