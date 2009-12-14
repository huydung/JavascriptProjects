google.load('search', '1');

$(document).ready(function(){
    //console.log('Start Creating the Images Hunter Object');
    var imageHunter = new com.huydung.images.Hunter;
    imageHunter.init( imageHunter );
    
    
    //Add search services providers
    var googleSearch = new com.huydung.images.GoogleSearcher;
    googleSearch.init( googleSearch );
    imageHunter.addSearcher( googleSearch );
    
    var flickrSearch = new com.huydung.images.FlickrSearcher;
    flickrSearch.init( flickrSearch );
    imageHunter.addSearcher( flickrSearch );
    
    //Add image Cropper component
    var imageCropper = new com.huydung.images.Cropper;
    imageCropper.init( imageCropper );
    imageHunter.addCropper( imageCropper );
    
    //Show/hide added-info by clicking on navigation
    console.log($('.tab').length);
    $('.tab').click(function(){    
      var $toBeShow = $( $(this).attr('href') );
      console.log($toBeShow.length);
      if( $toBeShow.is('.showing') ){
        $toBeShow.slideUp().removeClass('showing')
      } else {
        $('.showing').hide().removeClass('showing');
        $toBeShow.slideDown().addClass('showing');
      };
      return false;
    });
    
    //form validation
    $("#feedback").validate({
  		rules : {
  			name: "required",
  			message: {required:true, minlength: 50},
  			email: {required:true, email: true}			
  		},
  		messages :{
  			name: "Please provide your full name.",
  			message: "What do you think about DuPP? Please use at least 50 letters.",
  			email: {
  				required: "Please provide your email address. It'll not be published.",
  				email: "Email is invalid [Valid example: yourname@domain.ext]"
  			}
  		}
  	});
});