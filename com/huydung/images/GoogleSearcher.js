if (!window['com']) { com = {}; };
if (!window['com']['huydung']) { com.huydung = {}; }; 
if (!window['com']['huydung']['images']) { window.com.huydung.images = {};};

com.huydung.images.GoogleSearcher = function(){
  var savedResults = [];
  var concreteGoogleSearch;
  var searcher;
  return{
    name : 'google',
    search : function( query ){
      console.log('Google Search Started');
      searcher.execute( query );
    },
    init : function(obj){
      concreteGoogleSearch = obj;
      searcher = new google.search.ImageSearch();
      searcher.setResultSetSize(google.search.Search.LARGE_RESULTSET);
      searcher.setSearchCompleteCallback(
        obj, obj.addResult, [searcher]
      );
    },
    addResult: function(searcher){
      if( searcher.results && searcher.results.length > 0 ){
        var res = searcher.results;
        var results = [];
        for( var i in res ){              
          results.push( {
            thumbnail: unescape(res[i]['tbUrl']), 
            url: unescape(res[i]['url']),
            title: res[i]['titleNoFormatting'] + ' ('+ res[i]['visibleUrl'] +')',
            info: res[i]['originalContextUrl']          
          } ); 
        };
        $(concreteGoogleSearch).trigger('searcher.completed', [results] );
        savedResults = savedResults.concat( results );
        if( searcher.cursor.currentPageIndex < searcher.cursor.pages.length - 1 ){
          searcher.gotoPage(searcher.cursor.currentPageIndex + 1);              
        } else {
          $(concreteGoogleSearch).trigger('searcher.completed.full', savedResults );
        }          
      }
    }
  }     
};