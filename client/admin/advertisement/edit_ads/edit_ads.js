
import { Template } from 'meteor/templating';
import { promotion } from './../../../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

import { Session } from 'meteor/session';


var book_listing;

Template.edit_promotion_details.onDestroyed(function () {
  book_listing.stop();
});

   Template.edit_promotion_details.onRendered(function(){

   	   var url = window.location.href;

        var new_url = url.split("/");
        url = new_url[new_url.length-1];
        var promotion_id = Base64.decode(url); 
        // alert(promotion_id);

        Session.set("promotion_id",promotion_id);
        book_listing = Meteor.subscribe("fetch_promotion_listing_with_id",promotion_id);
        var result = promotion.find({promotion_id: promotion_id}).fetch();
        
  Meteor.call('fetch_promotion_details', promotion_id, function (error, result) {
    if (error) {
      console.log("Some error occured.");
    } else {
    

     console.log('ok');
     console.log(result);
	 var promotion_type = result[0].promotion_type;
	 var promotion_id = result[0].promotion_id;
	 var promotion_start_date = result[0].promotion_start_date;
	 var promotion_end_date = result[0].promotion_end_date;
	 var promotion_url = result[0].promotion_url;
	 var promotion_title = result[0].promotion_title;
	 var promotion_content = result[0].promotion_content;
	 //alert(s1);
	
	 // $("#promotion_content").val(promotion_content);
	 $("#promotion_start_date").val(promotion_start_date);
	 $("#promotion_end_date").val(promotion_end_date);
	 $("#promotion_url").val(promotion_url);
	 $("#promotion_title").val(promotion_title);
	 // alert('promotion_id'+promotion_id);
	 $("#hidden_promotion_id").val(promotion_id);


    $("#hidden_promotion_type").val();
	$("#promotion_type").val(promotion_type);
	 $('#promotion_type').addClass("disabled");

			if(promotion_type == 'Textual'){
   			console.log('case 1');
			$('#promotion_discription_box').removeClass('loader_visiblity_block');
			$('#promotion_picture_box').addClass('loader_visiblity_block');
		
			$("#promotion_discription").val(promotion_content);

		}
   		else if(promotion_type == 'Picture'){
   			console.log('case 2');
   			$('#promotion_picture_box').removeClass('loader_visiblity_block');
   			$('#promotion_discription_box').addClass('loader_visiblity_block');
   			
   			$("#image_block").attr("src",promotion_content);
   			Session.set("promotion_image_session",promotion_content);
		}
	}
});

  });
// Template.ads_create.onRendered(function(){
// //GoogleMaps.load();
// 	alert(GoogleMaps);
//  if (GoogleMaps.loaded()) {
//  	alert("aa gaya");
//       $("#location").geocomplete({ details: "form" });

//     }

// });
Template.edit_promotion_details.helpers({

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

  uploaded_image:function(){
  var user_id = Session.get("userId");
    var image_Name = Session.get("imagePath_admin_ads");
  if(image_Name){    
    // alert(image_Name);
  var display_image = image_Name;
    return display_image;
  }   
  else{    
           var display_image = '/uploads/default/Default_group.png';
           return display_image;
      }    
  },  

	userinfo:function()
	{ 
		var userid=Session.get('userId');
		var sent_to=this.sent_to;
		var sent_by=this.sent_by;
		
		//alert(sent_to);
		if(userid!=sent_to)
		{
			var sent_too=this.sent_to;
		}
		if(userid!=sent_by)
		{
			var sent_too=this.sent_by;
		}
		//alert(sent_too);
		return UserInfo.find({user_id:sent_too}).fetch();
	},
});

Template.edit_promotion_details.events({

		"change #promotion_image":function(e, template) {
			alert('ok');
			upload_cover_pic(e, template);
		},

		"change #promotion_type":function(){
        
        // alert('here i am');
		var promotion_type = $("#promotion_type").val();
		if(promotion_type == 'Textual'){
			// alert('case 1');
			$('#promotion_discription_box').removeClass('loader_visiblity_block');
			$('#promotion_picture_box').addClass('loader_visiblity_block');
		}
   		else if(promotion_type == 'Picture'){
			// alert('case 2');
   			$('#promotion_discription_box').addClass('loader_visiblity_block');
   			$('#promotion_picture_box').removeClass('loader_visiblity_block')

		}
	},

	'click #edit_promotion':function()
	{
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
					alert('Cover image cannot be empty for cover_image');
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

		var promotion_id = $('#hidden_promotion_id').val();
    
    // alert(promotion_id+promotion_title+promotion_type+promotion_url+promotion_content+promotion_start_date+promotion_end_date);

    Meteor.call('update_promotion',promotion_id,promotion_title,promotion_type,promotion_url,
    	promotion_content,promotion_start_date,promotion_end_date,function(error,result){
              if(error){
                console.log("Some error occured.");
              }else{ 
               	alert("promotions sucessfully updated!");
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

