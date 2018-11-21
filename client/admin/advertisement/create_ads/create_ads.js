
import { Template } from 'meteor/templating';
import { Base64 } from 'meteor/ostrio:base64';

import { Session } from 'meteor/session';
import swal from 'sweetalert';

   Template.create_ads.onRendered(function(){
		$.getScript("https://cdnjs.cloudflare.com/ajax/libs/pikaday/1.6.1/pikaday.min.js",function(){
		    var picker = new Pikaday({ field: document.getElementById('promotion_start_date'),minDate: new Date(), });
		    var picker = new Pikaday({ field: document.getElementById('promotion_end_date'),minDate: new Date(), });
	});
  });


Template.create_ads.helpers({
	frientlist:function()
	{
		var userid=Session.get('userId');
		 var friends=FriendRequest.find({ 
				        $and: [ { $or: 
				          [ { 
				            sent_to: userid 
				          }, { 
				            sent_by: userid 
				             } 
				          ] }, 
				          { $and: 
				            [ { req_status: 1 }] 
				             } ] }).fetch();
		 return friends;
	},

	promotion_image(){
		console.log('load_image');

	    if(Session.get("promotion_image_session")){
		  var promotion_image = Session.get("promotion_image_session");
		  return promotion_image;
		}
		else{
			return '/img/choose-photo13.jpeg';
		}
	},

});

Template.create_ads.events({

		"change #promotion_image":function(e, template) {
			swal('ok');
			upload_cover_pic(e, template);
		},

		"change #promotion_type":function(){
        
        // swal('here i am');
		var promotion_type = $("#promotion_type").val();
		if(promotion_type == 'Textual'){
			// swal('case 1');
			$('#promotion_discription_box').removeClass('loader_visiblity_block');
			$('#promotion_picture_box').addClass('loader_visiblity_block');
		}
   		else if(promotion_type == 'Picture'){
			// swal('case 2');
   			$('#promotion_discription_box').addClass('loader_visiblity_block');
   			$('#promotion_picture_box').removeClass('loader_visiblity_block')

		}
	},

	'click #create_promotion':function()
	{
		// swal('here: - ');
		var promotion_type = $("#promotion_type").val();
		var promotion_start_date = $("#promotion_start_date").val();
		var promotion_end_date = $("#promotion_end_date").val();
		var promotion_title = $("#promotion_title").val();

		if(promotion_type == '' || promotion_start_date == null)
		{
			$("#promotion_type").addClass('emptyfield_focus');
			$("#promotion_type").focus();
			return false;
		}else
		{
			$("#promotion_type").removeClass('emptyfield_focus');
		}

		if(promotion_type == 'Textual'){
			var promotion_content = $("#promotion_discription").val();
			if(promotion_content == '')
				{
					$("#promotion_discription").addClass('emptyfield3');
					$("#promotion_discription").focus();
					return false;
				}else
				{ 
					$("#promotion_discription").removeClass('emptyfield3');
				}
		}
   		else if(promotion_type == 'Picture'){
   			var promotion_content = Session.get("promotion_image_session");

   			if(promotion_content == '' || promotion_content == null)
				{	
					swal('Cover image cannot be empty for cover_image');
					$("#cover_image").addClass('emptyfield3');
					$("#cover_image").focus();
					return false;
				}
				else
				{
					$("#cover_image").removeClass('emptyfield3');
				}
		}

		if(promotion_title == '' || promotion_title == null)
		{
			$("#promotion_title").addClass('emptyfield3');
			$("#promotion_title").focus();
			return false;
		}else
		{
			$("#promotion_title").removeClass('emptyfield3');
		}

		if(promotion_start_date == '' || promotion_start_date == null)
		{
			$("#promotion_start_date").addClass('emptyfield_focus');
			$("#promotion_start_date").focus();
			return false;
		}else
		{
			$("#promotion_start_date").removeClass('emptyfield_focus');
		}

		if(promotion_end_date == '' || promotion_start_date == null)
		{
			$("#promotion_end_date").addClass('emptyfield_focus');
			$("#promotion_end_date").focus();
			return false;
		}else
		{
			$("#promotion_end_date").removeClass('emptyfield_focus');
		}		

		var promotion_url = $("#promotion_url").val();
		if(promotion_url == '')
		{
			$("#promotion_url").addClass('emptyfield3');
			$("#promotion_url").focus();
			return false;
		}else
		{
			$("#promotion_url").removeClass('emptyfield3');
		}

    Meteor.call('save_promotion',promotion_title,promotion_type,promotion_url,
    	promotion_content,promotion_start_date,promotion_end_date,function(error,result){
              if(error){
                console.log("Some error occured.");
              }else{ 
               	swal("promotions sucessfully added to ads list!");
                window.location.href="/promotion_listing";            
              }
          });	

		 Session.clear("imagePath_admin_ads");

	},

});


function upload_cover_pic(e,template){

		    if (e.currentTarget.files && e.currentTarget.files[0]) {
		     var file = e.currentTarget.files[0];
		      if (file) {
		        var reader = new FileReader();
		   var base64data="";
		   reader.readAsDataURL(file);
		   reader.onload = function () {
		   console.log(reader.result);
		   base64data = reader.result;
		   console.log(base64data);

		 Session.set("promotion_image_session",base64data);

		};
    
   }
  }
 } 



function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}

