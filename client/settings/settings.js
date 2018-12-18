

import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import swal from 'sweetalert';

import { user_details }  from './../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

// document.title = "Special Neighborhood | Forgot password";

var check_user;
Template.user_settings_content.onDestroyed(function(){
  check_user.stop();
});

Template.user_settings_content.onRendered(function(){
    check_user = Meteor.subscribe('fetch_user_listing');

    var logged_in_user = Session.get("userId");

        Meteor.call("get_logged_in_user_info",logged_in_user,function(error,result){

	        if(error){
	        // swal("Some error occure");
	        }else{
	        	
	        	// swal(result.user_password);
	        	$("#password").val(result[0].user_password);
	        }
	    });

});

Template.user_settings_content.events({


	"click #showpassword":function(){
		var att=$("#password").attr("type");
		if(att=="password")
		{
			$("#password").attr("type","text");
			$("#passeye").attr("class","fa fa-eye-slash");
		}else{
			$("#password").attr("type","password");
			$("#passeye").attr("class","fa fa-eye");
		}
		//alert(att);
	},

	'click .show_password': function(){
  
  var input = $('#password').attr("type");

  if (input == "password"){
    $('#password').attr("type", "text");

    $('#sign_up_eye_open').addClass("loader_visiblity_block");
    $('#sign_up_eye_close').removeClass("loader_visiblity_block");

  } else {
    $('#password').attr("type", "password");


    $('#sign_up_eye_close').addClass("loader_visiblity_block");
    $('#sign_up_eye_open').removeClass("loader_visiblity_block");

  }
},

	'click #update_password':function(){
		var pass=$("#password").val().trim();
		var userId =Session.get('userId');
		 
		 	  $("#save_text").addClass("div_hide_class");
			  $("#loader_gif").removeClass("div_hide_class");

		//alert(pass);
		if(pass == '' || pass == null){
			  $("#password").addClass('emptyfield').focus();
		 	  $("#save_text").removeClass("div_hide_class");
			  $("#loader_gif").addClass("div_hide_class");
		}
		else{
			 $("#password").removeClass('emptyfield').blur();
			Meteor.call("change_password",Session.get("userId"),pass,function(error,result){
		 
		 	  $("#save_text").removeClass("div_hide_class");
			  $("#loader_gif").addClass("div_hide_class");

	        if(error){
	        swal("Some error occure");
	        }else{
	        	Session.setPersistent("userId",Session.get("userId"));
	        	swal(result.msg);
	        	window.location.href= '/feed';
	        }
	    });
       }
     },

});



  function ValidateEmail(email) {

    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return (true);
    }
        swal({
      text: 'Please enter a valid email ID',
      button: "ok",
      icon: "warning",
      dangerMode: true,
    });
    $("#email_addr").addClass('emptyfield').focus();
    return (false)
  }