
import { Template } from 'meteor/templating';
import { Base64 } from 'meteor/ostrio:base64';

import { Session } from 'meteor/session';
import swal from 'sweetalert';

   Template.edit_blog_adming_details.onRendered(function(){
	// 	$.getScript("https://cdnjs.cloudflare.com/ajax/libs/pikaday/1.6.1/pikaday.min.js",function(){
	// 	    // swal("loaded: ");
	// 	    var picker = new Pikaday({ field: document.getElementById('blog_publish_date'),minDate: new Date(), });
	// });
	Session.set("blog_cover_session","");

	  var url = window.location.href;
  var new_url = url.split("/");
  url = new_url[new_url.length - 1];
  var blog_id = Base64.decode(url);


  Meteor.call('fetch_blog_details', blog_id, function (error, result) {
    if (error) {
      console.log("Some error occured.");
    } else {
      console.log('result: ');
      console.log(result);
      console.log("book details successfully fetched!");

      var blog_title = result[0].blog_title;
      var blog_type = result[0].blog_type;
      var blog_id = result[0].blog_id;
      var blog_discription = result[0].blog_discription;
      // var blog_publish_date = result[0].blog_publish_date;
      var blog_cover = result[0].blog_cover;

      $('#blog_title').val(blog_title);
      $('#blog_type').val(blog_type);

      $('#blog_discription').trumbowyg('html',blog_discription);
      // $('#blog_publish_date').val(blog_publish_date);

      Session.set("blog_cover_session",blog_cover);
      $("#blog_hidden_id").val(blog_id);
      $("#image_block").attr("src",blog_cover);
    }
  });

  });

Template.edit_blog_adming_details.helpers({
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



    blog_cover(){
      if(Session.get("blog_cover_session")){
      var user_cover = Session.get("blog_cover_session");
      return user_cover;
    }
    },

});

Template.edit_blog_adming_details.events({

	"change #blog_cover":function (e, template) {
	    upload_cover_pic(e, template);
	},

	"click #go_back":function (e, template) {
	    window.history.go(-1);
	},

	'click #update_blog':function()
	{   
		var blog_title = $("#blog_title").val();
		var blog_type = $("#blog_type").val();
		var blog_discription = $("#blog_discription").val();
		// var blog_publish_date = $("#blog_publish_date").val();

		if(blog_title == '' || blog_title == null)
		{
			$("#blog_title").addClass('emptyfield_focus');
			$("#blog_title").focus();
			return false;
		}else
		{
			$("#blog_title").removeClass('emptyfield_focus');
		}

		if(blog_type == '' || blog_type == null)
		{
			$("#blog_type").addClass('emptyfield3');
			$("#blog_type").focus();
			return false;
		}else
		{
			$("#blog_type").removeClass('emptyfield3');
		}

		if(blog_discription == '' || blog_discription == null)
		{
			$("#blog_discription").addClass('emptyfield_focus');
			$("#blog_discription").focus();
			return false;
		}else
		{
			$("#blog_discription").removeClass('emptyfield_focus');
		}

		// if(blog_publish_date == '' || blog_publish_date == null)
		// {
		// 	$("#blog_publish_date").addClass('emptyfield_focus');
		// 	$("#blog_publish_date").focus();
		// 	return false;
		// }else
		// {
		// 	$("#blog_publish_date").removeClass('emptyfield_focus');
		// }		

	    if(Session.get("blog_cover_session")){
		  var blog_cover = Session.get("blog_cover_session");
		}
		else{
					$('#blog_cover').addClass('empty_field').focus();
					return false;
		}

		var blog_id = $("#blog_hidden_id").val();

		var logged_in_user = Session.get('userId');
		// swal('logged_in_user: '+logged_in_user+'blog_title: '+blog_title+' blog_type: '+blog_type+' blog_publish_date: '+blog_publish_date);

    Meteor.call('update_blog',blog_id,blog_cover,blog_title,blog_type,blog_discription,logged_in_user,blog_cover,function(error,result){
              if(error){
                console.log("Some error occured.");
              }else{ 
               	console.log("blog sucessfully saved!");
                window.location.href="/blog_listing_admin";            
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

		 Session.set("blog_cover_session",base64data);

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