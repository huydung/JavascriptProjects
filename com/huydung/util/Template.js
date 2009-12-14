if (!window['com']) { com = {}; };
if (!window['com']['huydung']) { com.huydung = {}; }; 
if (!window['com']['huydung']['util']) {com.huydung.util = {};};

com.huydung.util.Template = function(){
  var savedTemplate;
  return{
    setTemplate : function( template ){
      savedTemplate = template;
    },
    getTemplate : function( template ){
      return savedTemplate;
    },
    fill : function( values, template ){
      var res = template ? template : savedTemplate;
      for( var property in values ){
        if( !(values[property] instanceof Function) ){             
          res = res.replace(new RegExp('{'+ property +'}', 'gi'), values[property]);
        }
      };
      return res;
    } 
  }
};