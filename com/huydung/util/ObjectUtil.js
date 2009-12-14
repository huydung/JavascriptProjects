if (!window['com']) { com = {}; };
if (!window['com']['huydung']) { com.huydung = {}; }; 
if (!window['com']['huydung']['util']) {com.huydung.util = {};};

com.huydung.util.ObjectUtil = {};

com.huydung.util.ObjectUtil.dumpToAlert = function(obj, containsMethod){
  var methods = [];
  var properties = [];
  for( var property in obj ){
		if( (obj[property] instanceof Function) ){   
	    if( containsMethod ){
	      methods.push(property.toUpperCase() + '()');
	    }        		
  	} else {
  		properties.push(property.toUpperCase() + ': ' + obj[property]);
  	};
  };      	
	
	return properties.join('\n') + (
    methods.length > 0 ? '-----\n' + methods.join('\n') : ''
  );
};

com.huydung.util.ObjectUtil.dumpToHtml = function(obj, containsMethod){
  var methods = [];
  var properties = [];
  for( var property in obj ){
		if( (obj[property] instanceof Function) ){   
	    if( containsMethod ){
	      methods.push(property.toUpperCase() + '()');
	    }        		
  	} else {
  		properties.push(property.toUpperCase() + ': ' + obj[property]);
  	};
  };        	
	return properties.join('<br/>') + (
      methods.length > 0 ? '-----<br/>' + methods.join('<br/>') : ''
    );
};

com.huydung.util.ObjectUtil.toUrlParameters = function(obj){
  console.log(obj);
  var res = '';
  for( var property in obj ){
		if( !(obj[property] instanceof Function) ){   
      res += escape(property) + '=' + escape(obj[property]) + '&';
    };        	
	};
	console.log(res);
	if( res.length > 1 ){
    res = res.substr( 0, res.length - 1 ); 
	};
	return res;
}; 