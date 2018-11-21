

import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import swal from 'sweetalert';

import { user_details }  from './../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

// document.title = "Special Neighborhood | Forgot password";

var check_user;

Template.change_password_content.onDestroyed(function(){
  check_user.stop();
});

Template.change_password_content.onRendered(function(){

  var url = window.location.href;
  var new_url = url.split("/");
  url = new_url[new_url.length - 1];
  var user_id = Base64.decode(url);
  Session.set("userId",user_id);
});

Template.change_password_content.events({

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
		// alert('sssss');
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