

import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import swal from 'sweetalert';

import { user_details }  from './../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

// document.title = "Special Neighborhood | Forgot password";

var check_user;

Template.forgot_password.onDestroyed(function(){
  check_user.stop();
});


Template.forgot_password.onRendered(function(){
    check_user = Meteor.subscribe('fetch_user_listing');
});

Template.forgot_password.events({

	"click #send_mail":function(event){
		event.preventDefault();
		// alert('ok');

		 $("#save_text").addClass("div_hide_class");
		 $("#loader_gif").removeClass("div_hide_class");

		var email_addr=$("#email_addr").val().trim();
		// alert(email_addr);
		if(email_addr == '' || email_addr == null){
			  $("#email_addr").addClass('emptyfield').focus();
			  $("#save_text").removeClass("div_hide_class");
			  $("#loader_gif").addClass("div_hide_class");
		}else{
alert('2');
		var validation_result = ValidateEmail(email_addr);
		var count = user_details.find({user_email: email_addr}).count();
		console.log(count);
		// alert(c);
		$("#email_addr").removeClass('emptyfield').blur();
		if(count == 0){
			//$("#errorlabel").text("This email address does not exist in our system");
			//$("#errorlabel").addClass("errorlabel");
			swal("This email address does not exist in our system");
			  $("#save_text").removeClass("div_hide_class");
			  $("#loader_gif").addClass("div_hide_class");
		}else
		{
		
	    Meteor.call('send_email_for_forgot_password',email_addr,function(error,result){
		        if(error){
		          // console.log("Error");
		          swal(error);
		        }else{
		        	swal(result.msg);
		        	Router.go("/");
				}
			});
			}
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